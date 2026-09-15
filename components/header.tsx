"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Header */}
      <header className="bg-white sticky top-0 z-[100] shadow-md font-[Kalpurush] border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 h-[95px] sm:h-[85px] flex items-center justify-between">

          {/* বামে লোগো */}
          <div className="flex-shrink-0 max-sm:relative max-sm:-top-[5px]">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-banner-1.png"
                alt="Chandpur Nagorik Logo"
                width={220}
                height={60}
                className="object-contain h-[45px] sm:h-[55px] w-auto"
                priority
              />
            </Link>
          </div>

          {/* ডানে তারিখ */}
          <div className="text-right max-sm:absolute max-sm:left-4 max-sm:top-[53px]">
            <span className="text-[12px] sm:text-sm text-gray-600 font-bold whitespace-nowrap">
              {today}
            </span>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => {
              console.log("MENU CLICKED");
              setMenuOpen(true);
            }}
            className="hidden max-sm:flex absolute right-3 top-[8px] w-11 h-11 items-center justify-center rounded-lg active:bg-gray-100 touch-manipulation z-[150]"
            aria-label="মেনু খুলুন"
          >
            <span className="flex flex-col gap-[5px] pointer-events-none">
              <span className="block w-6 h-[2px] bg-gray-700 rounded-full" />
              <span className="block w-6 h-[2px] bg-gray-700 rounded-full" />
              <span className="block w-6 h-[2px] bg-gray-700 rounded-full" />
            </span>
          </button>

        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed inset-0 z-[99999] sm:hidden ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <button
          type="button"
          aria-label="মেনু বন্ধ করুন"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 w-full h-full bg-black/40 border-0 p-0 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer */}
        <aside
          className={`absolute right-0 top-0 h-[100dvh] w-[280px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="h-[65px] flex items-center justify-end px-4 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-3xl leading-none text-gray-600 active:bg-gray-100 touch-manipulation"
              aria-label="মেনু বন্ধ করুন"
            >
              ×
            </button>
          </div>

          {/* নাগরিক সেবা */}
          <div className="p-4">
            <Link
              href="/sheba"
              onClick={() => setMenuOpen(false)}
              className="block w-full bg-[#116cb4] text-white text-center py-3.5 rounded-xl font-bold shadow-md active:bg-[#0e5b98] transition touch-manipulation"
            >
              নাগরিক সেবা
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}