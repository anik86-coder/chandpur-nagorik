import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // ৬-ডিজিটের র‍্যান্ডম OTP তৈরি করা
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Nodemailer ট্রান্সপোর্টার সেটআপ
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Chandpur Nagorik" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Blood Bank Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #333;">Chandpur Nagorik Blood Bank</h2>
          <p style="font-size: 16px;">আপনার OTP কোডটি নিচে দেওয়া হলো:</p>
          <h1 style="background: #f4f4f4; padding: 10px; color: #d9534f; letter-spacing: 5px; border-radius: 5px; display: inline-block;">${otp}</h1>
          <p style="font-size: 14px; color: #777;">এই কোডটি ৫ মিনিট পর্যন্ত কার্যকর থাকবে।</p>
        </div>
      `,
    };

    // ইমেইল সেন্ড করা
    await transporter.sendMail(mailOptions);

    // ফায়ারবেস ডেটাবেসে OTP সেভ করা (৫ মিনিট মেয়াদ)
    const expireTime = Date.now() + 5 * 60 * 1000;
    await setDoc(doc(db, "otps", email), {
      otp: otp,
      expiresAt: expireTime
    });

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}