import { NextResponse } from 'next/server';
import { db } from "../../../firebase"; // আপনার ফায়ারবেস ইমপোর্ট
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }

    // ৪-ডিজিটের র‍্যান্ডম OTP তৈরি করা
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // sms.net.bd-এর API-তে রিকোয়েস্ট পাঠানো
    const apiKey = 'qC8KT547Xl8MbitaOcPlw9kAcJZQIk6P3GxWCx84'; // আপনার আসল API Key এখানে বসাবেন
    const message = `চাঁদপুর নাগরিক অ্যাপে আপনার লগইন কোড: ${otp}`;

    const smsResponse = await fetch('https://api.sms.net.bd/sendsms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        msg: message,
        to: phoneNumber,
      }),
    });

    const smsResult = await smsResponse.json();

    // SMS সফলভাবে গেলে ফায়ারবেসে সেভ করা
    if (smsResult.error === 0) { 
      const expireTime = Date.now() + 5 * 60 * 1000; // ৫ মিনিট মেয়াদ
      
      // "phone_otps" নামের নতুন একটি কালেকশনে নম্বর দিয়ে সেভ করা
      await setDoc(doc(db, "phone_otps", phoneNumber), {
        otp: otp,
        expiresAt: expireTime
      });

      return NextResponse.json({ success: true, message: 'OTP sent successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to send SMS' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}