"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const categories = [
    { name: "নাগরিক সেবা", link: "/sheba" }, // <-- এটি একদম প্রথমে যুক্ত করা হলো
    { name: "হোম", link: "/" }, { name: "সব", link: "/all" },
    { name: "চাঁদপুর", link: "/chandpur" }, { name: "সারাদেশ", link: "/national" },
    { name: "রাজনীতি", link: "/politics" }, { name: "অর্থনীতি", link: "/economy" },
    { name: "ক্রীড়া", link: "/sports" }, { name: "আন্তর্জাতিক", link: "/international" },
    { name: "টেকনোলজি", link: "/technology" }, { name: "বিনোদন", link: "/entertainment" },
    { name: "শিক্ষা", link: "/education" }, { name: "স্বাস্থ্য", link: "/health" },
    { name: "ধর্ম", link: "/religion" }, { name: "প্রবাস", link: "/probash" },
    { name: "লাইফস্টাইল", link: "/lifestyle" }, { name: "মতামত", link: "/opinion" },
  ];

  return (
    <header className="bg-white sticky top-0 z-[100] shadow-sm font-[Kalpurush]">
      
      <div className="max-w-screen-xl mx-auto px-4 py-2 md:py-0 flex flex-col md:flex-row items-center justify-between bg-white relative z-[101]">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <Image src="/logo-banner-1.png" alt="Chandpur Nagorik Logo" width={300} height={80} className="object-contain h-14 md:h-[75px] w-auto" priority />
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 p-2 space-y-1.5 focus:outline-none ml-4 cursor-pointer"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        <span className="text-sm text-gray-600 font-medium pb-2 md:pb-0 mt-2 md:mt-0">{today}</span>
      </div>
      
      <nav className="border-t border-gray-200 bg-white hidden md:block">
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="flex flex-wrap gap-2 md:gap-3 py-3 font-medium justify-center">
            {categories.map((cat, index) => (
              <li key={index}>
                <Link href={cat.link} className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition-colors block">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ========================================================================================= */}
      {/* 💥 ম্যাজিক ফিক্স: style height বাদ দিয়ে সরাসরি top-[85px] এবং bottom-0 দেওয়া হয়েছে 💥 */}
      {/* ========================================================================================= */}
      {isMenuOpen && (
        <nav 
          className="md:hidden fixed top-[85px] left-0 right-0 bottom-0 bg-[#f4f4f5] border-t border-gray-200 overflow-y-auto z-[99]" 
        >
          {/* min-h-full দেওয়া হয়েছে যাতে কনটেন্ট কম থাকলেও ফুটারটা একদম নিচে থাকে */}
          <ul className="flex flex-col min-h-full">
            {categories.map((cat, index) => (
              <li key={index} className="border-b border-gray-300/60">
                <Link href={cat.link} onClick={() => setIsMenuOpen(false)} className="block px-6 py-4 text-[18px] font-medium text-gray-800 hover:bg-gray-300 hover:text-[#116cb4] transition cursor-pointer">
                  {cat.name}
                </Link>
              </li>
            ))}
            
            {/* mt-auto এর কারণে এই ফুটার সবসময় একদম শেষে ধাক্কা খেয়ে থাকবে */}
            <li className="mt-auto border-t border-gray-300 bg-gray-200 p-6 text-center pb-8">
              <p className="text-sm text-gray-600 font-medium">© ২০২৬ চাঁদপুর নাগরিক। সর্বস্বত্ব সংরক্ষিত।</p>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}