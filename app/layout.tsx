import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";

/* Fonts */

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

/* =========================
   SEO Metadata
========================= */

export const metadata: Metadata = {
  metadataBase: new URL("https://chandpurnagorik.com"),

  title: {
    default: "চাঁদপুর নাগরিক | Chandpur Nagorik",
    template: "%s | চাঁদপুর নাগরিক",
  },

  description:
    "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা, স্বাস্থ্যসেবা, হাসপাতাল, ডাক্তার, ডায়াগনস্টিক সেন্টার, রক্তদাতা ও স্থানীয় তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম।",

  applicationName: "Chandpur Nagorik",

  keywords: [
    "চাঁদপুর",
    "চাঁদপুর নাগরিক",
    "Chandpur Nagorik",
    "Chandpur",
    "চাঁদপুর সেবা",
    "চাঁদপুর হাসপাতাল",
    "চাঁদপুর ডাক্তার",
    "চাঁদপুর ডাক্তার তালিকা",
    "চাঁদপুর ডায়াগনস্টিক",
    "চাঁদপুর ব্লাড ব্যাংক",
    "রক্তদাতা চাঁদপুর",
    "চাঁদপুর নাগরিক সেবা",
  ],

  authors: [
    {
      name: "Chandpur Nagorik",
      url: "https://chandpurnagorik.com",
    },
  ],

  creator: "Chandpur Nagorik",
  publisher: "Chandpur Nagorik",

  alternates: {
    canonical: "/",
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

  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://chandpurnagorik.com",
    siteName: "Chandpur Nagorik",
    title: "চাঁদপুর নাগরিক | Chandpur Nagorik",
    description:
      "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা, স্বাস্থ্যসেবা, হাসপাতাল, ডাক্তার, ডায়াগনস্টিক সেন্টার, রক্তদাতা ও স্থানীয় তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম.",
  },

  twitter: {
    card: "summary_large_image",
    title: "চাঁদপুর নাগরিক | Chandpur Nagorik",
    description:
      "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় সেবা ও তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম।",
  },
};

/* =========================
   Organization Structured Data
========================= */

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",

  name: "Chandpur Nagorik",
  alternateName: "চাঁদপুর নাগরিক",

  url: "https://chandpurnagorik.com",

  description:
    "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা ও তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম।",

  areaServed: {
    "@type": "City",
    name: "Chandpur",
  },

  address: {
    "@type": "PostalAddress",
    addressLocality: "Chandpur",
    addressRegion: "Chattogram Division",
    addressCountry: "BD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* =========================
            Organization Schema
        ========================= */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>

      <body className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />

        {/* =========================
            Google AdSense
        ========================= */}

        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9802392928690253"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}