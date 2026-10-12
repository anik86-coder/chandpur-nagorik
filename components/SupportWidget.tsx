
"use client";

import { useState } from "react";
import Link from "next/link";

const supportOptions = [
  {
    icon: "💬",
    title: "সাপোর্ট ও যোগাযোগ",
    description: "আমাদের সঙ্গে যোগাযোগ করুন",
  },
  {
    icon: "🛠️",
    title: "সমস্যা জানান",
    description: "ওয়েবসাইটের কোনো সমস্যা জানাতে",
  },
  {
    icon: "💡",
    title: "পরামর্শ দিন",
    description: "আপনার মতামত আমাদের জানান",
  },
];

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-[Kalpurush]">
      {isOpen && (
        <div
          id="support-menu"
          className="mb-3 w-[min(320px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
          <div className="bg-[#116cb4] p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">
                  কীভাবে সাহায্য করতে পারি?
                </h2>
                <p className="mt-1 text-xs text-white/80">
                  চাঁদপুর নাগরিক সাপোর্ট
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="সাপোর্ট মেনু বন্ধ করুন"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl transition hover:bg-white/25"
              >
                ×
              </button>
            </div>
          </div>

          <div className="space-y-2 p-3">
            {supportOptions.map((option) => (
              <Link
                key={option.title}
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  {option.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-gray-800">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    {option.description}
                  </span>
                </span>

                <span className="text-lg text-blue-600">›</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 px-4 py-3 text-center text-xs text-gray-500">
            আমরা আপনাকে সহায়তা করতে প্রস্তুত।
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "সাপোর্ট মেনু বন্ধ করুন" : "সাপোর্ট খুলুন"}
        aria-expanded={isOpen}
        aria-controls="support-menu"
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#116cb4] text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-[#0d5b99] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
      >
        {isOpen ? (
          <span className="text-3xl leading-none">×</span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 18.5 3.5 20l1.1-4A8.5 8.5 0 1 1 7 18.5Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h8M8 14h5"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
