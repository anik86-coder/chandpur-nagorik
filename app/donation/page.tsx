"use client";

import { useState } from "react";
import Link from "next/link";

export default function DonationPage() {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDonationActive = false;

  const handleDonate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const numericAmount = Number(amount);

    // --------------------------------------------------
    // AMOUNT VALIDATION
    // --------------------------------------------------

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("সঠিক অনুদানের পরিমাণ লিখুন।");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/donation/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: name.trim(),
            note: note.trim(),
            amount: numericAmount.toFixed(2),
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data?.payment_url
      ) {
        throw new Error(
          data?.message ||
            "পেমেন্ট শুরু করা যায়নি।"
        );
      }

      window.location.href =
        data.payment_url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "পেমেন্ট শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );

      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SEO STRUCTURED DATA
  // --------------------------------------------------

  const donationSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "চাঁদপুর নাগরিক অনুদান",
    alternateName:
      "Chandpur Nagorik Donation",
    url: "https://chandpurnagorik.com/donation",
    description:
      "চাঁদপুর নাগরিকের ব্লাড ব্যাংক, ওয়েবসাইট সার্ভার, সামাজিক কার্যক্রম ও কমিউনিটি সহায়তা কার্যক্রম পরিচালনায় সহযোগিতার জন্য অনুদান সম্পর্কিত তথ্য।",
    isPartOf: {
      "@type": "WebSite",
      name: "চাঁদপুর নাগরিক",
      url: "https://chandpurnagorik.com",
    },
    about: {
      "@type": "Thing",
      name: "চাঁদপুর নাগরিক সামাজিক কার্যক্রম",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "চাঁদপুর নাগরিক",
          item: "https://chandpurnagorik.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "অনুদান",
          item: "https://chandpurnagorik.com/donation",
        },
      ],
    },
  };

  return (
    <>
      {/* SEO Structured Data */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(donationSchema),
        }}
      />

      <main className="font-[Kalpurush] bg-gray-50 min-h-screen pb-16">
        {/* =====================================================
            HERO
        ====================================================== */}

        <section
          className="bg-[#116cb4] text-white py-16 md:py-20 px-4 relative overflow-hidden"
          aria-labelledby="donation-page-title"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg
              className="absolute -top-10 -right-10 w-64 h-64 text-white"
              fill="currentColor"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="50"
              />
            </svg>

            <svg
              className="absolute -bottom-20 -left-10 w-80 h-80 text-white"
              fill="currentColor"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="50"
              />
            </svg>
          </div>

          <div className="max-w-screen-md mx-auto text-center relative z-10">
            <div
              className="text-5xl mb-5"
              aria-hidden="true"
            >
              🤝
            </div>

            <h1
              id="donation-page-title"
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
            >
              আপনার একটি ছোট অনুদান,
              <br />
              বদলে দিতে পারে কারও জীবন!
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-8">
              চাঁদপুর নাগরিক-এর ব্লাড ব্যাংক,
              ওয়েবসাইট সার্ভার এবং সামাজিক
              কার্যক্রমগুলো পরিচালনা করতে আপনাদের
              সহযোগিতা আমাদের একান্ত কাম্য।
            </p>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* =================================================
                DONATION PURPOSE
            ================================================== */}

            <section
              className="lg:col-span-2 space-y-6"
              aria-labelledby="donation-purpose-title"
            >
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2
                  id="donation-purpose-title"
                  className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
                >
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>

                  যেসব খাতে আপনার অনুদান ব্যয় হবে
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* Blood Bank */}

                  <article className="bg-red-50 p-6 rounded-xl border border-red-100 transition hover:shadow-md">
                    <h3 className="text-lg font-bold text-red-700 mb-2">
                      🩸 ব্লাড ব্যাংক পরিচালনা
                    </h3>

                    <p className="text-gray-600 text-[15px] leading-7">
                      জরুরি মুহূর্তে রক্তদাতাদের সাথে
                      যোগাযোগ স্থাপন এবং সিস্টেমটির
                      নিরবচ্ছিন্ন সেবা নিশ্চিত করতে।
                    </p>
                  </article>

                  {/* Server */}

                  <article className="bg-blue-50 p-6 rounded-xl border border-blue-100 transition hover:shadow-md">
                    <h3 className="text-lg font-bold text-[#116cb4] mb-2">
                      💻 সার্ভার ও মেইনটেন্যান্স
                    </h3>

                    <p className="text-gray-600 text-[15px] leading-7">
                      ওয়েবসাইটটি ২৪ ঘণ্টা লাইভ রাখা,
                      ডোমেইন-হোস্টিং খরচ এবং সিকিউরিটি
                      মেইনটেইন করা।
                    </p>
                  </article>

                  {/* Social Support */}

                  <article className="bg-green-50 p-6 rounded-xl border border-green-100 transition hover:shadow-md">
                    <h3 className="text-lg font-bold text-green-700 mb-2">
                      🤝 অসহায়দের সহায়তা
                    </h3>

                    <p className="text-gray-600 text-[15px] leading-7">
                      চাঁদপুরের হতদরিদ্র, চিকিৎসা
                      বঞ্চিত বা জরুরি বিপদে পড়া
                      মানুষদের আর্থিকভাবে সাহায্য করা।
                    </p>
                  </article>

                  {/* Community Development */}

                  <article className="bg-purple-50 p-6 rounded-xl border border-purple-100 transition hover:shadow-md">
                    <h3 className="text-lg font-bold text-purple-700 mb-2">
                      🌱 সামাজিক উন্নয়ন
                    </h3>

                    <p className="text-gray-600 text-[15px] leading-7">
                      কমিউনিটির বিভিন্ন জনসচেতনতামূলক
                      কাজ এবং স্বেচ্ছাসেবকদের ইভেন্ট
                      পরিচালনা করা।
                    </p>
                  </article>

                </div>
              </div>
            </section>

            {/* =================================================
                ONLINE DONATION
            ================================================== */}

            <section
              className="lg:col-span-1"
              aria-labelledby="donation-method-title"
            >
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-28">

                <h2
                  id="donation-method-title"
                  className="text-xl font-bold text-gray-800 mb-6 text-center border-b border-gray-100 pb-4"
                >
                  অনলাইনে অনুদান দিন
                </h2>

                {!isDonationActive ? (
                  <div className="text-center py-8">

                    <div className="bg-blue-100 text-[#116cb4] p-4 rounded-full mb-4 shadow-sm inline-flex">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      শীঘ্রই আসছে!
                    </h3>

                    <p className="text-gray-600 text-sm font-medium leading-relaxed">
                      অনলাইন অনুদান গ্রহণ বর্তমানে
                      বন্ধ রয়েছে।
                    </p>

                  </div>
                ) : (

                  <form
                    onSubmit={handleDonate}
                    className="space-y-4"
                  >

                    {/* =================================================
                        NAME - OPTIONAL
                    ================================================== */}

                    <div>
                      <label
                        htmlFor="donor-name"
                        className="block text-sm font-bold text-gray-700 mb-2"
                      >
                        আপনার নাম
                        <span className="text-gray-400 font-normal ml-1">
                          (ঐচ্ছিক)
                        </span>
                      </label>

                      <input
                        id="donor-name"
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="আপনার নাম"
                        autoComplete="name"
                        maxLength={100}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#116cb4] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* =================================================
                        NOTE - OPTIONAL
                    ================================================== */}

                    <div>
                      <label
                        htmlFor="donation-note"
                        className="block text-sm font-bold text-gray-700 mb-2"
                      >
                        নোট
                        <span className="text-gray-400 font-normal ml-1">
                          (ঐচ্ছিক)
                        </span>
                      </label>

                      <textarea
                        id="donation-note"
                        value={note}
                        onChange={(e) =>
                          setNote(e.target.value)
                        }
                        placeholder="আপনার কোনো কথা লিখতে পারেন"
                        rows={3}
                        maxLength={500}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none resize-none focus:border-[#116cb4] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* =================================================
                        AMOUNT
                    ================================================== */}

                    <div>
                      <label
                        htmlFor="donation-amount"
                        className="block text-sm font-bold text-gray-700 mb-2"
                      >
                        অনুদানের পরিমাণ (৳)
                        <span className="text-red-500 ml-1">
                          *
                        </span>
                      </label>

                      <input
                        id="donation-amount"
                        type="number"
                        min="1"
                        step="0.01"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) =>
                          setAmount(e.target.value)
                        }
                        placeholder="যেমন: 500"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#116cb4] focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>

                    {/* =================================================
                        PAYMENT METHODS
                    ================================================== */}

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 mt-2">

                      <div className="text-center mb-3">
                        <p className="text-sm font-bold text-gray-700">
                          নিরাপদ পেমেন্ট
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          পেমেন্ট পেজে আপনার উপলব্ধ
                          পেমেন্ট পদ্ধতি নির্বাচন করুন
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-2">

                        {/* bKash */}

                        <div className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center min-h-[62px]">
                          <div className="w-9 h-9 rounded-lg bg-[#e2136e] text-white flex items-center justify-center font-bold text-xs">
                            bKash
                          </div>

                          <span className="text-[10px] text-gray-600 mt-1">
                            bKash
                          </span>
                        </div>

                        {/* Nagad */}

                        <div className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center min-h-[62px]">
                          <div className="w-9 h-9 rounded-lg bg-[#f58220] text-white flex items-center justify-center font-bold text-[9px]">
                            Nagad
                          </div>

                          <span className="text-[10px] text-gray-600 mt-1">
                            Nagad
                          </span>
                        </div>

                        {/* Visa */}

                        <div className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center min-h-[62px]">
                          <div className="w-9 h-9 rounded-lg bg-[#1a1f71] text-white flex items-center justify-center font-bold italic text-[11px]">
                            VISA
                          </div>

                          <span className="text-[10px] text-gray-600 mt-1">
                            Visa
                          </span>
                        </div>

                        {/* Mastercard */}

                        <div className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center min-h-[62px]">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                            <div className="flex -space-x-2">
                              <span className="w-5 h-5 rounded-full bg-red-500 block" />
                              <span className="w-5 h-5 rounded-full bg-yellow-400 block" />
                            </div>
                          </div>

                          <span className="text-[10px] text-gray-600 mt-1">
                            Mastercard
                          </span>
                        </div>

                      </div>

                      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-9V7a4 4 0 00-8 0v3h8z"
                          />
                        </svg>

                        <span>
                          নিরাপদ পেমেন্ট গেটওয়ে
                        </span>
                      </div>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                      <div
                        className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm leading-6"
                        role="alert"
                      >
                        {error}
                      </div>
                    )}

                    {/* =================================================
                        DONATE BUTTON
                    ================================================== */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#116cb4] text-white font-bold py-3.5 px-5 rounded-xl hover:bg-[#0d5a96] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "পেমেন্ট পেজ প্রস্তুত হচ্ছে..."
                        : "অনুদান দিন"}
                    </button>

                    <p className="text-xs text-gray-500 text-center leading-5">
                      বাটনে ক্লিক করলে নিরাপদ
                      পেমেন্ট পেজে নিয়ে যাওয়া হবে।
                      পেমেন্ট সম্পন্ন না হওয়া পর্যন্ত
                      কোনো অনুদান সফল হিসেবে গণ্য হবে না।
                    </p>

                  </form>

                )}

              </div>
            </section>

          </div>
        </div>

        {/* =====================================================
            BACK TO SERVICES
        ====================================================== */}

        <div className="max-w-screen-xl mx-auto px-4 mt-8 text-center">

          <Link
            href="/sheba"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            ← নাগরিক সেবায় ফিরে যান
          </Link>

        </div>

      </main>
    </>
  );
}