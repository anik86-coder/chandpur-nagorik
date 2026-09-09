import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pt-12 pb-6 font-[Kalpurush]">
      <div className="max-w-screen-xl mx-auto px-4">
        
        {/* ================================================================= */}
        {/* টপ সেকশন: লোগো, ডেসক্রিপশন এবং কুইক লিংকস */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 mb-10">
          
          {/* লোগো এবং পরিচিতি */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/logo-banner-1.png" 
                alt="Chandpur Nagorik Logo"
                width={200}
                height={60}
                className="object-contain h-12 w-auto"
              />
            </Link>
            <p className="text-gray-500 text-[15px] leading-relaxed">
            প্রয়োজনীয় নাগরিক সেবা সহজভাবে মানুষের কাছে পৌঁছে দেওয়াই আমাদের মূল লক্ষ্য। চাঁদপুরের মানুষের দৈনন্দিন প্রয়োজন ও কল্যাণে বিভিন্ন নাগরিক সেবা প্রদানে আমরা অঙ্গীকারবদ্ধ। মানুষের সেবায়, মানুষের পাশে—চাঁদপুর নাগরিক।
            </p>
          </div>

          {/* প্রয়োজনীয় লিংকসমূহ */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 text-[15px] font-semibold text-gray-700 mt-2 md:mt-4">
            <Link href="/donation" className="hover:text-[#116cb4] transition-colors">
              ডোনেশন
            </Link>
            <Link href="/about" className="hover:text-[#116cb4] transition-colors">
              আমাদের সম্পর্কে
            </Link>
            <Link href="/contact" className="hover:text-[#116cb4] transition-colors">
              যোগাযোগ
            </Link>
            <Link href="/privacy" className="hover:text-[#116cb4] transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <Link href="/terms" className="hover:text-[#116cb4] transition-colors">
              শর্তাবলী
            </Link>
          </div>

        </div>

        {/* ================================================================= */}
        {/* বটম সেকশন: কপিরাইট এবং সোশ্যাল আইকন */}
        {/* ================================================================= */}
        {/* [আপডেট]: flex-col এবং items-center দিয়ে সব কিছু মাঝখানে আনা হয়েছে */}
        <div className="border-t border-gray-100 pt-6 flex flex-col justify-center items-center gap-4">
          
          {/* সোশ্যাল মিডিয়া আইকন (SVG) */}
          <div className="flex gap-5 items-center justify-center">
            
            {/* Facebook */}
            <a href="https://facebook.com/chandpurnagorik" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors" aria-label="Facebook">
              <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            
            {/* Twitter/X */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" aria-label="Twitter">
              <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            
            {/* YouTube */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF0000] transition-colors" aria-label="YouTube">
              <svg className="w-[24px] h-[24px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </a>

          </div>

          {/* কপিরাইট টেক্সট (মাঝখানে) */}
          <p className="text-gray-400 text-center font-medium tracking-wide">
            © {year} চাঁদপুর নাগরিক। সর্বস্বত্ব সংরক্ষিত।
          </p>

        </div>

      </div>
    </footer>
  );
}