
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";
import SupportWidget from "../components/SupportWidget";

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

/* SEO Metadata */

const siteUrl = "https://chandpurnagorik.com";

const siteTitle = "চাঁদপুর নাগরিক | Chandpur Nagorik";

const siteDescription =
  "চাঁদপুরের নাগরিকদের জন্য প্রয়োজনীয় নাগরিক সেবা, স্বাস্থ্যসেবা, হাসপাতাল, ডাক্তার, ডায়াগনস্টিক সেন্টার, রক্তদাতা ও স্থানীয় তথ্যের নির্ভরযোগ্য প্ল্যাটফর্ম।";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteTitle,
    template: "%s | চাঁদপুর নাগরিক",
  },

  description: siteDescription,

  applicationName: "চাঁদপুর নাগরিক",

  keywords: [
    "চাঁদপুর",
    "চাঁদপুর নাগরিক",
    "Chandpur Nagorik",
    "Chandpur",
    "চাঁদপুর সেবা",
    "চাঁদপুর নাগরিক সেবা",
    "চাঁদপুর হাসপাতাল",
    "চাঁদপুর ডাক্তার",
    "চাঁদপুর ডাক্তার তালিকা",
    "চাঁদপুর ডায়াগনস্টিক",
    "চাঁদপুর ব্লাড ব্যাংক",
    "রক্তদাতা চাঁদপুর",
    "চাঁদপুর স্বাস্থ্যসেবা",
  ],

  authors: [
    {
      name: "Chandpur Nagorik",
      url: siteUrl,
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
    url: siteUrl,
    siteName: "চাঁদপুর নাগরিক",
    title: siteTitle,
    description: siteDescription,
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

/* Organization Structured Data */

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "চাঁদপুর নাগরিক",
  alternateName: "Chandpur Nagorik",
  url: `${siteUrl}/`,
  description: siteDescription,
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

/* Website Structured Data */

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: "চাঁদপুর নাগরিক",
  alternateName: [
    "Chandpur Nagorik",
    "Chandpur Nagorik - চাঁদপুর নাগরিক",
  ],
  description: siteDescription,
  inLanguage: "bn-BD",
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};

/* Root Layout */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />

        <SupportWidget />
      </body>
    </html>
  );
}
