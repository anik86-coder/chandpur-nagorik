import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, otp, donorId } = await request.json();

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    const normalizedOtp = String(otp || "").trim();
    const normalizedDonorId = String(donorId || "").trim();

    if (!normalizedEmail || !normalizedOtp || !normalizedDonorId) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, OTP এবং Donor ID প্রয়োজন",
        },
        { status: 400 }
      );
    }

    const otpRef = adminDb
      .collection("otps")
      .doc(normalizedEmail);

    const donorRef = adminDb
      .collection("donors")
      .doc(normalizedDonorId);

    /*
     * OTP verification + donor update একই Firestore transaction-এর
     * মধ্যে করা হচ্ছে।
     *
     * ফলে:
     * 1. OTP সঠিক হতে হবে
     * 2. OTP expired হওয়া যাবে না
     * 3. Email অবশ্যই donor-এর registered email-এর সাথে মিলতে হবে
     * 4. Donor update সফল হলেই OTP delete হবে
     */
    const result = await adminDb.runTransaction(async (transaction) => {
      const otpSnap = await transaction.get(otpRef);
      const donorSnap = await transaction.get(donorRef);

      if (!otpSnap.exists) {
        throw new Error("OTP_NOT_FOUND");
      }

      if (!donorSnap.exists) {
        throw new Error("DONOR_NOT_FOUND");
      }

      const otpData = otpSnap.data();
      const donorData = donorSnap.data();

      if (!otpData) {
        throw new Error("OTP_NOT_FOUND");
      }

      if (!donorData) {
        throw new Error("DONOR_NOT_FOUND");
      }

      // OTP expiry check
      if (
        !otpData.expiresAt ||
        Date.now() > Number(otpData.expiresAt)
      ) {
        throw new Error("OTP_EXPIRED");
      }

      // OTP check
      if (String(otpData.otp) !== normalizedOtp) {
        throw new Error("INVALID_OTP");
      }

      // Security check:
      // যে email-এ OTP গেছে, সেটা donor-এর registered email কিনা।
      const registeredEmail = String(donorData.email || "")
        .trim()
        .toLowerCase();

      if (
        !registeredEmail ||
        registeredEmail !== normalizedEmail
      ) {
        throw new Error("EMAIL_MISMATCH");
      }

      // আজকের donation date
      const todayStr = new Date()
        .toISOString()
        .split("T")[0];

      // Donor update
      transaction.update(donorRef, {
        lastDonation: todayStr,
      });

      // Update সফল হওয়ার transaction-এর অংশ হিসেবেই OTP delete
      transaction.delete(otpRef);

      return {
        lastDonation: todayStr,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "OTP ভেরিফাই এবং ডোনেশন স্ট্যাটাস আপডেট সফল হয়েছে!",
        lastDonation: result.lastDonation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying/updating OTP:", error);

    const errorCode = error?.message;

    if (errorCode === "OTP_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "কোনো OTP পাওয়া যায়নি বা মেয়াদ শেষ হয়ে গেছে।",
        },
        { status: 400 }
      );
    }

    if (errorCode === "OTP_EXPIRED") {
      return NextResponse.json(
        {
          success: false,
          message: "OTP এর মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।",
        },
        { status: 400 }
      );
    }

    if (errorCode === "INVALID_OTP") {
      return NextResponse.json(
        {
          success: false,
          message: "ভুল OTP দেওয়া হয়েছে।",
        },
        { status: 400 }
      );
    }

    if (errorCode === "DONOR_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message: "ডোনারের তথ্য পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    if (errorCode === "EMAIL_MISMATCH") {
      return NextResponse.json(
        {
          success: false,
          message: "এই ইমেইলটি এই ডোনারের নিবন্ধিত ইমেইল নয়।",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "OTP যাচাই বা স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।",
      },
      { status: 500 }
    );
  }
}