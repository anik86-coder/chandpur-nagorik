import { NextResponse } from "next/server";

const UDDOKTAPAY_API_URL =
  "https://chandpurnagorik.paymently.io/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName =
      typeof body.full_name === "string"
        ? body.full_name.trim()
        : "";

    const note =
      typeof body.note === "string"
        ? body.note.trim()
        : "";

    const amount =
      typeof body.amount === "string"
        ? body.amount.trim()
        : "";

    // --------------------------------------------------
    // AMOUNT VALIDATION
    // --------------------------------------------------

    if (!amount) {
      return NextResponse.json(
        {
          status: false,
          message:
            "অনুদানের পরিমাণ প্রয়োজন।",
        },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          status: false,
          message:
            "অনুদানের পরিমাণ সঠিক নয়।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // API KEY
    // --------------------------------------------------

    const apiKey =
      process.env.UDDOKTAPAY_API_KEY;

    if (!apiKey) {
      console.error(
        "UDDOKTAPAY_API_KEY is missing."
      );

      return NextResponse.json(
        {
          status: false,
          message:
            "Payment configuration is missing on the server.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // SITE URL
    // --------------------------------------------------

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://chandpurnagorik.com";

    // --------------------------------------------------
    // SYSTEM EMAIL
    // UddoktaPay requires an email field.
    // User does NOT need to enter an email.
    // --------------------------------------------------

    const paymentEmail =
      process.env.SES_FROM_EMAIL ||
      "no-reply@chandpurnagorik.com";

    // --------------------------------------------------
    // METADATA
    // --------------------------------------------------

    const metadata = {
      source: "chandpur-nagorik-donation",
      donor_name: fullName || "Anonymous",
      note: note || "",
    };

    // --------------------------------------------------
    // CREATE PAYMENT
    // --------------------------------------------------

    const response = await fetch(
      `${UDDOKTAPAY_API_URL}/checkout-v2`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "RT-UDDOKTAPAY-API-KEY": apiKey,
        },

        body: JSON.stringify({
          full_name:
            fullName || "Anonymous Donor",

          email: paymentEmail,

          amount:
            numericAmount.toFixed(2),

          metadata,

          redirect_url:
            `${siteUrl}/donation/success`,

          return_type: "GET",

          cancel_url:
            `${siteUrl}/donation/cancel`,
        }),

        cache: "no-store",
      }
    );

    const data = await response.json();

    // --------------------------------------------------
    // PAYMENT URL VALIDATION
    // --------------------------------------------------

    if (
      !response.ok ||
      !data?.payment_url
    ) {
      console.error(
        "UddoktaPay checkout error:",
        data
      );

      return NextResponse.json(
        {
          status: false,
          message:
            data?.message ||
            "UddoktaPay থেকে payment URL পাওয়া যায়নি।",
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return NextResponse.json({
      status: true,
      payment_url: data.payment_url,
    });

  } catch (error) {
    console.error(
      "Donation create error:",
      error
    );

    return NextResponse.json(
      {
        status: false,
        message:
          "পেমেন্ট শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}