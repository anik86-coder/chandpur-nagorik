import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

// Resend ইনিশিয়ালাইজ করা
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Resend দিয়ে ইমেইল সেন্ড করা
    const { data, error } = await resend.emails.send({
      from: 'Chandpur Nagorik <onboarding@resend.dev>', // ডোমেইন ভেরিফাই হলে এখানে info@chandpurnagorik.com দেবেন
      to: email,
      subject: `আপনার ব্লাড ব্যাংক OTP: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #333;">Chandpur Nagorik Blood Bank</h2>
          <p style="font-size: 16px;">আপনার OTP কোডটি নিচে দেওয়া হলো:</p>
          <h1 style="background: #f4f4f4; padding: 10px; color: #d9534f; letter-spacing: 5px; border-radius: 5px; display: inline-block;">${otp}</h1>
          <p style="font-size: 14px; color: #777;">এই কোডটি ৫ মিনিট পর্যন্ত কার্যকর থাকবে।</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ message: 'Failed to send OTP' }, { status: 400 });
    }

    const expireTime = Date.now() + 5 * 60 * 1000;
    await setDoc(doc(db, "otps", email), {
      otp: otp,
      expiresAt: expireTime
    });

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error in send-otp route:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}