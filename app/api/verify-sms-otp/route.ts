import { NextResponse } from 'next/server';
import { db } from "../../../firebase"; 
import { doc, getDoc, deleteDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // trim() ব্যবহার করা হয়েছে যাতে ভুল করে কোনো স্পেস চলে আসলে তা কেটে যায়
    const phoneNumber = body.phoneNumber?.trim();
    const otp = body.otp?.trim();

    if (!phoneNumber || !otp) {
      return NextResponse.json({ success: false, message: 'নম্বর এবং OTP প্রয়োজন' }, { status: 400 });
    }

    // ফায়ারবেস থেকে ওই নম্বরের সেভ করা ডেটা খোঁজা
    const docRef = doc(db, "phone_otps", phoneNumber);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // [গুরুত্বপূর্ণ] টার্মিনালে চেক করার জন্য প্রিন্ট করা হচ্ছে
      console.log("Firebase এ সেভ আছে:", data.otp, " | অ্যাপ থেকে দেওয়া হয়েছে:", otp);

      // ১. মেয়াদ চেক করা (৫ মিনিট পার হয়ে গেছে কি না)
      if (Date.now() > data.expiresAt) {
        await deleteDoc(docRef); 
        return NextResponse.json({ success: false, message: 'OTP-এর মেয়াদ শেষ হয়ে গেছে' }, { status: 400 });
      }

      // ২. কোড মেলানো (দুটিকেই জোর করে String বানিয়ে মেলানো হচ্ছে)
      if (String(data.otp) === String(otp)) {
        await deleteDoc(docRef); // ভেরিফাই সফল হলে নিরাপত্তার জন্য কোডটি মুছে ফেলা
        return NextResponse.json({ success: true, message: 'লগইন সফল' }, { status: 200 });
      } else {
        return NextResponse.json({ success: false, message: 'ভুল কোড দেওয়া হয়েছে' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: 'কোনো কোড পাঠানো হয়নি বা মেয়াদ শেষ' }, { status: 404 });
    }
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ success: false, message: 'সার্ভার এরর' }, { status: 500 });
  }
}