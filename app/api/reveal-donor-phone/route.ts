import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

const isDonorAvailable = (lastDonationValue: unknown) => {
  if (!lastDonationValue) return true;

  const lastDonation = String(lastDonationValue).trim();
  // Expect the stored donation date in YYYY-MM-DD format.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastDonation)) return false;

  const lastDate = new Date(`${lastDonation}T00:00:00.000Z`);
  if (Number.isNaN(lastDate.getTime())) return false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const elapsedDays = Math.floor(
    (today.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  return elapsedDays >= 90;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body?.token;
    const donorId = body?.donorId;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "CAPTCHA token পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    if (!donorId || typeof donorId !== "string" || !donorId.trim()) {
      return NextResponse.json(
        { success: false, message: "Donor ID পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      console.error("TURNSTILE_SECRET_KEY is missing");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    const cloudflareResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
        cache: "no-store",
      }
    );

    if (!cloudflareResponse.ok) {
      console.error("Cloudflare HTTP error:", cloudflareResponse.status);
      return NextResponse.json(
        {
          success: false,
          message: "Cloudflare verification server-এর সাথে যোগাযোগ করা যায়নি।",
        },
        { status: 502 }
      );
    }

    const result = await cloudflareResponse.json();
    if (!result?.success) {
      return NextResponse.json(
        {
          success: false,
          message: "CAPTCHA verification সফল হয়নি। আবার চেষ্টা করুন।",
        },
        { status: 403 }
      );
    }

    const normalizedDonorId = donorId.trim();

    // Check public donor status on the server; UI hiding alone is not protection.
    const donorSnap = await adminDb
      .collection("donors")
      .doc(normalizedDonorId)
      .get();

    if (!donorSnap.exists) {
      return NextResponse.json(
        { success: false, message: "এই ডোনারের তথ্য পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const donorData = donorSnap.data() || {};
    if (donorData.active === false || donorData.deletedAt) {
      return NextResponse.json(
        { success: false, message: "এই ডোনারের প্রোফাইল আর প্রকাশিত নেই।" },
        { status: 404 }
      );
    }

    if (!isDonorAvailable(donorData.lastDonation)) {
      return NextResponse.json(
        {
          success: false,
          unavailable: true,
          message: "এই ডোনার ৯০ দিনের অপেক্ষায় আছেন। এই সময়ে মোবাইল নম্বর দেখা যাবে না।",
        },
        { status: 403 }
      );
    }

    const privateDoc = await adminDb
      .collection("donorPrivate")
      .doc(normalizedDonorId)
      .get();

    if (!privateDoc.exists) {
      return NextResponse.json(
        { success: false, message: "এই ডোনারের যোগাযোগের তথ্য পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const privateData = privateDoc.data() || {};
    const phone = typeof privateData.phone === "string" ? privateData.phone : "";

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "এই ডোনারের মোবাইল নম্বর পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, phone });
  } catch (error) {
    console.error("Reveal donor phone error:", error);
    return NextResponse.json(
      { success: false, message: "মোবাইল নম্বর দেখাতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
