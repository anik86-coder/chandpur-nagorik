import { NextResponse } from 'next/server';
import { db } from "../../../firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    // ফায়ারবেস থেকে ওই ইমেইলের OTP ডেটা খোঁজা
    const otpDocRef = doc(db, "otps", email);
    const otpDoc = await getDoc(otpDocRef);

    if (!otpDoc.exists()) {
      return NextResponse.json({ success: false, message: 'কোনো OTP পাওয়া যায়নি বা মেয়াদ শেষ হয়ে গেছে।' }, { status: 400 });
    }

    const data = otpDoc.data();

    // মেয়াদ (Expire Time) চেক করা
    if (Date.now() > data.expiresAt) {
      await deleteDoc(otpDocRef); // মেয়াদ শেষ হলে ডেটাবেস থেকে ডিলিট
      return NextResponse.json({ success: false, message: 'OTP এর মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।' }, { status: 400 });
    }

    // কোড মিলেছে কি না চেক করা
    if (data.otp === otp) {
      await deleteDoc(otpDocRef); // সফল হলে ডেটাবেস থেকে ডিলিট
      return NextResponse.json({ success: true, message: 'OTP ভেরিফাই সফল হয়েছে!' }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'ভুল OTP দেওয়া হয়েছে।' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}