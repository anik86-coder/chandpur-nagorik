import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/ses";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const to = body?.to;
    const subject = body?.subject;
    const html = body?.html;
    const text = body?.text;
    const replyTo = body?.replyTo;

    if (!to || typeof to !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Recipient email is required.",
        },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Email subject is required.",
        },
        { status: 400 }
      );
    }

    if (!html || typeof html !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Email content is required.",
        },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      subject,
      html,
      text,
      replyTo,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully.",
      messageId: result.MessageId ?? null,
    });
  } catch (error) {
    console.error("Send email error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Email পাঠানো যায়নি।",
      },
      { status: 500 }
    );
  }
}