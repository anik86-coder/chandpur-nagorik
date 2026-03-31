import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

// Next.js-কে বলে দেওয়া যে এটি একটি ডাইনামিক API, বিল্ডের সময় যেন চেক না করে
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // ⚠️ ম্যাজিক ফিক্স: Resend ইনিশিয়ালাইজেশন ফাংশনের ভেতরে নিয়ে আসা হলো!
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // ৬-ডিজিটের র‍্যান্ডম OTP তৈরি
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Resend দিয়ে ইমেইল সেন্ড করা
    const { data, error } = await resend.emails.send({
      from: 'Chandpur Nagorik <info@chandpurnagorik.com>', // আপনার ভেরিফাই করা ডোমেইন
      to: email,
      subject: `আপনার ব্লাড ব্যাংক ভেরিফিকেশন কোড: ${otp}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 30px; border-radius: 12px;">
          <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.05); text-align: center;">
            <div style="width: 70px; height: 70px; background-color: #ff4d4f; border-radius: 50%; line-height: 70px; color: white; font-size: 35px; margin: 0 auto 20px; box-shadow: 0 4px 10px rgba(255, 77, 79, 0.3);">🩸</div>
            <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 10px;">চাঁদপুর নাগরিক ব্লাড ব্যাংক</h2>
            <p style="color: #6c7a89; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              আপনার স্ট্যাটাস আপডেট করার জন্য নিচে দেওয়া <strong>৬-ডিজিটের</strong> ভেরিফিকেশন কোডটি ব্যবহার করুন:
            </p>
            <div style="background-color: #fef2f2; border: 2px dashed #ff7875; padding: 20px; border-radius: 10px; margin-bottom: 30px; display: inline-block; min-width: 250px;">
              <h1 style="color: #cf1322; font-size: 42px; letter-spacing: 12px; margin: 0; font-family: monospace;">${otp}</h1>
            </div>
            <p style="color: #95a5a6; font-size: 14px; line-height: 1.6;">
              এই কোডটির মেয়াদ আগামী <strong>৫ মিনিট</strong> পর্যন্ত থাকবে।
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 40px 0 20px;">
            <p style="color: #bdc3c7; font-size: 12px; margin: 0;">
              ধন্যবাদান্তে,<br><strong style="color: #95a5a6;">টিম চাঁদপুর নাগরিক</strong>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ message: 'Failed to send OTP' }, { status: 400 });
    }

    // ফায়ারবেস ডেটাবেসে OTP সেভ করা
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