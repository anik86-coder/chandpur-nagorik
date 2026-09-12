import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body?.token;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "CAPTCHA token পাওয়া যায়নি।",
          errorCodes: ["missing-input-response"],
        },
        { status: 400 }
      );
    }

    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      console.error("TURNSTILE_SECRET_KEY is missing");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
          errorCodes: ["missing-secret-key"],
        },
        { status: 500 }
      );
    }

    const response = await fetch(
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
      }
    );

    if (!response.ok) {
      console.error(
        "Cloudflare Turnstile HTTP error:",
        response.status,
        response.statusText
      );

      return NextResponse.json(
        {
          success: false,
          message: "Cloudflare CAPTCHA server-এর সাথে যোগাযোগ করা যায়নি।",
          errorCodes: ["cloudflare-http-error"],
        },
        { status: 502 }
      );
    }

    const result = await response.json();

    // Secret কখনো log/return করা হবে না।
    console.log("TURNSTILE RESULT:", {
      success: result?.success,
      errorCodes: result?.["error-codes"] || [],
      hostname: result?.hostname || null,
      action: result?.action || null,
    });

    if (!result?.success) {
      const errorCodes = result?.["error-codes"] || [];

      let message = "CAPTCHA verification সফল হয়নি। আবার চেষ্টা করুন।";

      if (errorCodes.includes("invalid-input-secret")) {
        message = "Turnstile Secret Key সঠিক নয়।";
      } else if (errorCodes.includes("invalid-input-response")) {
        message = "CAPTCHA token সঠিক নয় বা token-এর মেয়াদ শেষ হয়েছে।";
      } else if (errorCodes.includes("timeout-or-duplicate")) {
        message = "CAPTCHA token-এর মেয়াদ শেষ হয়েছে। আবার যাচাই করুন।";
      } else if (errorCodes.includes("missing-input-secret")) {
        message = "Turnstile Secret Key পাওয়া যায়নি।";
      } else if (errorCodes.includes("missing-input-response")) {
        message = "CAPTCHA token পাওয়া যায়নি।";
      }

      return NextResponse.json(
        {
          success: false,
          message,
          errorCodes,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "CAPTCHA verification সফল হয়েছে।",
    });
  } catch (error) {
    console.error("Turnstile verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "CAPTCHA verification করতে সমস্যা হয়েছে।",
        errorCodes: ["server-error"],
      },
      { status: 500 }
    );
  }
}