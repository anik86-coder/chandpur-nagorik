"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mainCategories = [
    { name: "নাগরিক সেবা", link: "/sheba" },
    { name: "হোম", link: "/" },
    { name: "মতামত", link: "/opinion" },
  ];

  return (
    <header className="bg-white sticky top-0 z-[100] shadow-md font-[Kalpurush] border-b border-gray-200">

      {/* ======================================================= */}
      {/* ডেস্কটপ ভিউ */}
      {/* ======================================================= */}

      <div className="hidden lg:flex max-w-screen-xl mx-auto px-4 h-[85px] items-center justify-between relative z-[101]">

        {/* ১. বামে লোগো */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/logo-banner-1.png"
              alt="Chandpur Nagorik Logo"
              width={220}
              height={60}
              className="object-contain h-[55px] w-auto"
              priority
            />
          </Link>
        </div>

        {/* ২. মাঝখানে মেনু */}
        <nav className="flex-1 flex justify-center px-2 xl:px-4">
          <ul className="flex items-center justify-center font-bold">

            {/* নাগরিক সেবা */}
            <li className="flex items-center">
              <Link
                href={mainCategories[0].link}
                className="px-4 xl:px-5 py-2 rounded-lg text-[15px] xl:text-[16px] transition-all block bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-[#116cb4] hover:text-white whitespace-nowrap"
              >
                {mainCategories[0].name}
              </Link>

              <span className="w-px h-5 bg-gray-300 mx-2 lg:mx-3 xl:mx-4"></span>
            </li>

            {/* বাকি মেনু */}
            {mainCategories.slice(1).map((cat, index) => {
              const isActive = pathname === cat.link;

              return (
                <li key={index} className="flex items-center">
                  <Link
                    href={cat.link}
                    className={`px-3 py-1.5 rounded-lg text-[15px] xl:text-[16px] font-bold transition-colors block whitespace-nowrap ${
                      isActive
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    {cat.name}
                  </Link>

                  {/* শেষ item-এর পরে divider দেখাবে না */}
                  {index < mainCategories.slice(1).length - 1 && (
                    <span className="w-px h-4 bg-gray-300 mx-1.5 lg:mx-2 xl:mx-3"></span>
                  )}
                </li>
              );
            })}

          </ul>
        </nav>

        {/* ৩. ডানে তারিখ */}
        <div className="flex-shrink-0 text-right pl-4">
          <span className="text-sm text-gray-600 font-bold whitespace-nowrap block">
            {today}
          </span>
        </div>

      </div>

      {/* ======================================================= */}
      {/* মোবাইল ভিউ */}
      {/* ======================================================= */}

      <div className="lg:hidden flex items-center justify-between bg-white relative z-[101] px-4 py-3">

        {/* বামে লোগো */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/logo-banner-1.png"
            alt="Chandpur Nagorik Logo"
            width={220}
            height={60}
            className="object-contain h-[45px] sm:h-[50px] w-auto"
            priority
          />
        </Link>

        {/* ডানে তারিখ + Menu button */}
        <div className="flex items-center gap-3">

          <span className="text-[12px] sm:text-[13px] text-gray-600 font-bold">
            {today}
          </span>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 p-2 space-y-1.5 focus:outline-none cursor-pointer bg-gray-50 rounded-md border border-gray-200 flex-shrink-0"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>

            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>

            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>

        </div>

      </div>

      {/* ======================================================= */}
      {/* মোবাইল মেনু */}
      {/* ======================================================= */}

      {isMenuOpen && (
        <nav className="lg:hidden fixed top-[75px] sm:top-[80px] left-0 right-0 bottom-0 bg-[#f8f9fa] border-t-2 border-[#116cb4] overflow-y-auto z-[99] shadow-inner">

          <ul className="flex flex-col min-h-full pb-20 pt-2 px-3 gap-2">

            {/* নাগরিক সেবা */}
            <li>
              <Link
                href={mainCategories[0].link}
                onClick={() => setIsMenuOpen(false)}
                className="block px-5 py-3.5 text-[18px] font-bold text-center rounded-xl bg-[#116cb4] text-white shadow-md shadow-blue-200"
              >
                {mainCategories[0].name}
              </Link>
            </li>

            {/* হোম + অন্যান্য মেনু */}
            {mainCategories.slice(1).map((cat, index) => (
              <li key={index}>
                <Link
                  href={cat.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-5 py-3.5 text-[17px] font-bold rounded-xl transition-all bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-red-600"
                >
                  {cat.name}
                </Link>
              </li>
            ))}

            {/* Footer */}
            <li className="mt-auto pt-6 text-center">
              <p className="text-sm text-gray-500 font-bold">
                © ২০২৬ চাঁদপুর নাগরিক। সর্বস্বত্ব সংরক্ষিত।
              </p>
            </li>

          </ul>

        </nav>
      )}

    </header>
  );
}