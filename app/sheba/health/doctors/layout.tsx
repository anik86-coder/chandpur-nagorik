import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "চাঁদপুর ডাক্তার পয়েন্ট | ডাক্তার তালিকা",

  description:
    "চাঁদপুরের বিভিন্ন বিভাগের ডাক্তারদের তালিকা দেখুন। মেডিসিন, গাইনি, শিশু, চক্ষু, কার্ডিওলজি, ENT, অর্থোপেডিক্স, নিউরোলজি, নেফ্রোলজি ও অন্যান্য বিশেষজ্ঞ ডাক্তারদের তথ্য।",

  keywords: [
    "চাঁদপুর ডাক্তার",
    "চাঁদপুর ডাক্তার পয়েন্ট",
    "Chandpur Doctor",
    "Doctors in Chandpur",
    "Chandpur Doctor List",
    "চাঁদপুরের ডাক্তার",
    "চাঁদপুর বিশেষজ্ঞ ডাক্তার",
    "চাঁদপুর মেডিসিন ডাক্তার",
    "চাঁদপুর গাইনি ডাক্তার",
    "চাঁদপুর শিশু ডাক্তার",
    "চাঁদপুর চক্ষু ডাক্তার",
    "চাঁদপুর হৃদরোগ বিশেষজ্ঞ",
    "চাঁদপুর ENT ডাক্তার",
    "চাঁদপুর অর্থোপেডিক ডাক্তার",
    "চাঁদপুর নিউরোলজি ডাক্তার",
  ],

  alternates: {
    canonical:
      "https://chandpurnagorik.com/sheba/health/doctors",
  },

  openGraph: {
    title: "চাঁদপুর ডাক্তার পয়েন্ট | ডাক্তার তালিকা",

    description:
      "চাঁদপুরের বিভিন্ন বিভাগের ডাক্তারদের তালিকা ও চিকিৎসা সংক্রান্ত তথ্য।",

    url: "https://chandpurnagorik.com/sheba/health/doctors",

    siteName: "চাঁদপুর নাগরিক",

    locale: "bn_BD",

    type: "website",
  },

  twitter: {
    card: "summary",

    title: "চাঁদপুর ডাক্তার পয়েন্ট | ডাক্তার তালিকা",

    description:
      "চাঁদপুরের বিভিন্ন বিভাগের ডাক্তারদের তালিকা।",
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

const doctorPointSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",

  name: "চাঁদপুর ডাক্তার পয়েন্ট",

  alternateName: "Chandpur Doctor Point",

  url: "https://chandpurnagorik.com/sheba/health/doctors",

  description:
    "চাঁদপুরের বিভিন্ন বিভাগের ডাক্তারদের তালিকা ও চিকিৎসা সংক্রান্ত তথ্য।",

  isPartOf: {
    "@type": "WebSite",
    name: "চাঁদপুর নাগরিক",
    url: "https://chandpurnagorik.com",
  },

  about: {
    "@type": "MedicalOrganization",
    name: "চাঁদপুর ডাক্তার পয়েন্ট",
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
        item: "https://chandpurnagorik.com/",
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "স্বাস্থ্যসেবা",
        item: "https://chandpurnagorik.com/sheba/health",
      },

      {
        "@type": "ListItem",
        position: 3,
        name: "ডাক্তার পয়েন্ট",
        item: "https://chandpurnagorik.com/sheba/health/doctors",
      },
    ],
  },
};

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(doctorPointSchema),
        }}
      />

      {children}
    </>
  );
}