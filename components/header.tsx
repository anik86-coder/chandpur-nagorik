import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ১৫টি ক্যাটাগরির লিস্ট (লুপ চালানোর জন্য অ্যারে বানালে কোড দেখতে সুন্দর লাগে)
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
    <header className="bg-white">
      {/* Logo + Date */}
      {/* py-3 সরিয়ে py-0 দেওয়া হলো, যাতে ওপরে-নিচে কোনো স্পেসিং না থাকে */}
      <div className="max-w-screen-xl mx-auto px-4 py-0 flex flex-col md:flex-row items-center justify-between">
        
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-banner-1.png"
            alt="Chandpur Nagorik Logo"
            width={300}  
            height={80}  
            // হাইট আরেকটু বাড়িয়ে দেওয়া হলো যাতে সুন্দর দেখায়
            className="object-contain h-14 md:h-[75px] w-auto" 
            priority 
          />
        </Link>

        {/* মোবাইলের জন্য একটু প্যাডিং রাখা হলো, কম্পিউটারে প্যাডিং থাকবে না */}
        <span className="text-sm text-gray-600 font-medium pb-2 md:pb-0">{today}</span>
      </div>
      
      {/* আপনার হেডারের বাকি কোড (মেনু ইত্যাদি) নিচে থাকবে... */}
      {/* Navigation */}
      <nav className="border-t border-gray-200">
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