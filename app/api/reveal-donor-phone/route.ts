import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = body?.token;
    const donorId = body?.donorId;

    // Token check
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "CAPTCHA token পাওয়া যায়নি।",
        },
        { status: 400 }
      );
    }

    // Donor ID check
    if (!donorId || typeof donorId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Donor ID পাওয়া যায়নি।",
        },
        { status: 400 }
      );
    }

    // Turnstile secret
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      console.error("TURNSTILE_SECRET_KEY is missing");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500 }
      );
    }

    // Cloudflare Turnstile verification
    const cloudflareResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret,
          response: token,
        }),
        cache: "no-store",
      }
    );

    if (!cloudflareResponse.ok) {
      console.error(
        "Cloudflare HTTP error:",
        cloudflareResponse.status,
        cloudflareResponse.statusText
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudflare verification server-এর সাথে যোগাযোগ করা যায়নি।",
        },
        { status: 502 }
      );
    }

    const result = await cloudflareResponse.json();

    console.log("TURNSTILE RESULT:", {
      success: result?.success,
      errorCodes: result?.["error-codes"] || [],
      hostname: result?.hostname || null,
      action: result?.action || null,
    });

    // Turnstile failed
    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "CAPTCHA verification সফল হয়নি। আবার চেষ্টা করুন।",
          errorCodes: result?.["error-codes"] || [],
        },
        { status: 403 }
      );
    }

    // Private donor information থেকে phone নেওয়া
    const privateDoc = await adminDb
      .collection("donorPrivate")
      .doc(donorId)
      .get();

    if (!privateDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "এই ডোনারের যোগাযোগের তথ্য পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    const privateData = privateDoc.data() || {};

    const phone =
      typeof privateData.phone === "string"
        ? privateData.phone
        : "";

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "এই ডোনারের মোবাইল নম্বর পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    // শুধুমাত্র phone browser-এ পাঠানো হবে
    return NextResponse.json({
      success: true,
      phone,
    });
  } catch (error) {
    console.error("Reveal donor phone error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "মোবাইল নম্বর দেখাতে সমস্যা হয়েছে।",
      },
      { status: 500 }
    );
  }
}