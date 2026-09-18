import { createHash } from "crypto";
import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "../../../lib/ses";
import { adminDb } from "../../../lib/firebase-admin";

export const dynamic = "force-dynamic";

const OTP_VALIDITY_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 2 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const normalizedEmail = String(body?.email || "")
      .trim()
      .toLowerCase();

    const normalizedDonorId = String(body?.donorId || "").trim();

    if (!normalizedEmail || !normalizedDonorId) {
      return NextResponse.json(
        {
          success: false,
          message: "Donor ID এবং নিবন্ধিত ইমেইল প্রয়োজন।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // FIRESTORE REFERENCES
    // --------------------------------------------------

    const donorRef = adminDb
      .collection("donors")
      .doc(normalizedDonorId);

    const privateRef = adminDb
      .collection("donorPrivate")
      .doc(normalizedDonorId);

    const otpRef = adminDb
      .collection("otps")
      .doc(normalizedEmail);

    const lockRef = adminDb
      .collection("otpLocks")
      .doc(normalizedEmail);

    // --------------------------------------------------
    // READ REQUIRED DOCUMENTS
    // --------------------------------------------------

    const [
      donorSnap,
      privateSnap,
      otpSnap,
      lockSnap,
    ] = await Promise.all([
      donorRef.get(),
      privateRef.get(),
      otpRef.get(),
      lockRef.get(),
    ]);

    // --------------------------------------------------
    // DONOR VALIDATION
    // --------------------------------------------------

    if (!donorSnap.exists || !privateSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "ডোনারের তথ্য পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // REGISTERED EMAIL VALIDATION
    // --------------------------------------------------

    const privateData = privateSnap.data() || {};

    const registeredEmail = String(
      privateData.email || ""
    )
      .trim()
      .toLowerCase();

    if (
      !registeredEmail ||
      registeredEmail !== normalizedEmail
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
    // 20 MINUTE SECURITY LOCK CHECK
    // --------------------------------------------------

    if (lockSnap.exists) {
      const lockData = lockSnap.data() || {};

      const lockedUntil = Number(
        lockData.lockedUntil || 0
      );

      const now = Date.now();

      // Lock এখনো active
      if (
        lockedUntil > 0 &&
        now < lockedUntil
      ) {
        const retryAfterSeconds = Math.ceil(
          (lockedUntil - now) / 1000
        );

        const minutes = Math.floor(
          retryAfterSeconds / 60
        );

        const seconds =
          retryAfterSeconds % 60;

        const remainingTime = `${String(
          minutes
        ).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`;

        return NextResponse.json(
          {
            success: false,
            locked: true,
            message:
              "নিরাপত্তার কারণে OTP পাঠানো সাময়িকভাবে বন্ধ আছে। ২০ মিনিট পর আবার চেষ্টা করুন।",
            retryAfterSeconds,
            remainingTime,
          },
          { status: 429 }
        );
      }

      // Lock expired
      if (
        lockedUntil > 0 &&
        now >= lockedUntil
      ) {
        await lockRef.delete();
      }
    }

    // --------------------------------------------------
    // SERVER-SIDE 2-MINUTE RESEND COOLDOWN
    // --------------------------------------------------

    if (otpSnap.exists) {
      const otpData = otpSnap.data() || {};

      const createdAt = Number(
        otpData.createdAt || 0
      );

      const elapsed =
        Date.now() - createdAt;

      if (
        createdAt > 0 &&
        elapsed < OTP_RESEND_COOLDOWN_MS
      ) {
        const retryAfterSeconds =
          Math.ceil(
            (OTP_RESEND_COOLDOWN_MS - elapsed) /
              1000
          );

        return NextResponse.json(
          {
            success: false,
            message: `আবার OTP পাঠাতে ${Math.ceil(
              retryAfterSeconds / 60
            )} মিনিটের মতো অপেক্ষা করুন।`,
            retryAfterSeconds,
          },
          { status: 429 }
        );
      }
    }

    // --------------------------------------------------
    // SES CONFIGURATION
    // --------------------------------------------------

    const fromEmail = String(
      process.env.SES_FROM_EMAIL || ""
    )
      .trim()
      .replace(/^["']|["']$/g, "");

    const fromName = String(
      process.env.SES_FROM_NAME ||
        "Chandpur Nagorik"
    )
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!fromEmail) {
      console.error(
        "SES_FROM_EMAIL is missing."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Server configuration error.",
        },
        { status: 500 }
      );
    }

    // Basic email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(fromEmail)) {
      console.error(
        "Invalid SES_FROM_EMAIL:",
        fromEmail
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Server email configuration is invalid.",
        },
        { status: 500 }
      );
    }

    // SES sender with display name
    const sender = `${fromName} <${fromEmail}>`;

    // --------------------------------------------------
    // SECURE OTP GENERATION
    // --------------------------------------------------

    const otp = randomInt(
      100000,
      1000000
    ).toString();

    const now = Date.now();

    const expireTime =
      now + OTP_VALIDITY_MS;

    // --------------------------------------------------
    // HASH OTP
    // --------------------------------------------------

    /*
     * আসল OTP শুধু email-এ যাবে।
     *
     * Firestore-এ plaintext OTP রাখা হবে না।
     *
     * Example:
     *
     * OTP:
     * 583214
     *
     * Firestore:
     * SHA-256 hash
     */

    const otpHash = createHash("sha256")
      .update(otp)
      .digest("hex");

    // --------------------------------------------------
    // HTML EMAIL
    // --------------------------------------------------

    const html = `
      <div
        style="
          font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
          max-width:600px;
          margin:0 auto;
          background:#f4f7f6;
          padding:30px;
          border-radius:12px;
        "
      >
        <div
          style="
            background:#fff;
            padding:40px 30px;
            border-radius:12px;
            text-align:center;
          "
        >

          <div
            style="
              width:70px;
              height:70px;
              background:#ff4d4f;
              border-radius:50%;
              line-height:70px;
              color:#fff;
              font-size:35px;
              margin:0 auto 20px;
            "
          >
            🩸
          </div>

          <h2
            style="
              color:#2c3e50;
              font-size:24px;
            "
          >
            চাঁদপুর নাগরিক ব্লাড ব্যাংক
          </h2>

          <p
            style="
              color:#6c7a89;
              font-size:16px;
              line-height:1.6;
            "
          >
            আপনার স্ট্যাটাস আপডেট বা ডিলিট করার জন্য নিচের
            <strong>৬-ডিজিটের</strong>
            ভেরিফিকেশন কোডটি ব্যবহার করুন।
          </p>

          <div
            style="
              background:#fef2f2;
              border:2px dashed #ff7875;
              padding:20px;
              border-radius:10px;
              display:inline-block;
              min-width:250px;
            "
          >
            <h1
              style="
                color:#cf1322;
                font-size:32px;
                letter-spacing:6px;
                margin:0;
                font-family:monospace;
              "
            >
              ${otp}
            </h1>
          </div>

          <p
            style="
              color:#95a5a6;
              font-size:14px;
              line-height:1.6;
            "
          >
            এই কোডটির মেয়াদ আগামী
            <strong>৫ মিনিট</strong>
            পর্যন্ত থাকবে।
          </p>

          <hr
            style="
              border:none;
              border-top:1px solid #eee;
              margin:40px 0 20px;
            "
          >

          <p
            style="
              color:#95a5a6;
              font-size:12px;
              margin:0;
            "
          >
            ধন্যবাদান্তে,
            <br>
            <strong>টিম চাঁদপুর নাগরিক</strong>
          </p>

        </div>
      </div>
    `;

    // --------------------------------------------------
    // PLAIN TEXT EMAIL
    // --------------------------------------------------

    const text = `
চাঁদপুর নাগরিক ব্লাড ব্যাংক

আপনার ভেরিফিকেশন কোড: ${otp}

এই কোডটির মেয়াদ আগামী ৫ মিনিট পর্যন্ত থাকবে।

ধন্যবাদান্তে,
টিম চাঁদপুর নাগরিক
`.trim();

    // --------------------------------------------------
    // SES EMAIL COMMAND
    // --------------------------------------------------

    const command =
      new SendEmailCommand({
        Source: sender,

        Destination: {
          ToAddresses: [
            registeredEmail,
          ],
        },

        Message: {
          Subject: {
            Data: `আপনার ব্লাড ব্যাংক ভেরিফিকেশন কোড: ${otp}`,
            Charset: "UTF-8",
          },

          Body: {
            Html: {
              Data: html,
              Charset: "UTF-8",
            },

            Text: {
              Data: text,
              Charset: "UTF-8",
            },
          },
        },
      });

    // --------------------------------------------------
    // SEND EMAIL
    // --------------------------------------------------

    const result =
      await sesClient.send(command);

    // --------------------------------------------------
    // SAVE HASHED OTP
    // --------------------------------------------------

    /*
     * গুরুত্বপূর্ণ:
     *
     * এখানে otp নয়,
     * otpHash save হচ্ছে।
     *
     * তাই Firestore-এ আসল ৬-digit OTP থাকবে না।
     */

    await otpRef.set({
      otpHash,
      expiresAt: expireTime,
      createdAt: now,
      donorId: normalizedDonorId,
      attempts: 0,
    });

    // --------------------------------------------------
    // LOG
    // --------------------------------------------------

    console.log("SES OTP sent:", {
      messageId: result.MessageId,
      donorId: normalizedDonorId,
      sender,
    });

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error in send-otp route:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}