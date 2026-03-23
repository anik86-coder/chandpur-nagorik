"use client";
import { useState, useEffect } from "react";

export default function ShareButtons() {
  const [isCopied, setIsCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // কপি করার শক্তিশালী ফাংশন (লোকাল আইপিতেও কাজ করবে)
  const handleCopyLink = async () => {
    if (!currentUrl) return;

    try {
      // যদি সিকিউর কানেকশন (HTTPS বা Localhost) থাকে
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        // যদি আপনার মতো লোকাল আইপি (192.168...) হয়, তবে এই বিকল্প নিয়মে কপি করবে
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed: ", err);
    }
  };

  // প্রিন্ট করার ফাংশন
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-3">
      
      {/* Facebook Button */}
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-blue-600 hover:text-white rounded-full text-gray-700 transition duration-300"
        title="Share on Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
      </a>

      {/* Instagram Button */}
      <a 
        href="https://instagram.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-pink-600 hover:text-white rounded-full text-gray-700 transition duration-300"
        title="Instagram"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>

      {/* Copy Link Button */}
      <div className="relative flex items-center justify-center">
        <button 
          onClick={handleCopyLink}
          type="button"
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
            isCopied 
              ? "bg-green-100 text-green-600 scale-110" 
              : "bg-gray-100 hover:bg-gray-300 text-gray-700"
          }`}
          title="Copy Link"
        >
          {isCopied ? (
            <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
          )}
        </button>

        {isCopied && (
          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg animate-bounce whitespace-nowrap z-10">
            Copied!
          </span>
        )}
      </div>

      {/* Print Button */}
      <button 
        onClick={handlePrint}
        type="button"
        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-300 rounded-full text-gray-700 transition duration-300"
        title="Print News"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      </button>

    </div>
  );
}