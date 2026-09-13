"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { db } from "../../../firebase"; 
import { collection, query, where, orderBy, limit, startAfter, getDocs, getCountFromServer, updateDoc, doc, documentId, type DocumentSnapshot } from "firebase/firestore";

const checkAvailability = (lastDonationDate: string) => {
  if (!lastDonationDate) return true;
  const lastDate = new Date(lastDonationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 90;
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const BUSINESS_VERIFIED_DONOR_ID = "95164";
const toPublicDonor = (donorDoc: DocumentSnapshot) => {
  const data = donorDoc.data() || {};

  // Sensitive phone intentionally excluded from the public Firestore payload.
  return {
    id: donorDoc.id,
    name: data.name || "",
    group: data.group || "",
    dob: data.dob || "",
    address: data.address || "",
    disease: data.disease || "",
    allergy: data.allergy || "",
    email: data.email || "",
    lastDonation: data.lastDonation || "",
    verified: data.verified === true,
    verifiedAt: data.verifiedAt || "",
    createdAt: data.createdAt || "",
  };
};

const sortDonorsByAvailability = (donorList: any[]) => {
  return [...donorList].sort((a, b) => {
    const aAvailable = checkAvailability(a.lastDonation);
    const bAvailable = checkAvailability(b.lastDonation);

    // ১) যারা এখন রক্ত দিতে পারবেন তারা সবসময় আগে থাকবে।
    if (aAvailable !== bAvailable) return aAvailable ? -1 : 1;

    // ২) যারা গত ৯০ দিনের মধ্যে রক্ত দিয়েছেন তারা শেষে থাকবে।
    //    তাদের মধ্যে যে আগে রক্ত দিয়েছে সে আগে, নতুন donation শেষে।
    if (!aAvailable && !bAvailable) {
      const aDonation = a.lastDonation ? new Date(a.lastDonation).getTime() : 0;
      const bDonation = b.lastDonation ? new Date(b.lastDonation).getTime() : 0;

      if (aDonation !== bDonation) return aDonation - bDonation;
    }

    // একই status/date হলে Firestore-এর createdAt newest-first order বজায় রাখি।
    const aTime = a.createdAt?.toMillis?.() ?? (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    const bTime = b.createdAt?.toMillis?.() ?? (b.createdAt ? new Date(b.createdAt).getTime() : 0);
    return bTime - aTime;
  });
};


// [নোট]: টেস্ট করার জন্য লিমিট ২ করে দেওয়া হয়েছে, পরে আপনি এটি ১০০ করে দিতে পারেন
const DONORS_PER_PAGE = 25;

export default function BloodBankPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageCursors, setPageCursors] = useState<Record<string, DocumentSnapshot | null>>({});
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);

  // Cloudflare Turnstile — phone number reveal protection
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [turnstileLoading, setTurnstileLoading] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const [detailsModal, setDetailsModal] = useState<any | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<any | null>(null);
  const [businessVerificationDetails, setBusinessVerificationDetails] = useState<any | null>(null);
  const [loginModal, setLoginModal] = useState({ isOpen: false, donorId: null as string | null });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const requestIdRef = useRef(0);

  // [নতুন]: পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDonors, setTotalDonors] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [maxVisitedPage, setMaxVisitedPage] = useState(1);
  // নির্বাচিত গ্রুপের পুরো sorted list — pagination এই list থেকেই হবে।
  const [allGroupDonors, setAllGroupDonors] = useState<any[]>([]);


  const currentDonors = donors;

  const handlePageChange = async (pageNumber: number) => {
    if (!selectedGroup || pageNumber < 1 || isPageLoading) return;
    if (pageNumber === currentPage) return;
    if (totalPages > 0 && pageNumber > totalPages) return;

    const requestId = ++requestIdRef.current;
    setIsPageLoading(true);
    setLoading(true);

    try {
      // Global sorting আগে হয়েছে; তাই page slice করার পরেও serial ঠিক থাকবে।
      const startIndex = (pageNumber - 1) * DONORS_PER_PAGE;
      const pageDonors = allGroupDonors.slice(
        startIndex,
        startIndex + DONORS_PER_PAGE
      );

      if (requestId !== requestIdRef.current) return;

      setDonors(pageDonors);
      setHasNextPage(startIndex + DONORS_PER_PAGE < allGroupDonors.length);
      setCurrentPage(pageNumber);
      setMaxVisitedPage(prev => Math.max(prev, pageNumber));
      window.scrollTo({ top: 400, behavior: "smooth" });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("ডোনার পেজ লোড করতে সমস্যা হচ্ছে:", error);
      showToast("ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setIsPageLoading(false);
      }
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const loadDonorPage = async (
    group: string,
    pageNumber: number,
    cursor: DocumentSnapshot | null = null
  ) => {
    setIsPageLoading(true);
    setLoading(true);

    try {
      const snapshot = await getDocs(
        query(
          collection(db, "donors"),
          where("group", "==", group),
          orderBy("createdAt", "desc")
        )
      );

      const sortedDonors = sortDonorsByAvailability(
        snapshot.docs.map(toPublicDonor)
      );

      setAllGroupDonors(sortedDonors);
      setTotalDonors(sortedDonors.length);
      setTotalPages(Math.ceil(sortedDonors.length / DONORS_PER_PAGE));

      const startIndex = (pageNumber - 1) * DONORS_PER_PAGE;
      const pageDonors = sortedDonors.slice(
        startIndex,
        startIndex + DONORS_PER_PAGE
      );

      setDonors(pageDonors);
      setHasNextPage(startIndex + DONORS_PER_PAGE < sortedDonors.length);
      setCurrentPage(pageNumber);
      setMaxVisitedPage(prev => Math.max(prev, pageNumber));
    } catch (error) {
      console.error("ডোনার ডাটা লোড করতে সমস্যা হচ্ছে:", error);
      setDonors([]);
      setAllGroupDonors([]);
      setHasNextPage(false);
      showToast("ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    } finally {
      setLoading(false);
      setIsPageLoading(false);
    }
  };

  const handleGroupSelect = async (bg: string) => {
    const requestId = ++requestIdRef.current;
    setSelectedGroup(bg);
    setSearchTerm("");
    setIsSearchActive(false);

    setLoading(true);
    setIsPageLoading(true);
    setDonors([]);
    setAllGroupDonors([]);
    setCurrentPage(1);
    setMaxVisitedPage(1);
    setHasNextPage(false);
    setPageCursors({});
    setTotalDonors(0);
    setTotalPages(0);

    try {
      // পুরো group একবার নিয়ে GLOBAL sorting করা হচ্ছে।
      // ফলে 100 জনের মধ্যে 10 জন donated হলে সেই 10 জন
      // সবসময় 91-100 এর দিকে থাকবে, page অনুযায়ী আলাদা আলাদা নয়।
      const snapshot = await getDocs(
        query(
          collection(db, "donors"),
          where("group", "==", bg),
          orderBy("createdAt", "desc")
        )
      );

      if (requestId !== requestIdRef.current) return;

      const sortedDonors = sortDonorsByAvailability(
        snapshot.docs.map(toPublicDonor)
      );

      setAllGroupDonors(sortedDonors);
      setTotalDonors(sortedDonors.length);
      setTotalPages(Math.ceil(sortedDonors.length / DONORS_PER_PAGE));

      const firstPage = sortedDonors.slice(0, DONORS_PER_PAGE);
      setDonors(firstPage);
      setHasNextPage(sortedDonors.length > DONORS_PER_PAGE);
      setCurrentPage(1);
      setMaxVisitedPage(1);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("গ্রুপের ডাটা লোড করতে সমস্যা হচ্ছে:", error);
      setDonors([]);
      setAllGroupDonors([]);
      setHasNextPage(false);
      setTotalDonors(0);
      setTotalPages(0);
      showToast("ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setIsPageLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    const term = searchTerm.trim().toLowerCase();

    // Search only works after a blood group is selected.
    if (!selectedGroup) return;

    if (!term) {
      await handleGroupSelect(selectedGroup);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsSearchActive(true);

    setLoading(true);
    setIsPageLoading(true);
    setCurrentPage(1);
    setMaxVisitedPage(1);
    setHasNextPage(false);
    setPageCursors({});
    setTotalDonors(0);
    setTotalPages(0);

    try {
      const results: any[] = [];

      // Exact Donor ID search — restricted to the selected blood group.
      const idSnapshot = await getDocs(
        query(
          collection(db, "donors"),
          where(documentId(), "==", term)
        )
      );

      if (requestId !== requestIdRef.current) return;

      idSnapshot.forEach(d => {
        const data = d.data();

        // IMPORTANT: a donor from another blood group will never appear.
        if (data.group === selectedGroup) {
          results.push(toPublicDonor(d));
        }
      });

      // Name search — only inside the currently selected blood group.
      const nameSnapshot = await getDocs(
        query(
          collection(db, "donors"),
          where("group", "==", selectedGroup),
          orderBy("createdAt", "desc")
        )
      );

      if (requestId !== requestIdRef.current) return;

      nameSnapshot.forEach(d => {
        const data = d.data();
        const name = String(data.name || "").toLowerCase();

        if (
          name.includes(term) &&
          !results.some(result => result.id === d.id)
        ) {
          results.push(toPublicDonor(d));
        }
      });

      const sortedResults = sortDonorsByAvailability(results);
      setAllGroupDonors(sortedResults);
      setDonors(sortedResults);
      setTotalDonors(sortedResults.length);
      setTotalPages(results.length > 0 ? 1 : 0);
      setHasNextPage(false);
      setCurrentPage(1);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error("সার্চ করতে সমস্যা হচ্ছে:", error);
      setDonors([]);
      setTotalDonors(0);
      setTotalPages(0);
      showToast("সার্চ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setIsPageLoading(false);
      }
    }
  };

  const handleClearSearch = () => {
    requestIdRef.current++;
    setSearchTerm("");
    setIsSearchActive(false);
    searchInputRef.current?.focus();

    if (selectedGroup) {
      handleGroupSelect(selectedGroup);
    }
  };

  // Open CAPTCHA before showing a donor's phone number
  const handlePhoneReveal = () => {
    if (!detailsModal) return;

    setRevealedPhone(null);
    setTurnstileLoading(false);
    setTurnstileKey((prev) => prev + 1);
    setShowTurnstile(true);
  };

  // Verify the Turnstile token on the server before revealing the phone
  const handleTurnstileSuccess = async (token: string) => {
    if (!detailsModal) return;

    setTurnstileLoading(true);

    try {
      const res = await fetch("/api/reveal-donor-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          donorId: detailsModal.id,
        }),
      });

      const data = await res.json();

      console.log("PHONE REVEAL SERVER RESPONSE:", {
        success: data?.success,
        errorCodes: data?.errorCodes || [],
      });

      if (!res.ok || !data.success || !data.phone) {
        showToast(
          data.message || "মোবাইল নম্বর দেখানো যায়নি।",
          "error"
        );

        setShowTurnstile(false);
        setTurnstileKey((prev) => prev + 1);
        return;
      }

      // Server verification-এর পর server থেকেই phone পাওয়া যাচ্ছে।
      setRevealedPhone(data.phone);
      setShowTurnstile(false);

      showToast("যাচাই সফল হয়েছে। মোবাইল নম্বর দেখানো হচ্ছে।");
    } catch (error) {
      console.error("Phone reveal error:", error);

      showToast(
        "মোবাইল নম্বর দেখাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        "error"
      );

      setShowTurnstile(false);
      setTurnstileKey((prev) => prev + 1);
    } finally {
      setTurnstileLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!loginEmail) {
      showToast("অনুগ্রহ করে আপনার ইমেইল এড্রেস দিন।", "error");
      return;
    }

    const trimmedLoginEmail = loginEmail.trim().toLowerCase();
    const targetDonor = donors.find(d => d.id === loginModal.donorId);
    
    if (targetDonor && targetDonor.email?.trim().toLowerCase() !== trimmedLoginEmail) {
      showToast("এটি এই ডোনারের নিবন্ধিত ইমেইল নয়! সঠিক ইমেইলটি দিন।", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedLoginEmail }) 
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        showToast("আপনার ইমেইলে একটি ৬-ডিজিটের OTP পাঠানো হয়েছে!");
      } else {
        showToast(data.message || "OTP পাঠাতে সমস্যা হয়েছে。", "error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showToast("সার্ভারে সমস্যা হচ্ছে। একটু পর আবার চেষ্টা করুন。", "error");
    }
    setIsProcessing(false);
  };

  const handleVerifyAndUpdate = async () => {
    if (!loginOtp) {
      showToast("অনুগ্রহ করে ইমেইলে আসা OTP কোডটি দিন।", "error");
      return;
    }

    if (!loginModal.donorId) {
      showToast("ডোনারের তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          otp: loginOtp,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(
          data.message || "ভুল OTP দেওয়া হয়েছে বা মেয়াদ শেষ।",
          "error"
        );
        return;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const donorId = loginModal.donorId;
      const donorRef = doc(db, "donors", donorId);

      // Firestore-এ donation date update
      await updateDoc(donorRef, {
        lastDonation: todayStr,
      });

      // Global donor list-এও একই update করা হচ্ছে।
      // এখন donorটি unavailable হয়ে donated section-এর একদম শেষে যাবে,
      // আর অন্য page-গুলোতেও একই serial বজায় থাকবে।
      setAllGroupDonors(prev => {
        const target = prev.find(d => d.id === donorId);
        if (!target) return prev;

        const others = prev.filter(d => d.id !== donorId);
        const updatedDonor = { ...target, lastDonation: todayStr };
        return sortDonorsByAvailability([...others, updatedDonor]);
      });

      setDonors(prev => {
        const target = prev.find(d => d.id === donorId);
        if (!target) return prev;

        // Current page-এর local preview-ও global list অনুযায়ী rebuild হবে।
        const updatedDonor = { ...target, lastDonation: todayStr };
        const updatedAll = sortDonorsByAvailability(
          allGroupDonors.map(d => d.id === donorId ? updatedDonor : d)
        );
        const startIndex = (currentPage - 1) * DONORS_PER_PAGE;
        return updatedAll.slice(startIndex, startIndex + DONORS_PER_PAGE);
      });

      closeModal();

      showToast(
        "ধন্যবাদ! আপনার রক্ত দেওয়ার তথ্য সফলভাবে আপডেট করা হয়েছে।"
      );
    } catch (error) {
      console.error("Error verifying/updating donor:", error);
      showToast(
        "স্ট্যাটাস আপডেট করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setLoginModal({ isOpen: false, donorId: null });
    setLoginEmail("");
    setLoginOtp("");
    setOtpSent(false);

    setShowTurnstile(false);
    setTurnstileLoading(false);
    setRevealedPhone(null);
    setTurnstileKey((prev) => prev + 1);
  };

  return (
    <main className="max-w-screen-md mx-auto px-4 py-5 font-[Kalpurush] min-h-screen relative">
      
      {toast.show && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[200] px-6 py-3 rounded-lg shadow-lg text-white font-bold transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="text-center mt-3 mb-6 pb-3">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-3 flex items-center justify-center gap-2">
          <span>🩸</span> ব্লাড ব্যাংক
        </h1>
        <p className="text-gray-600 text-[17px]">জরুরি মুহূর্তে রক্তের সন্ধানে আমরা আছি আপনার পাশে।</p>
      </div>

      <>

          <div className="grid grid-cols-4 gap-3 mb-5">
            {bloodGroups.map(bg => (
              <button 
                key={bg} 
                onClick={() => handleGroupSelect(bg)}
                className={`py-3 rounded-lg font-bold text-xl transition-all border ${selectedGroup === bg ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
              >
                {bg}
              </button>
            ))}
          </div>

          <div className="text-center mt-2 mb-4 border-b border-gray-200 pb-4">
            <Link
              href="/sheba/blood-bank/register"
              className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition shadow-lg w-full md:w-auto"
            >
              আমি রক্ত দিতে চাই 🩸
            </Link>
            <p className="text-gray-500 text-sm mt-3">আপনি চাইলে নিজে রক্তদাতা হিসেবে যুক্ত হতে পারেন</p>
          </div>

          {selectedGroup && (
            <div>
              <div className="flex justify-between items-center mb-3 border-l-4 border-red-600 pl-3 bg-gray-50 py-2.5 pr-4 rounded-r-lg shadow-sm border-y border-r border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedGroup} রক্তের ডোনার তালিকা
                </h3>
                <span className="bg-white border border-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-md shadow-sm">
                  দেখানো: <span className="text-red-600">{currentDonors.length}</span> জন{hasNextPage ? " +" : ""}
                </span>
              </div>
              
              {/* Search — opens only after a blood group is selected */}
              <div className="mb-4">
                <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-gray-50 p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-lg">
                      🔎
                    </span>

                    <div className="relative flex-1">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchTerm(value);

                          // Backspace দিয়ে পুরো সার্চ লেখা মুছে ফেললে
                          // X চাপার মতোই আবার নির্বাচিত গ্রুপের সব ডাটা দেখাবে।
                          if (!value.trim()) {
                            handleClearSearch();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        placeholder="ডোনারের নাম বা 8-digit Donor ID..."
                        className="w-full h-12 border border-gray-200 bg-white rounded-xl px-10 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-gray-800 text-base text-center shadow-sm transition-all"
                        aria-label={`${selectedGroup} গ্রুপে ডোনার খুঁজুন`}
                      />
                    </div>

                    {searchTerm.trim() && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="shrink-0 h-14 w-16 flex items-center justify-center rounded-xl bg-gray-100 border-2 border-gray-300 text-gray-600 text-4xl font-bold leading-none hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all shadow-md"
                        aria-label="সার্চ মুছুন"
                        title="সার্চ মুছুন"
                      >
                        ×
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={isPageLoading || !searchTerm.trim()}
                      className="shrink-0 h-12 min-w-[120px] px-7 rounded-xl bg-red-600 text-white font-bold text-base hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
                    >
                      {isPageLoading ? "খোঁজা হচ্ছে..." : "খুঁজুন"}
                    </button>
                  </div>
                </div>
              </div>

              {loading || isPageLoading ? (
                <div className="space-y-2" aria-label="ডোনার লোড হচ্ছে">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm animate-pulse"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 rounded w-2/5 mb-4" />
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                          <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
                          <div className="h-7 bg-gray-200 rounded-full w-36" />
                        </div>
                        <div className="h-10 bg-gray-200 rounded-lg w-28" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentDonors.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {currentDonors.map(donor => {
                      const isAvailable = checkAvailability(donor.lastDonation);

                      return (
                        <div key={donor.id} className={`p-5 rounded-lg border ${isAvailable ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50 opacity-75'} hover:shadow-md transition-shadow`}>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-bold text-xl text-gray-900 flex items-center gap-1.5">
                                <span>{donor.name}</span>

                                {donor.id === BUSINESS_VERIFIED_DONOR_ID ? (
                                  <button
                                    type="button"
                                    onClick={() => setBusinessVerificationDetails(donor)}
                                    className="inline-flex items-center justify-center w-5 h-5 shrink-0 hover:scale-110 transition-transform"
                                    title="Official Business Account — বিস্তারিত দেখতে ক্লিক করুন"
                                    aria-label="Official Business Account"
                                  >
                                    <img
                                      src="/golden-verify.png"
                                      alt="Official Business Verified"
                                      className="w-5 h-5 object-contain"
                                    />
                                  </button>
                                ) : donor.verified === true ? (
                                  <button
                                    type="button"
                                    onClick={() => setVerificationDetails(donor)}
                                    className="inline-flex items-center justify-center w-5 h-5 shrink-0 hover:scale-110 transition-transform"
                                    title="Verified donor — বিস্তারিত দেখতে ক্লিক করুন"
                                    aria-label="Verified donor"
                                  >
                                    <img
                                      src="/check1.png"
                                      alt="Verified donor"
                                      className="w-5 h-5 object-contain"
                                    />
                                  </button>
                                ) : null}
                              </h4>

                              {donor.address && (
                                <div className="mt-1.5 mb-2">
                                  <span className="bg-gray-100 text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded inline-flex items-center gap-1 font-sans">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    {donor.address}
                                  </span>
                                </div>
                              )}

                              <div
                                className="flex items-center gap-1.5 mt-1 cursor-pointer group w-fit transition-all"
                                onClick={() => {
                                  navigator.clipboard.writeText(donor.id);
                                  setCopiedId(donor.id);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                                title="ID কপি করতে ক্লিক করুন"
                              >
                                <p className="text-xs font-normal text-gray-400 group-hover:text-gray-600 transition-colors">
                                  ID: <span className="font-mono font-bold text-gray-600 tracking-wider select-all">{donor.id}</span>
                                </p>

                                {copiedId === donor.id ? (
                                  <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1 rounded flex items-center font-sans">
                                    Copied!
                                  </span>
                                ) : (
                                  <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012 2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 002 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                              </div>

                              <span className={`inline-block mt-3 px-3 py-1.5 text-sm font-bold rounded-full ${isAvailable ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                {isAvailable ? '✅ রক্ত দিতে প্রস্তুত' : '⏳ এখন পারবেন না'}
                              </span>
                            </div>

                            <div className="text-right">
                              {isAvailable ? (
                                <button
                                  onClick={() => { setDetailsModal(donor); setRevealedPhone(null); }}
                                  className="bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  বিস্তারিত দেখুন
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="bg-gray-100 text-gray-400 border border-gray-200 text-sm px-4 py-2 rounded-lg font-bold cursor-not-allowed"
                                >
                                  অ্যাভেইলেবল নয়
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Pagination — only once at the bottom */}
                  {!searchTerm.trim() && (totalPages > 1 || totalDonors > 0) && (
                    <div className="flex flex-col items-center mt-4 mb-4 bg-gray-50 py-3 px-3 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex flex-wrap justify-center items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || isPageLoading}
                          className="px-4 py-2 rounded-lg font-bold text-sm border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 text-gray-700 bg-white"
                        >
                          ← পূর্ববর্তী
                        </button>

                        {(() => {
                          if (totalPages <= 5) {
                            return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                disabled={page > maxVisitedPage || isPageLoading}
                                className={`min-w-10 px-3 py-2 rounded-lg font-bold text-sm border transition-all ${
                                  currentPage === page
                                    ? "bg-red-600 text-white border-red-600 shadow-md"
                                    : page > maxVisitedPage
                                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                      : "bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600"
                                }`}
                              >
                                {page}
                              </button>
                            ));
                          }

                          let startPage = 1;
                          let endPage = 5;

                          if (currentPage >= totalPages - 2) {
                            startPage = Math.max(1, totalPages - 4);
                            endPage = totalPages;
                          } else if (currentPage >= 4) {
                            startPage = currentPage - 2;
                            endPage = currentPage + 2;
                          }

                          const pages = Array.from(
                            { length: endPage - startPage + 1 },
                            (_, i) => startPage + i
                          );

                          return (
                            <>
                              {pages.map(page => (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  disabled={page > maxVisitedPage || isPageLoading}
                                  className={`min-w-10 px-3 py-2 rounded-lg font-bold text-sm border transition-all ${
                                    currentPage === page
                                      ? "bg-red-600 text-white border-red-600 shadow-md"
                                      : page > maxVisitedPage
                                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600"
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                              {endPage < totalPages && (
                                <span className="px-1 text-gray-500 font-bold">…</span>
                              )}
                            </>
                          );
                        })()}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!hasNextPage || isPageLoading}
                          className="px-4 py-2 rounded-lg font-bold text-sm border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 text-white bg-red-600"
                        >
                          {isPageLoading ? "লোড হচ্ছে..." : "পরবর্তী →"}
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 font-semibold mt-2">
                        মোট {totalDonors} জন ডোনার • পেজ {currentPage} / {totalPages}
                      </div>
                    </div>
                  )}

                </>
              ) : (
                <p className="text-center py-10 text-gray-500 bg-gray-50 rounded border border-dashed">
                  {searchTerm.trim()
                    ? `“${searchTerm.trim()}” দিয়ে ${selectedGroup} গ্রুপে কোনো ডোনার পাওয়া যায়নি।`
                    : "এই গ্রুপের কোনো ডোনার আপাতত নেই। আপনি প্রথম হতে পারেন!"}
                </p>
              )}
            </div>
          )}
        </>

      {detailsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[140] px-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setDetailsModal(null)} className="absolute top-4 right-5 text-gray-400 hover:text-red-600 text-2xl font-bold">×</button>
            <h3 className="text-xl font-bold mb-5 text-gray-800 border-b-2 border-red-100 pb-2 mt-2">ডোনারের বিস্তারিত তথ্য</h3>

            <div className="space-y-3 mb-6 text-gray-700">
              <p><span className="font-bold text-gray-500 w-24 inline-block">নাম:</span> <span className="text-xl font-bold text-gray-900">{detailsModal.name}</span></p>
              <p><span className="font-bold text-gray-500 w-24 inline-block">রক্তের গ্রুপ:</span> <span className="text-red-600 font-bold text-lg">{detailsModal.group}</span></p>
              <p><span className="font-bold text-gray-500 w-24 inline-block">ঠিকানা:</span> {detailsModal.address}</p>
              <p><span className="font-bold text-gray-500 w-24 inline-block">জন্মতারিখ:</span> {detailsModal.dob}</p>
              {detailsModal.disease && <p><span className="font-bold text-gray-500 w-24 inline-block">রোগ:</span> {detailsModal.disease}</p>}
              {detailsModal.allergy && <p><span className="font-bold text-gray-500 w-24 inline-block">অ্যালার্জি:</span> {detailsModal.allergy}</p>}
            </div>

            <div className="bg-green-50 p-5 rounded-xl text-center border border-green-200">
              <p className="text-green-700 font-bold mb-4 flex items-center justify-center gap-2"><span>✅</span> রক্ত দিতে প্রস্তুত</p>
              
              {revealedPhone ? (
                <div className="flex flex-col items-center gap-4">
                  <a href={`tel:${revealedPhone}`} className="text-2xl font-bold text-[#116cb4] tracking-widest bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 w-full">{revealedPhone}</a>
                  <button
                    onClick={() => {
                      setDetailsModal(null);
                      setLoginModal({ isOpen: true, donorId: detailsModal.id });
                    }}
                    className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 w-full shadow-md transition-colors"
                  >
                    আমি রক্ত দিয়েছি (আপডেট)
                  </button>
                </div>
              ) : !showTurnstile ? (
                <button
                  type="button"
                  onClick={handlePhoneReveal}
                  className="
                    bg-[#116cb4]
                    text-white
                    px-6
                    py-3
                    rounded-lg
                    font-bold
                    hover:bg-blue-700
                    w-full
                    transition-all
                    shadow-md
                  "
                >
                  মোবাইল নম্বর দেখুন
                </button>
              ) : (
                <div className="bg-white rounded-xl border border-blue-100 p-4">
                  <p className="text-sm font-bold text-gray-700 mb-3">
                    নম্বর দেখতে আগে যাচাই করুন
                  </p>

                  <div className="flex justify-center">
                    <Turnstile
                      key={turnstileKey}
                      siteKey={
                        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
                      }
                      onSuccess={handleTurnstileSuccess}
                      onError={() => {
                        setTurnstileLoading(false);

                        showToast(
                          "CAPTCHA verification ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
                          "error"
                        );
                      }}
                      onExpire={() => {
                        setTurnstileLoading(false);

                        showToast(
                          "CAPTCHA-এর সময় শেষ হয়েছে। আবার যাচাই করুন।",
                          "error"
                        );
                      }}
                      options={{
                        theme: "light",
                        size: "normal",
                      }}
                    />
                  </div>

                  {turnstileLoading && (
                    <p className="mt-3 text-xs text-blue-600 font-bold">
                      যাচাই করা হচ্ছে...
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowTurnstile(false);
                      setTurnstileLoading(false);
                      setTurnstileKey((prev) => prev + 1);
                    }}
                    className="
                      mt-3
                      text-xs
                      font-bold
                      text-gray-500
                      hover:text-red-600
                      transition-colors
                    "
                  >
                    বাতিল
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {businessVerificationDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[165] px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xs text-center shadow-2xl overflow-hidden">
            <div className="p-7">
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <img
                  src="/golden-verify.png"
                  alt="Business Verified"
                  className="w-16 h-16 object-contain"
                />
              </div>

              <h3 className="text-2xl font-extrabold text-gray-800">
                Business Verified
              </h3>
            </div>

            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={() => setBusinessVerificationDetails(null)}
                className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {verificationDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[160] px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm text-center shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-7">
              <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <img src="/check1.png" alt="Verified donor" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800">Verified Donor</h3>
              <p className="text-lg font-bold text-gray-700 mt-2">
                {verificationDetails.name || "এই ডোনার"}
              </p>
              <p className="text-sm text-blue-600 font-semibold mt-2">
                চাঁদপুর নাগরিক কর্তৃক যাচাইকৃত
              </p>
              {verificationDetails.verifiedAt && (
                <p className="text-xs text-gray-400 mt-2">
                  Verified: {new Date(verificationDetails.verifiedAt).toLocaleDateString("bn-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={() => setVerificationDetails(null)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {loginModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] px-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-2 text-gray-800">স্ট্যাটাস আপডেট</h3>
            
            {!otpSent ? (
              <>
                <p className="text-sm text-gray-500 mb-6">নিবন্ধিত ইমেইলটি দিন।</p>
                <input 
                  type="email" 
                  placeholder="আপনার ইমেইল এড্রেস" 
                  className="border-b-2 border-gray-300 py-2 w-full mb-6 outline-none focus:border-red-600 text-center text-lg bg-transparent transition-colors"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
                <div className="flex gap-3">
                  <button onClick={handleSendOtp} disabled={isProcessing} className="bg-red-600 text-white py-3 w-full rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 transition-all shadow-md">
                    {isProcessing ? 'পাঠানো হচ্ছে...' : 'OTP পাঠান'}
                  </button>
                  <button onClick={closeModal} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-all">বাতিল</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-green-600 mb-6 font-semibold bg-green-50 p-2 rounded-lg">আপনার ইমেইলে একটি ৬-ডিজিটের কোড পাঠানো হয়েছে।</p>
                <input 
                  type="text" 
                  placeholder="------" 
                  className="border-b-2 border-green-400 py-2 w-full mb-6 outline-none focus:border-green-600 text-center text-3xl tracking-[0.5em] font-bold bg-transparent transition-colors"
                  value={loginOtp}
                  onChange={e => setLoginOtp(e.target.value)}
                  maxLength={6}
                />
                <div className="flex gap-3">
                  <button onClick={handleVerifyAndUpdate} disabled={isProcessing} className="bg-green-600 text-white py-3 w-full rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all shadow-md">
                    {isProcessing ? 'ভেরিফাই হচ্ছে...' : 'আপডেট করুন'}
                  </button>
                  <button onClick={closeModal} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-all">বাতিল</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </main>
  );
}