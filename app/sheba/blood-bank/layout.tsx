
import type { Metadata } from "next";

const siteUrl = "https://chandpurnagorik.com";
const pageUrl = `${siteUrl}/sheba/blood-bank`;

const pageTitle = "চাঁদপুর ব্লাড ব্যাংক | রক্তদাতা খুঁজুন";

const pageDescription =
  "চাঁদপুরের রক্তদাতা খুঁজুন। রক্তের গ্রুপ অনুযায়ী রক্তদাতার তালিকা, রক্তদাতা নিবন্ধন এবং জরুরি রক্তের সন্ধানে চাঁদপুর নাগরিক ব্লাড ব্যাংক।";

/* =========================
   SEO Metadata
========================= */

export const metadata: Metadata = {
  title: pageTitle,

  description: pageDescription,

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
    canonical: pageUrl,
  },

  openGraph: {
    title: pageTitle,
    description:
      "চাঁদপুরে রক্তের প্রয়োজনে রক্তদাতা খুঁজুন এবং রক্তদাতা হিসেবে নিবন্ধন করুন।",
    url: pageUrl,
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
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* =========================
   Blood Bank Structured Data
========================= */

const bloodBankSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,

  name: "চাঁদপুর ব্লাড ব্যাংক",
  alternateName: "Chandpur Blood Bank",
  url: pageUrl,
  description: pageDescription,
  inLanguage: "bn-BD",

  isPartOf: {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "চাঁদপুর নাগরিক",
    url: `${siteUrl}/`,
  },

  about: {
    "@type": "Thing",
    name: "চাঁদপুরের রক্তদাতা ও রক্তদান",
  },

  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "চাঁদপুর নাগরিক",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "নাগরিক সেবা",
        item: `${siteUrl}/sheba`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "ব্লাড ব্যাংক",
        item: pageUrl,
      },
    ],
  },
};

/* =========================
   Blood Bank Layout
========================= */

export default function BloodBankLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bloodBankSchema).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      {children}
    </>
  );
}
