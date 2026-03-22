import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 mt-10 bg-gray-50">

      <div className="max-w-screen-xl mx-auto px-4 py-8">

        {/* Logo */}
        <div className="mb-4">
          <h2 className="text-2xl font-[AlinurRangpur]">
            চাঁদপুর নাগরিক
          </h2>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">

          <Link href="/about" className="hover:text-red-600">
            About
          </Link>

          <Link href="/contact" className="hover:text-red-600">
            Contact
          </Link>

          <Link href="/privacy" className="hover:text-red-600">
            Privacy Policy
          </Link>

        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © {year} Chandpur Nagorik. All rights reserved.
        </p>

      </div>

    </footer>
  );
}