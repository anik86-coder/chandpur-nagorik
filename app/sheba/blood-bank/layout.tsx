import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "চাঁদপুর ব্লাড ব্যাংক | রক্তদাতা খুঁজুন",

  description:
    "চাঁদপুরের রক্তদাতা খুঁজুন। রক্তের গ্রুপ অনুযায়ী রক্তদাতার তালিকা, রক্তদাতা নিবন্ধন এবং জরুরি রক্তের সন্ধানে চাঁদপুর নাগরিক ব্লাড ব্যাংক।",

  keywords: [
    "চাঁদপুর ব্লাড ব্যাংক",
    "Chandpur Blood Bank",
    "চাঁদপুর রক্তদাতা",
    "Chandpur Blood Donor",
    "রক্তদাতা চাঁদপুর",
    "চাঁদপুর রক্ত",
    "রক্তের গ্রুপ চাঁদপুর",
    "Blood Donation Chandpur",
    "Blood Donor Chandpur",
  ],

  alternates: {
    canonical: "https://chandpurnagorik.com/sheba/blood-bank",
  },

  openGraph: {
    title: "চাঁদপুর ব্লাড ব্যাংক | রক্তদাতা খুঁজুন",
    description:
      "চাঁদপুরে রক্তের প্রয়োজনে রক্তদাতা খুঁজুন এবং রক্তদাতা হিসেবে নিবন্ধন করুন।",
    url: "https://chandpurnagorik.com/sheba/blood-bank",
    siteName: "চাঁদপুর নাগরিক",
    locale: "bn_BD",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const bloodBankSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",

  name: "চাঁদপুর ব্লাড ব্যাংক",
  alternateName: "Chandpur Blood Bank",

  url: "https://chandpurnagorik.com/sheba/blood-bank",

  description:
    "চাঁদপুরের রক্তদাতা খোঁজা, রক্তদাতা নিবন্ধন এবং রক্তের গ্রুপ অনুযায়ী ডোনার তালিকার জন্য চাঁদপুর নাগরিকের ব্লাড ব্যাংক।",

  isPartOf: {
    "@type": "WebSite",
    name: "চাঁদপুর নাগরিক",
    url: "https://chandpurnagorik.com",
  },

  about: {
    "@type": "MedicalOrganization",
    name: "চাঁদপুর ব্লাড ব্যাংক",
    areaServed: {
      "@type": "City",
      name: "Chandpur",
    },
  },

  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "চাঁদপুর নাগরিক",
        item: "https://chandpurnagorik.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "ব্লাড ব্যাংক",
        item: "https://chandpurnagorik.com/sheba/blood-bank",
      },
    ],
  },
};

export default function BloodBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bloodBankSchema),
        }}
      />

      {children}
    </>
  );
}