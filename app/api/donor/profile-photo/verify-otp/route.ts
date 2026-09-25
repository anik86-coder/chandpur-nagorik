import { NextRequest, NextResponse } from "next/server";
import {
  createHash,
  randomBytes,
} from "crypto";

import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_TOKEN_VALIDITY_MS =
  10 * 60 * 1000;

const MAX_OTP_ATTEMPTS = 5;

function hashValue(value: string) {
  const secret =
    process.env.PROFILE_PHOTO_OTP_SECRET;

  if (!secret) {
    throw new Error(
      "PROFILE_PHOTO_OTP_SECRET is missing."
    );
  }

  return createHash("sha256")
    .update(`${secret}:${value}`)
    .digest("hex");
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const donorId = String(
      body?.donorId || ""
    ).trim();

    const verificationId = String(
      body?.verificationId || ""
    ).trim();

    const otp = String(
      body?.otp || ""
    ).trim();

    if (
      !donorId ||
      !verificationId ||
      !otp
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification information সম্পূর্ণ নয়।",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "৬ সংখ্যার OTP দিন।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // SESSION
    // --------------------------------------------------

    const sessionRef = adminDb
      .collection("donorPhotoOtpSessions")
      .doc(verificationId);

    const sessionSnap =
      await sessionRef.get();

    if (!sessionSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification session পাওয়া যায়নি। নতুন OTP নিন।",
        },
        { status: 404 }
      );
    }

    const sessionData =
      sessionSnap.data() || {};

    // --------------------------------------------------
    // DONOR BINDING
    // --------------------------------------------------

    if (
      String(sessionData.donorId || "") !==
      donorId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification information সঠিক নয়।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // ALREADY VERIFIED
    // --------------------------------------------------

    if (
      sessionData.status ===
      "verified"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "এই OTP ইতিমধ্যে ব্যবহার করা হয়েছে।",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // EXPIRY
    // --------------------------------------------------

    const now = Date.now();

    const expiresAt = Number(
      sessionData.expiresAt || 0
    );

    if (
      !expiresAt ||
      now > expiresAt
    ) {
      await sessionRef.update({
        status: "expired",
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "OTP-এর মেয়াদ শেষ হয়ে গেছে। নতুন OTP নিন।",
        },
        { status: 410 }
      );
    }

    // --------------------------------------------------
    // ATTEMPTS
    // --------------------------------------------------

    const attempts = Number(
      sessionData.attempts || 0
    );

    if (attempts >= MAX_OTP_ATTEMPTS) {
      await sessionRef.update({
        status: "blocked",
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "অনেকবার ভুল OTP দেওয়া হয়েছে। নতুন OTP নিন।",
        },
        { status: 429 }
      );
    }

    // --------------------------------------------------
    // VERIFY OTP
    // --------------------------------------------------

    const incomingHash =
      hashValue(otp);

    const savedHash =
      String(
        sessionData.otpHash || ""
      );

    if (
      !savedHash ||
      incomingHash !== savedHash
    ) {
      const nextAttempts =
        attempts + 1;

      await sessionRef.update({
        attempts: nextAttempts,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            nextAttempts >=
            MAX_OTP_ATTEMPTS
              ? "OTP verification blocked। নতুন OTP নিন।"
              : "OTP সঠিক নয়। আবার চেষ্টা করুন।",
          remainingAttempts:
            Math.max(
              0,
              MAX_OTP_ATTEMPTS -
                nextAttempts
            ),
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // CREATE ONE-TIME UPLOAD TOKEN
    // --------------------------------------------------

    const uploadToken =
      randomBytes(32).toString("hex");

    const uploadTokenHash =
      hashValue(uploadToken);

    const uploadTokenExpiresAt =
      now + UPLOAD_TOKEN_VALIDITY_MS;

    await sessionRef.update({
      status: "verified",

      verifiedAt: now,

      uploadTokenHash,

      uploadTokenExpiresAt,

      // OTP hash remove করা হচ্ছে
      otpHash: null,
    });

    return NextResponse.json(
      {
        success: true,

        message:
          "Email verification সফল হয়েছে। এখন ছবি নির্বাচন করতে পারবেন।",

        verificationId,

        uploadToken,

        expiresInSeconds:
          UPLOAD_TOKEN_VALIDITY_MS /
          1000,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Profile photo OTP verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "OTP verify করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}