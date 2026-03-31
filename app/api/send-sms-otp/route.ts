import { NextResponse } from 'next/server';
import { db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

// Next.js-কে বলে দেওয়া যে এটি একটি ডাইনামিক API
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // অ্যাপ থেকে পাঠানো ফোন নম্বর রিসিভ করা
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    // গেটওয়ের জন্য মোবাইল নম্বর থেকে '+' চিহ্নটি সরিয়ে ফেলা (যেমন: +88017... থেকে 88017...)
    const formattedPhone = phoneNumber.replace('+', '');

    // ⚠️ ফিক্স: ৪-ডিজিটের র‍্যান্ডম OTP তৈরি করা (যেহেতু আপনার অ্যাপ ৪ ডিজিট রিসিভ করে)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Environment Variable থেকে আপনার sms.net.bd এর API Key নেওয়া
    const apiKey = process.env.SMS_API_KEY; 
    
    if (!apiKey) {
      console.error("SMS API Key is missing in .env");
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const message = `চাঁদপুর নাগরিক অ্যাপে আপনার লগইন কোড: ${otp}`;

    // API তে রিকোয়েস্ট পাঠানোর জন্য URLSearchParams ব্যবহার
    const params = new URLSearchParams();
    params.append('api_key', apiKey);
    params.append('msg', message);
    params.append('to', formattedPhone);

    const smsResponse = await fetch('https://api.sms.net.bd/sendsms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const smsResult = await smsResponse.json();

    // SMS সফলভাবে গেলে ফায়ারবেসে সেভ করা
    if (smsResult.error === 0) { 
      const expireTime = Date.now() + 5 * 60 * 1000; // ৫ মিনিট মেয়াদ
      
      // "phone_otps" নামের কালেকশনে নম্বর দিয়ে সেভ করা
      await setDoc(doc(db, "phone_otps", formattedPhone), {
        otp: otp,
        expiresAt: expireTime
      });

      return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } else {
      console.error('SMS Gateway Error:', smsResult);
      return NextResponse.json({ message: smsResult.msg || 'Failed to send SMS' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}