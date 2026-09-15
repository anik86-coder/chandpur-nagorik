import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    // + চিহ্ন remove করে একই format রাখা হবে
    const formattedPhone = String(phoneNumber)
      .trim()
      .replace(/\+/g, "");

    // ৪-ডিজিট OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const apiKey = process.env.SMS_API_KEY;

    if (!apiKey) {
      console.error("SMS_API_KEY is missing.");

      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    const message = `${otp} হলো আপনার চাঁদপুর নাগরিক অ্যাপের OTP.`;

    const params = new URLSearchParams();

    params.append("api_key", apiKey);
    params.append("msg", message);
    params.append("to", formattedPhone);

    const smsResponse = await fetch(
      "https://api.sms.net.bd/sendsms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const smsResult = await smsResponse.json();

    if (smsResult.error === 0) {
      const expireTime = Date.now() + 5 * 60 * 1000;

      // Firebase Admin দিয়ে OTP save
      await adminDb
        .collection("phone_otps")
        .doc(formattedPhone)
        .set({
          otp,
          expiresAt: expireTime,
          createdAt: Date.now(),
        });

      return NextResponse.json(
        { message: "OTP sent successfully" },
        { status: 200 }
      );
    }

    console.error("SMS Gateway Error:", smsResult);

    return NextResponse.json(
      {
        message:
          smsResult.msg || "Failed to send SMS",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error sending SMS OTP:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}