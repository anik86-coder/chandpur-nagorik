import Link from "next/link";
import Image from "next/image"; // Image component import kora hoyeche

export default function Header() {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white">

      {/* Logo + Date */}
      
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between">

        {/* Ekhane flex ebong gap-3 bebohar kora hoyeche jate pashapashi thake */}
        <Link href="/" className="flex items-center gap-3">
          
          {/* Logo add kora holo */}
          <Image
            src="/logo-1.png"
            alt="Chandpur Nagorik Logo"
            width={50} // Logo-r width (apni chaile kom-beshi korte paren)
            height={50} // Logo-r height
            className="object-contain"
          />

          <h1 className="text-4xl font-[AlinurRangpur]">
            চাঁদপুর নাগরিক
          </h1>
        </Link>

        <span className="text-sm text-gray-600">
          {today}
        </span>

      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="flex flex-wrap gap-3 py-2 font-medium justify-center">
            <li>
              <Link href="/" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                হোম
              </Link>
            </li>
            <li>
              <Link href="/category/local" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                চাঁদপুর
              </Link>
            </li>
            <li>
              <Link href="/category/national" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                সারাদেশ
              </Link>
            </li>
            <li>
              <Link href="/category/politics" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                রাজনীতি
              </Link>
            </li>
            <li>
              <Link href="/category/economy" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                অর্থনীতি
              </Link>
            </li>
            <li>
              <Link href="/category/sports" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                ক্রীড়া
              </Link>
            </li>
            <li>
              <Link href="/category/international" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                আন্তর্জাতিক
              </Link>
            </li>
            <li>
              <Link href="/category/technology" className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                টেকনোলজি
              </Link>
            </li>
          </ul>
        </div>
      </nav>

    </header>
  );
}