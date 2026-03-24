"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.target;
    const data = new FormData(form);

    try {
      // আপনার Formspree লিংক
      const response = await fetch("https://formspree.io/f/xojpajag", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset(); // ফর্মের লেখা মুছে ফেলবে
        // ৫ সেকেন্ড পর সাকসেস মেসেজ গায়েব হয়ে যাবে
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-1">আপনার নাম</label>
        <input 
          type="text" 
          name="name" 
          required 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#116cb4]" 
          placeholder="নাম লিখুন" 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">ইমেইল ঠিকানা</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#116cb4]" 
          placeholder="ইমেইল লিখুন" 
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">বার্তা</label>
        <textarea 
          name="message" 
          rows={4} 
          required 
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#116cb4]" 
          placeholder="আপনার বার্তা লিখুন..."
        ></textarea>
      </div>
      
      {/* স্ট্যাটাস মেসেজ (সফল বা ব্যর্থ হলে দেখাবে) */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm font-medium">
          ✅ আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করবো।
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm font-medium">
          ❌ বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === "sending"}
        className="bg-[#116cb4] text-white px-6 py-2 rounded font-bold hover:bg-red-600 transition-colors disabled:bg-gray-400"
      >
        {status === "sending" ? "পাঠানো হচ্ছে..." : "পাঠিয়ে দিন"}
      </button>
    </form>
  );
}