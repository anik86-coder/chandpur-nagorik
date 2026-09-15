import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const phoneNumber = String(body.phoneNumber || "")
      .trim()
      .replace(/\+/g, "");

    const otp = String(body.otp || "").trim();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "নম্বর এবং OTP প্রয়োজন",
        },
        { status: 400 }
      );
    }

    // Firebase Admin দিয়ে OTP খোঁজা
    const otpDocRef = adminDb
      .collection("phone_otps")
      .doc(phoneNumber);

    const otpDoc = await otpDocRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "কোনো কোড পাঠানো হয়নি বা মেয়াদ শেষ",
        },
        { status: 404 }
      );
    }

    const data = otpDoc.data();

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP data পাওয়া যায়নি",
        },
        { status: 400 }
      );
    }

    // Expiry check
    if (Date.now() > Number(data.expiresAt)) {
      await otpDocRef.delete();

      return NextResponse.json(
        {
          success: false,
          message: "OTP-এর মেয়াদ শেষ হয়ে গেছে",
        },
        { status: 400 }
      );
    }

    // OTP check
    if (String(data.otp) === otp) {
      await otpDocRef.delete();

      return NextResponse.json(
        {
          success: true,
          message: "লগইন সফল",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "ভুল কোড দেওয়া হয়েছে",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Verify SMS OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "সার্ভার এরর",
      },
      { status: 500 }
    );
  }
}