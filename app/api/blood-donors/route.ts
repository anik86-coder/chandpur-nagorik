import { NextResponse, NextRequest } from 'next/server';

// ==========================================
// আপাতত ডামি ডাটাবেস (পরে আপনি এখানে আসল ডাটাবেস যুক্ত করবেন)
// ==========================================
let donorsDB = [
  { id: 1, name: 'আরিফ হোসেন', group: 'A+', location: 'বাসস্ট্যান্ড, চাঁদপুর', phone: '01700000000', last_donated: '২ মাস আগে' },
  { id: 2, name: 'সাকিব আল হাসান', group: 'O+', location: 'স্টেডিয়াম রোড, চাঁদপুর', phone: '01800000000', last_donated: '৪ মাস আগে' },
];

// ==========================================
// GET মেথড: অ্যাপে ডোনারদের লিস্ট পাঠানোর জন্য
// ==========================================
export async function GET() {
  try {
    // ভবিষ্যতে এখানে ডাটাবেস থেকে সব ডাটা খোঁজার কোড থাকবে
    return NextResponse.json({ 
      success: true, 
      data: donorsDB 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'সার্ভার থেকে ডাটা লোড করতে সমস্যা হয়েছে' 
    }, { status: 500 });
  }
}

// ==========================================
// POST মেথড: অ্যাপ থেকে নতুন ডোনার যুক্ত করার জন্য
// ==========================================
export async function POST(request: NextRequest) {
  try {
    // ফ্লাটার অ্যাপ থেকে পাঠানো ডাটাগুলো (JSON) রিসিভ করা হচ্ছে
    const body = await request.json(); 

    // নতুন ডোনারের অবজেক্ট তৈরি করা
    const newDonor = {
      id: Date.now(), // একটি ইউনিক আইডি তৈরি করা
      name: body.name,
      group: body.group,
      location: body.location,
      phone: body.phone,
      last_donated: 'এখনো দেননি'
    };

    // ডাটাবেসে নতুন ডোনারকে সেভ করা হচ্ছে
    donorsDB.push(newDonor);

    // অ্যাপকে সফল মেসেজ পাঠিয়ে দেওয়া হচ্ছে
    return NextResponse.json({ 
      success: true, 
      message: 'রক্তদাতা হিসেবে সফলভাবে যুক্ত হয়েছেন!', 
      data: newDonor 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'ডাটা সেভ করতে সমস্যা হয়েছে' 
    }, { status: 500 });
  }
}