import { NextRequest, NextResponse } from "next/server";
import { randomInt, createHash } from "crypto";

import { adminDb } from "@/lib/firebase-admin";
import { sendEmail } from "@/lib/ses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OTP_VALIDITY_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 2 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function hashValue(value: string) {
  const secret = process.env.PROFILE_PHOTO_OTP_SECRET;

  if (!secret) {
    throw new Error(
      "PROFILE_PHOTO_OTP_SECRET is missing."
    );
  }

  return createHash("sha256")
    .update(`${secret}:${value}`)
    .digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const donorId = String(
      body?.donorId || ""
    ).trim();

    const email = normalizeEmail(
      String(body?.email || "")
    );

    if (!donorId || !email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Donor ID এবং ইমেইল প্রয়োজন।",
        },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "সঠিক ইমেইল ঠিকানা দিন।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // DONOR CHECK
    // --------------------------------------------------

    const donorRef = adminDb
      .collection("donors")
      .doc(donorId);

    const privateRef = adminDb
      .collection("donorPrivate")
      .doc(donorId);

    const [donorSnap, privateSnap] =
      await Promise.all([
        donorRef.get(),
        privateRef.get(),
      ]);

    if (!donorSnap.exists || !privateSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ডোনারের তথ্য পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    const donorData =
      donorSnap.data() || {};

    const privateData =
      privateSnap.data() || {};

    // --------------------------------------------------
    // ACTIVE CHECK
    // --------------------------------------------------

    if (
      donorData.deletedAt ||
      donorData.active === false
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "এই donor profile বর্তমানে active নয়।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 15-DAY LOCK
    // --------------------------------------------------

    const lockedUntil = Number(
      donorData.profilePhotoLockedUntil || 0
    );

    if (
      lockedUntil > 0 &&
      Date.now() < lockedUntil
    ) {
      const remainingDays = Math.ceil(
        (lockedUntil - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      return NextResponse.json(
        {
          success: false,
          message: `প্রোফাইল ছবি পরিবর্তন বর্তমানে locked। আরও প্রায় ${remainingDays} দিন পর পরিবর্তন করতে পারবেন।`,
          lockedUntil,
        },
        { status: 429 }
      );
    }

    // --------------------------------------------------
    // REGISTERED EMAIL CHECK
    // --------------------------------------------------

    const registeredEmail =
      normalizeEmail(
        String(privateData.email || "")
      );

    if (
      !registeredEmail ||
      registeredEmail !== email
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "এই ইমেইলটি এই ডোনারের নিবন্ধিত ইমেইল নয়।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // CHECK EXISTING PENDING REQUEST
    // --------------------------------------------------

    const pendingSnap =
      await adminDb
        .collection("donorPhotoRequests")
        .where("donorId", "==", donorId)
        .where("status", "==", "pending")
        .limit(1)
        .get();

    if (!pendingSnap.empty) {
      return NextResponse.json(
        {
          success: false,
          message:
            "আপনার একটি profile photo request ইতিমধ্যে Admin approval-এর অপেক্ষায় আছে।",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // PREVIOUS OTP SESSION
    // --------------------------------------------------

    const sessionRef = adminDb
      .collection("donorPhotoOtpSessions")
      .doc();

    const otp = randomInt(
      100000,
      1000000
    ).toString();

    const now = Date.now();

    const otpHash = hashValue(otp);

    // --------------------------------------------------
    // EMAIL
    // --------------------------------------------------

    await sendEmail({
      to: registeredEmail,

      subject:
        "Chandpur Nagorik - Profile Photo Verification Code",

      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;">
          <h2 style="color:#dc2626;">
            Profile Photo Verification
          </h2>

          <p>
            আপনার প্রোফাইল ছবি পরিবর্তনের অনুরোধের জন্য
            verification code:
          </p>

          <div style="
            margin:24px 0;
            padding:18px;
            background:#fef2f2;
            border:1px solid #fecaca;
            border-radius:12px;
            text-align:center;
            font-size:32px;
            font-weight:800;
            letter-spacing:8px;
            color:#dc2626;
          ">
            ${otp}
          </div>

          <p>
            এই কোডটি <strong>৫ মিনিট</strong> পর্যন্ত valid।
          </p>

          <p style="color:#666;font-size:13px;">
            আপনি যদি এই request না করে থাকেন,
            তাহলে এই email উপেক্ষা করুন।
          </p>
        </div>
      `,

      text: `
Chandpur Nagorik

আপনার profile photo verification code:

${otp}

এই code ৫ মিনিট পর্যন্ত valid।
আপনি যদি এই request না করে থাকেন, এই email উপেক্ষা করুন।
      `,
    });

    // --------------------------------------------------
    // SAVE OTP SESSION
    // --------------------------------------------------

    await sessionRef.set({
      donorId,
      email: registeredEmail,

      otpHash,

      status: "otp_sent",

      attempts: 0,

      createdAt: now,
      expiresAt:
        now + OTP_VALIDITY_MS,

      lastSentAt: now,

      verifiedAt: null,

      uploadTokenHash: null,
      uploadTokenExpiresAt: null,
    });

    return NextResponse.json(
      {
        success: true,

        message:
          "আপনার নিবন্ধিত ইমেইলে OTP পাঠানো হয়েছে।",

        verificationId:
          sessionRef.id,

        expiresInSeconds:
          OTP_VALIDITY_MS / 1000,

        resendAfterSeconds:
          OTP_RESEND_COOLDOWN_MS / 1000,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Profile photo send OTP error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "OTP পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}