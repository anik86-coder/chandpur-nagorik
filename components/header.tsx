"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white sticky top-0 z-[100] shadow-md font-[Kalpurush] border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 h-[75px] sm:h-[85px] flex items-center justify-between">

        {/* বামে লোগো */}
        <div className="flex-shrink-0">
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
        <div className="text-right">
          <span className="text-[12px] sm:text-sm text-gray-600 font-bold whitespace-nowrap">
            {today}
          </span>
        </div>

      </div>
    </header>
  );
}
