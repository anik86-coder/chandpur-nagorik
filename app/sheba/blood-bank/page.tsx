"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import { db } from "../../../firebase"; 
import { collection, query, where, orderBy, limit, startAfter, getDocs, getCountFromServer, doc, type DocumentSnapshot } from "firebase/firestore";

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
  const router = useRouter();
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
  const [hoveredVerificationId, setHoveredVerificationId] = useState<string | null>(null);
  const [clickedVerificationId, setClickedVerificationId] = useState<string | null>(null);
  const verificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loginModal, setLoginModal] = useState({ isOpen: false, donorId: null as string | null });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showCancelWarning, setShowCancelWarning] = useState(false); 
  
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
  const [showScrollTop, setShowScrollTop] = useState(false);


  const currentDonors = donors;

  // নিচে স্ক্রল করলে "উপরে যান" বাটন দেখাবে
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


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

  // Verification tooltip: phone tap/click should disappear quickly,
  // and any outside interaction (tap, click, scroll, wheel, touch move, key) closes it.
  const showVerificationPopup = (id: string) => {
    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
    }

    setClickedVerificationId(id);

    verificationTimerRef.current = setTimeout(() => {
      setClickedVerificationId((prev) => (prev === id ? null : prev));
      verificationTimerRef.current = null;
    }, 700);
  };

  const closeVerificationPopup = () => {
    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
      verificationTimerRef.current = null;
    }

    setClickedVerificationId(null);
  };

  useEffect(() => {
    if (!clickedVerificationId) return;

    const handleOutsideInteraction = () => {
      closeVerificationPopup();
    };

    document.addEventListener("pointerdown", handleOutsideInteraction, true);
    document.addEventListener("touchstart", handleOutsideInteraction, true);
    document.addEventListener("keydown", handleOutsideInteraction, true);
    window.addEventListener("scroll", handleOutsideInteraction, true);
    window.addEventListener("wheel", handleOutsideInteraction, true);
    window.addEventListener("touchmove", handleOutsideInteraction, true);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideInteraction, true);
      document.removeEventListener("touchstart", handleOutsideInteraction, true);
      document.removeEventListener("keydown", handleOutsideInteraction, true);
      window.removeEventListener("scroll", handleOutsideInteraction, true);
      window.removeEventListener("wheel", handleOutsideInteraction, true);
      window.removeEventListener("touchmove", handleOutsideInteraction, true);
    };
  }, [clickedVerificationId]);

  useEffect(() => {
    return () => {
      if (verificationTimerRef.current) {
        clearTimeout(verificationTimerRef.current);
      }
    };
  }, []);

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

      // ID + name partial search within selected blood group.
      const searchSnapshot = await getDocs(
        query(
          collection(db, "donors"),
          where("group", "==", selectedGroup),
          orderBy("createdAt", "desc")
        )
      );

      if (requestId !== requestIdRef.current) return;

      searchSnapshot.forEach(d => {
        const data = d.data();
        const donorId = String(d.id || "").toLowerCase();
        const name = String(data.name || "").toLowerCase();

        if (
          (donorId.includes(term) || name.includes(term)) &&
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

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatCooldown = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const handleSendOtp = async () => {
    if (resendCooldown > 0) {
      showToast(
        `আবার OTP পাঠাতে ${formatCooldown(resendCooldown)} অপেক্ষা করুন।`,
        "error"
      );
      return;
    }

    if (!loginEmail) {
      showToast("অনুগ্রহ করে আপনার ইমেইল এড্রেস দিন।", "error");
      return;
    }

    const trimmedLoginEmail = loginEmail.trim().toLowerCase();
    const donorId = String(loginModal.donorId || "").trim();

    if (!donorId) {
      showToast("ডোনারের তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।", "error");
      return;
    }

    const targetDonor = donors.find((d) => d.id === donorId);

    if (
      targetDonor &&
      targetDonor.email?.trim().toLowerCase() !== trimmedLoginEmail
    ) {
      showToast(
        "এটি এই ডোনারের নিবন্ধিত ইমেইল নয়! সঠিক ইমেইলটি দিন।",
        "error"
      );
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedLoginEmail,
          donorId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setLoginOtp("");
        setResendCooldown(120);
        showToast("আপনার ইমেইলে একটি ৬-ডিজিটের OTP পাঠানো হয়েছে!");
      } else {
        showToast(data.message || "OTP পাঠাতে সমস্যা হয়েছে।", "error");

        if (
          typeof data.retryAfterSeconds === "number" &&
          data.retryAfterSeconds > 0
        ) {
          setOtpSent(true);
          setResendCooldown(data.retryAfterSeconds);
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showToast(
        "সার্ভারে সমস্যা হচ্ছে। একটু পর আবার চেষ্টা করুন।",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
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
      const donorId = loginModal.donorId;

      // OTP verification + donor status update are now handled server-side
      // using Firebase Admin SDK. This avoids Firestore client permission errors.
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          otp: loginOtp,
          donorId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(
          data.message || "ভুল OTP দেওয়া হয়েছে বা স্ট্যাটাস আপডেট করা যায়নি।",
          "error"
        );
        return;
      }

      const todayStr =
        data.lastDonation || new Date().toISOString().split("T")[0];

      // Server-side Admin SDK already updated Firestore.
      // এখানে শুধু UI-এর local donor list update করা হচ্ছে।
      setAllGroupDonors((prev) => {
        const target = prev.find((d) => d.id === donorId);
        if (!target) return prev;

        const others = prev.filter((d) => d.id !== donorId);
        const updatedDonor = { ...target, lastDonation: todayStr };

        return sortDonorsByAvailability([...others, updatedDonor]);
      });

      setDonors((prev) => {
        const target = prev.find((d) => d.id === donorId);
        if (!target) return prev;

        const updatedDonor = { ...target, lastDonation: todayStr };
        const updatedAll = sortDonorsByAvailability(
          allGroupDonors.map((d) =>
            d.id === donorId ? updatedDonor : d
          )
        );

        const startIndex = (currentPage - 1) * DONORS_PER_PAGE;

        return updatedAll.slice(
          startIndex,
          startIndex + DONORS_PER_PAGE
        );
      });

      closeModal();

      showToast(
        "ধন্যবাদ! আপনার রক্ত দেওয়ার তথ্য সফলভাবে আপডেট করা হয়েছে।"
      );
    } catch (error) {
      console.error("Error verifying/updating donor:", error);

      showToast(
        "স্ট্যাটাস আপডেট করতে সমস্যা হচ্ছে। একটু পর আবার চেষ্টা করুন।",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setShowCancelWarning(false);
    setLoginModal({ isOpen: false, donorId: null });
    setLoginEmail("");
    setLoginOtp("");
    setOtpSent(false);
    setResendCooldown(0);

    setShowTurnstile(false);
    setTurnstileLoading(false);
    setRevealedPhone(null);
    setTurnstileKey((prev) => prev + 1);
  };

  return (
    <main className="max-w-screen-md mx-auto px-4 py-5 font-[Kalpurush] min-h-screen relative">

      {/* PC: Blood Bank center + Back button left side | Phone: Back button above left */}
      <div className="relative mt-1 mb-5">
        {/* Phone — Blood Bank-এর ঠিক উপরে বাম পাশে */}
        <div className="sm:hidden mb-2 flex justify-start">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-3.5 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all touch-manipulation"
            aria-label="পেছনে যান"
          >
            <span className="text-lg leading-none">←</span>
            <span>পেছনে যান</span>
          </button>
        </div>

        {/* PC — আগের মতো Blood Bank center, Back button বাম পাশে */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="hidden sm:inline-flex absolute left-0 top-0 z-10 items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all touch-manipulation"
          aria-label="পেছনে যান"
        >
          <span className="text-lg leading-none">←</span>
          <span>পেছনে যান</span>
        </button>

        <div className="text-center pt-1">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-3 flex items-center justify-center gap-2">
            <span>🩸</span> ব্লাড ব্যাংক
          </h1>
          <p className="text-gray-600 text-[17px]">
            জরুরি মুহূর্তে রক্তের সন্ধানে আমরা আছি আপনার পাশে।
          </p>
        </div>
      </div>

      {toast.show && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[200] px-6 py-3 rounded-lg shadow-lg text-white font-bold transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}


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
                    <span className="flex h-10 w-10 max-sm:h-9 max-sm:w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-lg">
                      🔎
                    </span>

                    <div className="relative flex-1 min-w-0">
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
                        placeholder="ডোনারের নাম / ID লিখুন..."
                        className="w-full h-12 max-sm:h-11 border border-gray-200 bg-white rounded-xl px-4 max-sm:px-3 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-gray-800 text-base max-sm:text-[13px] text-left shadow-sm transition-all min-w-0"
                        aria-label={`${selectedGroup} গ্রুপে ডোনার খুঁজুন`}
                      />
                    </div>

                    {searchTerm.trim() && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="shrink-0 h-11 w-11 max-sm:h-10 max-sm:w-10 flex items-center justify-center rounded-xl bg-gray-100 border-2 border-gray-300 text-gray-600 text-2xl max-sm:text-xl font-bold leading-none hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all shadow-sm touch-manipulation"
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
                      className="shrink-0 h-12 max-sm:h-11 min-w-[120px] max-sm:min-w-[72px] px-7 max-sm:px-3 rounded-xl bg-red-600 text-white font-bold text-base max-sm:text-sm hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all touch-manipulation whitespace-nowrap"
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
                                  <span
                                    className="relative inline-flex items-center justify-center w-5 h-5 shrink-0 cursor-pointer select-none"
                                    onMouseEnter={() => setHoveredVerificationId(`business-${donor.id}`)}
                                    onMouseLeave={() => {
                                      setHoveredVerificationId(null);
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showVerificationPopup(`business-${donor.id}`);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onBlur={() => closeVerificationPopup()}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        showVerificationPopup(`business-${donor.id}`);
                                      }
                                    }}
                                    aria-label="Business Verified"
                                  >
                                    <img
                                      src="/golden-verify.png"
                                      alt="Business Verified"
                                      className="w-5 h-5 object-contain pointer-events-none select-none"
                                    />

                                    {
                                      (hoveredVerificationId === `business-${donor.id}` ||
                                        clickedVerificationId === `business-${donor.id}`) && (
                                      <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-[180] w-max min-w-[180px] rounded-xl bg-gray-900/95 px-4 py-2.5 text-center shadow-lg border border-white/10 pointer-events-none transition-opacity duration-100">
                                        <span className="block text-sm leading-5 font-bold text-white">
                                          Business Verified
                                        </span>
                                      </span>
                                    )}
                                  </span>
                                ) : donor.verified === true ? (
                                  <span
                                    className="relative inline-flex items-center justify-center w-5 h-5 shrink-0 cursor-pointer select-none"
                                    onMouseEnter={() => setHoveredVerificationId(`verified-${donor.id}`)}
                                    onMouseLeave={() => {
                                      setHoveredVerificationId(null);
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showVerificationPopup(`verified-${donor.id}`);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onBlur={() => closeVerificationPopup()}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        showVerificationPopup(`verified-${donor.id}`);
                                      }
                                    }}
                                    aria-label="Verified Donor"
                                  >
                                    <img
                                      src="/check1.png"
                                      alt="Verified donor"
                                      className="w-5 h-5 object-contain pointer-events-none select-none"
                                    />

                                    {
                                      (hoveredVerificationId === `verified-${donor.id}` ||
                                        clickedVerificationId === `verified-${donor.id}`) && (
                                      <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-[180] w-max min-w-[195px] rounded-xl bg-gray-900/95 px-4 py-2.5 text-center shadow-lg border border-white/10 pointer-events-none transition-opacity duration-100">
                                        <span className="block text-sm leading-5 font-bold text-white">
                                          Verified Donor
                                        </span>
                                        <span className="block mt-0.5 text-xs leading-5 font-semibold text-gray-300">
                                          Since {donor.verifiedAt
                                            ? new Date(donor.verifiedAt).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                              })
                                            : "—"}
                                        </span>
                                      </span>
                                    )}
                                  </span>
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

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-[120] w-12 h-12 rounded-full bg-red-500/55 text-red-700 border border-red-200/60 backdrop-blur-md shadow-[0_8px_30px_rgba(239,68,68,0.22)] flex items-center justify-center text-xl font-bold hover:bg-red-500/70 hover:scale-105 active:scale-90 transition-all duration-200"
          aria-label="উপরে যান"
          title="উপরে যান"
        >
          ↑
        </button>
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
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="------" 
                  className="border-b-2 border-green-400 py-2 w-full mb-3 outline-none focus:border-green-600 text-center text-3xl tracking-[0.5em] font-bold bg-transparent transition-colors"
                  value={loginOtp}
                  onChange={e => setLoginOtp(e.target.value.replace(/\\D/g, "").slice(0, 6))}
                  maxLength={6}
                />

                <div className="mb-5">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isProcessing || resendCooldown > 0}
                    className={`w-full h-11 rounded-xl border font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                      resendCooldown > 0
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                        : "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 active:scale-[0.99]"
                    }`}
                  >
                    <span>↻</span>
                    <span>
                      {isProcessing
                        ? "পাঠানো হচ্ছে..."
                        : resendCooldown > 0
                          ? `আবার OTP পাঠান (${formatCooldown(resendCooldown)})`
                          : "আবার OTP পাঠান"}
                    </span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleVerifyAndUpdate} disabled={isProcessing} className="bg-green-600 text-white py-3 w-full rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all shadow-md">
                    {isProcessing ? 'ভেরিফাই হচ্ছে...' : 'আপডেট করুন'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelWarning(true)}
                    className="bg-gray-100 text-gray-800 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    বাতিল
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom OTP cancel warning modal */}
      {showCancelWarning && loginModal.isOpen && otpSent && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-warning-title"
          >
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 border border-amber-100 text-3xl">
                ⚠️
              </div>

              <h4 id="cancel-warning-title" className="text-xl font-bold text-gray-800">
                OTP ইতোমধ্যে পাঠানো হয়েছে
              </h4>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                আপনি কি এই প্রক্রিয়াটি বাতিল করতে চান?
                <br />
                OTP এখনো কার্যকর থাকবে।
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={() => setShowCancelWarning(false)}
                className="h-11 rounded-xl bg-gray-100 text-gray-800 font-bold text-sm border border-gray-200 hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                থাকুন
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="h-11 rounded-xl bg-red-600 text-white font-bold text-sm shadow-md hover:bg-red-700 active:scale-[0.98] transition-all"
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}