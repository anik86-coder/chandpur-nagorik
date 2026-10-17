
import Link from "next/link";

export const metadata = {
  title: "জরুরি যোগাযোগ নম্বর | চাঁদপুর নাগরিক",
  description:
    "চাঁদপুর নাগরিকের জরুরি যোগাযোগ নম্বর—জাতীয় জরুরি সেবা, নারী ও শিশু সহায়তা, সরকারি তথ্য ও দুর্নীতি দমন।",
};

export default function EmergencyPage() {
  const nationalHelplines = [
    {
      name: "জাতীয় জরুরি সেবা",
      number: "999",
      desc: "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স",
      icon: "🚨",
    },
    {
      name: "নারী ও শিশু নির্যাতন",
      number: "109",
      desc: "নারী ও শিশু নির্যাতন প্রতিরোধে",
      icon: "🛡️",
    },
    {
      name: "সরকারি তথ্য ও সেবা",
      number: "333",
      desc: "যেকোনো সরকারি তথ্য জানতে",
      icon: "ℹ️",
    },
    {
      name: "দুদক (দুর্নীতি দমন)",
      number: "106",
      desc: "দুর্নীতি প্রতিরোধে অভিযোগ কেন্দ্র",
      icon: "⚖️",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-16 font-[Kalpurush]">
      {/* Header */}
      <section className="relative overflow-hidden bg-red-600 px-4 py-12 text-white md:py-16">
        <div className="relative z-10 mx-auto max-w-screen-xl text-center">
          <Link
            href="/sheba"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-bold text-red-100 transition-colors hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            নাগরিক সেবায় ফিরে যান
          </Link>

          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            জরুরি যোগাযোগ নম্বর
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-red-100 md:text-xl">
            যেকোনো বিপদে বা জরুরি মুহূর্তে দ্রুত সহায়তা পেতে নিচের নম্বরগুলোতে
            যোগাযোগ করুন। আপনার সচেতনতাই বাঁচাতে পারে একটি জীবন।
          </p>
        </div>
      </section>

      {/* National Helplines */}
      <section className="relative z-10 mx-auto -mt-8 grid max-w-screen-xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {nationalHelplines.map((item) => (
          <div
            key={item.number}
            className="flex flex-col items-center rounded-2xl border-b-4 border-red-500 bg-white p-6 text-center shadow-md transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="mb-3 text-4xl" aria-hidden="true">
              {item.icon}
            </span>

            <h2 className="mb-1 text-lg font-bold text-gray-800">
              {item.name}
            </h2>

            <p className="mb-4 text-sm leading-relaxed text-gray-500">
              {item.desc}
            </p>

            <a
              href={`tel:${item.number}`}
              className="mt-auto w-full rounded-full bg-red-50 px-6 py-3 text-xl font-bold tracking-wider text-red-600 transition-colors hover:bg-red-600 hover:text-white"
              aria-label={`${item.name} নম্বরে কল করুন ${item.number}`}
            >
              {item.number}
            </a>
          </div>
        ))}
      </section>
    </main>
  );
}
