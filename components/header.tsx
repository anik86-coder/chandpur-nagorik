import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ১৬টি ক্যাটাগরির লিস্ট
  const categories = [
    { name: "হোম", link: "/" },
    { name: "সব", link: "/all" },
    { name: "চাঁদপুর", link: "/chandpur" },
    { name: "সারাদেশ", link: "/national" },
    { name: "রাজনীতি", link: "/politics" },
    { name: "অর্থনীতি", link: "/economy" },
    { name: "ক্রীড়া", link: "/sports" },
    { name: "আন্তর্জাতিক", link: "/international" },
    { name: "টেকনোলজি", link: "/technology" },
    { name: "বিনোদন", link: "/entertainment" },
    { name: "শিক্ষা", link: "/education" },
    { name: "স্বাস্থ্য", link: "/health" },
    { name: "ধর্ম", link: "/religion" },
    { name: "প্রবাস", link: "/probash" },
    { name: "লাইফস্টাইল", link: "/lifestyle" },
    { name: "মতামত", link: "/opinion" },
  ];

  return (
    // =========================================================================
    // ম্যাজিকটি এখানে: sticky, top-0, z-50 এবং shadow-sm যোগ করা হয়েছে
    // =========================================================================
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      
      {/* Logo + Date */}
      <div className="max-w-screen-xl mx-auto px-4 py-2 md:py-0 flex flex-col md:flex-row items-center justify-between">
        
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-banner-1.png"
            alt="Chandpur Nagorik Logo"
            width={300}  
            height={80}  
            className="object-contain h-14 md:h-[75px] w-auto" 
            priority 
          />
        </Link>

        {/* মোবাইলের জন্য একটু প্যাডিং রাখা হলো, কম্পিউটারে প্যাডিং থাকবে না */}
        <span className="text-sm text-gray-600 font-medium pb-2 md:pb-0">
          {today}
        </span>
      </div>
      
      {/* Navigation */}
      <nav className="border-t border-gray-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="flex flex-wrap gap-2 md:gap-3 py-3 font-medium justify-center">
            {categories.map((cat, index) => (
              <li key={index}>
                <Link
                  href={cat.link}
                  className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition-colors block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

    </header>
  );
}