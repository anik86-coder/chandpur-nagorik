"use client";

import { useState } from "react";
import Link from "next/link";

export default function DonationPage() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // 💥 ম্যাজিক সুইচ: ভবিষ্যতে ডোনেশন চালু করতে চাইলে এটি true করে দেবেন
  const isDonationActive = false; 

  const handleCopy = (text: string, type: string) => {
    if (!isDonationActive) return; // বন্ধ থাকলে কপি কাজ করবে না
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <main className="font-[Kalpurush] bg-gray-50 min-h-screen pb-16">
      
      <section className="bg-[#116cb4] text-white py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="absolute -top-10 -right-10 w-64 h-64 text-white" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
          <svg className="absolute -bottom-20 -left-10 w-80 h-80 text-white" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
        </div>

        <div className="max-w-screen-md mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            আপনার একটি ছোট অনুদান,<br /> বদলে দিতে পারে কারও জীবন!
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            চাঁদপুর নাগরিক-এর ব্লাড ব্যাংক, ওয়েবসাইট সার্ভার এবং সামাজিক কার্যক্রমগুলো পরিচালনা করতে আপনাদের সহযোগিতা আমাদের একান্ত কাম্য।
          </p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                যেসব খাতে আপনার অনুদান ব্যয় হবে
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 transition hover:shadow-md">
                  <h3 className="text-lg font-bold text-red-700 mb-2">🩸 ব্লাড ব্যাংক পরিচালনা</h3>
                  <p className="text-gray-600 text-[15px]">জরুরি মুহূর্তে রক্তদাতাদের সাথে যোগাযোগ স্থাপন এবং সিস্টেমটির নিরবচ্ছিন্ন সেবা নিশ্চিত করতে।</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 transition hover:shadow-md">
                  <h3 className="text-lg font-bold text-[#116cb4] mb-2">💻 সার্ভার ও মেইনটেন্যান্স</h3>
                  <p className="text-gray-600 text-[15px]">ওয়েবসাইটটি ২৪ ঘণ্টা লাইভ রাখা, ডোমেইন-হোস্টিং খরচ এবং সিকিউরিটি মেইনটেইন করা।</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 transition hover:shadow-md">
                  <h3 className="text-lg font-bold text-green-700 mb-2">🤝 অসহায়দের সহায়তা</h3>
                  <p className="text-gray-600 text-[15px]">চাঁদপুরের হতদরিদ্র, চিকিৎসা বঞ্চিত বা জরুরি বিপদে পড়া মানুষদের আর্থিকভাবে সাহায্য করা।</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 transition hover:shadow-md">
                  <h3 className="text-lg font-bold text-purple-700 mb-2">🌱 সামাজিক উন্নয়ন</h3>
                  <p className="text-gray-600 text-[15px]">কমিউনিটির বিভিন্ন জনসচেতনতামূলক কাজ এবং স্বেচ্ছাসেবকদের ইভেন্ট পরিচালনা করা।</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-28 relative overflow-hidden">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center border-b border-gray-100 pb-4">
                অনুদান পাঠানোর মাধ্যম
              </h3>

              {/* [আপডেট]: ডোনেশন বন্ধ থাকলে এই সুন্দর ওভারলে মেসেজটি দেখাবে */}
              {!isDonationActive && (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                  <div className="bg-blue-100 text-[#116cb4] p-4 rounded-full mb-4 shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">শীঘ্রই আসছে!</h4>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">অনলাইন অনুদান গ্রহণের প্রক্রিয়াটি বর্তমানে তৈরি করা হচ্ছে। ভবিষ্যতে আপনারা এখান থেকেই অনুদান পাঠাতে পারবেন।</p>
                </div>
              )}

              {/* পেমেন্ট মেথডগুলো (বন্ধ থাকলে ঝাপসা দেখাবে) */}
              <div className={`space-y-4 ${!isDonationActive ? 'opacity-30 pointer-events-none select-none filter blur-[1px]' : ''}`}>
                
                <div className="border border-gray-200 rounded-xl p-4 hover:border-[#e2136e] transition-colors relative group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#e2136e] text-white font-bold text-xs px-2 py-1 rounded">bKash</div>
                    <span className="font-semibold text-gray-700 text-sm">পার্সোনাল</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-xl font-bold tracking-wider text-gray-800">019XXXXXXXX</span>
                    <button onClick={() => handleCopy("019XXXXXXXX", "bkash")} className="bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-100">
                      {copiedItem === "bkash" ? <span className="text-[#e2136e] text-xs font-bold font-sans">Copied!</span> : <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 hover:border-[#f7941d] transition-colors relative group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#f7941d] text-white font-bold text-xs px-2 py-1 rounded">Nagad</div>
                    <span className="font-semibold text-gray-700 text-sm">পার্সোনাল</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-xl font-bold tracking-wider text-gray-800">017XXXXXXXX</span>
                    <button onClick={() => handleCopy("017XXXXXXXX", "nagad")} className="bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-100">
                      {copiedItem === "nagad" ? <span className="text-[#f7941d] text-xs font-bold font-sans">Copied!</span> : <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 hover:border-[#8c1596] transition-colors relative group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#8c1596] text-white font-bold text-xs px-2 py-1 rounded">Rocket</div>
                    <span className="font-semibold text-gray-700 text-sm">পার্সোনাল</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-xl font-bold tracking-wider text-gray-800">018XXXXXXXX</span>
                    <button onClick={() => handleCopy("018XXXXXXXX", "rocket")} className="bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-100">
                      {copiedItem === "rocket" ? <span className="text-[#8c1596] text-xs font-bold font-sans">Copied!</span> : <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}