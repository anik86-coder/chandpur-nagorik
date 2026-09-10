"use client";

import { useState, useEffect } from "react";
import { db } from "../../../firebase"; 
import { collection, query, where, orderBy, limit, startAfter, getDocs, getCountFromServer, setDoc, updateDoc, doc, type DocumentSnapshot } from "firebase/firestore";

const checkAvailability = (lastDonationDate: string) => {
  if (!lastDonationDate) return true;
  const lastDate = new Date(lastDonationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 90;
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// [নোট]: টেস্ট করার জন্য লিমিট ২ করে দেওয়া হয়েছে, পরে আপনি এটি ১০০ করে দিতে পারেন
const DONORS_PER_PAGE = 25;

export default function BloodBankPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageCursors, setPageCursors] = useState<Record<string, DocumentSnapshot | null>>({});
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);

  const [detailsModal, setDetailsModal] = useState<any | null>(null);
  const [loginModal, setLoginModal] = useState({ isOpen: false, donorId: null as string | null });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);

  // [নতুন]: পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDonors, setTotalDonors] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [maxVisitedPage, setMaxVisitedPage] = useState(1);

  const [formData, setFormData] = useState({ 
    name: "", group: "A+", phone: "+88", dob: "", address: "", disease: "", allergy: "", email: "" 
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    setShowForm(false);
    setSelectedGroup(null);
    setDonors([]);
    setCurrentPage(1);
    setLoading(false);
    setIsPageLoading(false);
  }, []);

  const loadDonorPage = async (
    group: string,
    pageNumber: number,
    cursor: DocumentSnapshot | null = null
  ) => {
    // IMPORTANT: set loading BEFORE clearing/replacing donor data.
    // This prevents the "no donor" message from flashing during A+ ↔ A-
    // or any other group/page change.
    setIsPageLoading(true);
    setLoading(true);

    try {
      const donorsQuery = cursor
        ? query(
            collection(db, "donors"),
            where("group", "==", group),
            orderBy("createdAt", "desc"),
            startAfter(cursor),
            limit(DONORS_PER_PAGE + 1)
          )
        : query(
            collection(db, "donors"),
            where("group", "==", group),
            orderBy("createdAt", "desc"),
            limit(DONORS_PER_PAGE + 1)
          );

      const snapshot = await getDocs(donorsQuery);
      const docs = snapshot.docs;
      const pageDocs = docs.slice(0, DONORS_PER_PAGE);
      const nextPageExists = docs.length > DONORS_PER_PAGE;

      // Set the new page data before turning loading off.
      setDonors(pageDocs.map(d => ({ id: d.id, ...d.data() })));
      setHasNextPage(nextPageExists);
      setCurrentPage(pageNumber);
      setMaxVisitedPage(prev => Math.max(prev, pageNumber));

      if (pageDocs.length) {
        setPageCursors(prev => ({
          ...prev,
          [`${group}-${pageNumber + 1}`]: pageDocs[pageDocs.length - 1],
        }));
      }
    } catch (error) {
      console.error("ডোনার ডাটা লোড করতে সমস্যা হচ্ছে:", error);
      setDonors([]);
      setHasNextPage(false);
      showToast("ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    } finally {
      // Only now can the empty-state message be considered.
      setLoading(false);
      setIsPageLoading(false);
    }
  };

  const handleGroupSelect = async (bg: string) => {
    setShowForm(false);
    setSelectedGroup(bg);

    // Keep loading state active BEFORE donor list is cleared.
    // This guarantees shimmer appears immediately instead of empty-state text.
    setLoading(true);
    setIsPageLoading(true);
    setDonors([]);
    setCurrentPage(1);
    setMaxVisitedPage(1);
    setHasNextPage(false);
    setPageCursors({});
    setTotalDonors(0);
    setTotalPages(0);

    try {
      const countSnapshot = await getCountFromServer(
        query(collection(db, "donors"), where("group", "==", bg))
      );

      const count = countSnapshot.data().count;
      setTotalDonors(count);
      setTotalPages(Math.ceil(count / DONORS_PER_PAGE));

      await loadDonorPage(bg, 1, null);
    } catch (error) {
      console.error("গ্রুপের ডাটা লোড করতে সমস্যা হচ্ছে:", error);
      setDonors([]);
      setHasNextPage(false);
      setTotalDonors(0);
      setTotalPages(0);
      setLoading(false);
      setIsPageLoading(false);
      showToast("ডাটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "error");
    }
  };

  const handleOpenForm = () => {
    setShowForm(true); setSelectedGroup(null); setDonors([]);
  };

  const handleCloseForm = () => {
    setShowForm(false); setSelectedGroup(null);
  };

  const handlePageChange = (pageNumber: number) => {
    if (!selectedGroup || pageNumber < 1 || isPageLoading) return;

    const cursor =
      pageNumber === 1
        ? null
        : pageCursors[`${selectedGroup}-${pageNumber}`] ?? null;

    // With cursor pagination, only pages whose cursor is known are clickable.
    if (pageNumber > currentPage && (!hasNextPage || !cursor)) return;
    if (pageNumber < currentPage && pageNumber > 1 && !cursor) return;

    // Turn loading on before changing the visible donor data.
    setIsPageLoading(true);
    setLoading(true);

    loadDonorPage(selectedGroup, pageNumber, cursor);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const currentDonors = donors;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val.startsWith("+88")) {
      setFormData({ ...formData, phone: "+88" });
      return;
    }
    const onlyDigits = val.substring(3).replace(/\D/g, ""); 
    setFormData({ ...formData, phone: "+88" + onlyDigits });
  };

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.dob || !formData.address.trim() || !formData.email.trim()) {
      showToast("অনুগ্রহ করে নাম, জন্মতারিখ, ঠিকানা এবং ইমেইল পূরণ করুন!", "error");
      return;
    }

    if (formData.phone.length !== 14) {
      showToast("অনুগ্রহ করে সঠিক ১১-ডিজিটের মোবাইল নম্বর দিন!", "error");
      return;
    }

    const trimmedEmail = formData.email.trim().toLowerCase();
    try {
      const emailSnapshot = await getDocs(query(collection(db, "donors"), where("email", "==", trimmedEmail), limit(1)));
      if (!emailSnapshot.empty) {
        showToast("এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট খোলা আছে!", "error");
        return;
      }
      const donorDataToSave = {
        name: formData.name,
        group: formData.group,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        disease: formData.disease,
        allergy: formData.allergy,
        email: trimmedEmail, 
        lastDonation: "", 
        createdAt: new Date().toISOString()
      };

      const uniqueId = `${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
      await setDoc(doc(db, "donors", uniqueId), donorDataToSave);
      setFormData({ name: "", group: "A+", phone: "+88", dob: "", address: "", disease: "", allergy: "", email: "" });
      setShowForm(false);
      setSelectedGroup(formData.group);
      setDonors([]);
      setCurrentPage(1);
      setMaxVisitedPage(1);
      setHasNextPage(false);
      setPageCursors({});
      setLoading(true);
      setIsPageLoading(true);

      const countSnapshot = await getCountFromServer(
        query(collection(db, "donors"), where("group", "==", formData.group))
      );
      const count = countSnapshot.data().count;
      setTotalDonors(count);
      setTotalPages(Math.ceil(count / DONORS_PER_PAGE));

      await loadDonorPage(formData.group, 1, null);
      showToast("সফলভাবে নিবন্ধন সম্পন্ন হয়েছে!");

    } catch (error: any) {
      console.error("রেজিস্ট্রেশন এরর:", error);
      showToast("নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন。", "error");
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

    setIsProcessing(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim().toLowerCase(), otp: loginOtp })
      });

      const data = await res.json();

      if (res.ok) {
        if (loginModal.donorId) {
          const todayStr = new Date().toISOString().split('T')[0];
          const donorRef = doc(db, "donors", loginModal.donorId);
          
          await updateDoc(donorRef, { lastDonation: todayStr });
          setRevealedPhone(null);
          showToast("ধন্যবাদ! আপনার রক্ত দেওয়ার তথ্য সফলভাবে আপডেট করা হয়েছে।");
        }
        closeModal();
      } else {
        showToast(data.message || "ভুল OTP দেওয়া হয়েছে বা মেয়াদ শেষ।", "error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showToast("ভেরিফাই করতে সমস্যা হচ্ছে。", "error");
    }
    setIsProcessing(false);
  };

  const closeModal = () => {
    setLoginModal({ isOpen: false, donorId: null });
    setLoginEmail("");
    setLoginOtp("");
    setOtpSent(false);
  };

  return (
    <main className="max-w-screen-md mx-auto px-4 py-8 font-[Kalpurush] min-h-screen relative">
      
      {toast.show && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[200] px-6 py-3 rounded-lg shadow-lg text-white font-bold transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="text-center mb-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-3 flex items-center justify-center gap-2">
          <span>🩸</span> ব্লাড ব্যাংক
        </h1>
        <p className="text-gray-600 text-[17px]">জরুরি মুহূর্তে রক্তের সন্ধানে আমরা আছি আপনার পাশে।</p>
      </div>

      {!showForm ? (
        <>
          <div className="grid grid-cols-4 gap-3 mb-8">
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

          <div className="text-center mt-6 mb-10 border-b border-gray-200 pb-8">
             <button 
              onClick={handleOpenForm}
              className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition shadow-lg w-full md:w-auto"
            >
              আমি রক্ত দিতে চাই 🩸
            </button>
            <p className="text-gray-500 text-sm mt-3">আপনি চাইলে নিজে রক্তদাতা হিসেবে যুক্ত হতে পারেন</p>
          </div>

          {selectedGroup && (
            <div>
              <div className="flex justify-between items-center mb-5 border-l-4 border-red-600 pl-3 bg-gray-50 py-2.5 pr-4 rounded-r-lg shadow-sm border-y border-r border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedGroup} রক্তের ডোনার তালিকা
                </h3>
                <span className="bg-white border border-gray-200 text-gray-700 text-sm font-bold px-3 py-1 rounded-md shadow-sm">
                  দেখানো: <span className="text-red-600">{currentDonors.length}</span> জন{hasNextPage ? " +" : ""}
                </span>
              </div>
              
              {loading || isPageLoading ? (
                <div className="space-y-4" aria-label="ডোনার লোড হচ্ছে">
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
                  {/* Pagination — only above donor list */}
                  {(totalPages > 1 || totalDonors > 0) && (
                    <div className="flex flex-col items-center mb-6 bg-gray-50 py-4 px-3 rounded-xl border border-gray-200 shadow-sm">
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

                  <div className="space-y-4">
                    {currentDonors.map(donor => {
                      const isAvailable = checkAvailability(donor.lastDonation);

                      return (
                        <div key={donor.id} className={`p-5 rounded-lg border ${isAvailable ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50 opacity-75'} hover:shadow-md transition-shadow`}>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-bold text-xl text-gray-900">{donor.name}</h4>

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
                </>
              ) : (
                <p className="text-center py-10 text-gray-500 bg-gray-50 rounded border border-dashed">
                  এই গ্রুপের কোনো ডোনার আপাতত নেই। আপনি প্রথম হতে পারেন!
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b-2 border-red-100 pb-3">রক্তদাতা নিবন্ধন ফর্ম</h2>
          
          <div className="grid gap-6">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">আপনার পুরো নাম *</label>
              <input type="text" placeholder="যেমন: মো. সাঈদুর রহমান" className="w-full border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">রক্তের গ্রুপ *</label>
                <select className="w-full border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg cursor-pointer" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})}>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">মোবাইল নম্বর *</label>
                <input type="tel" className="w-full border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg tracking-wider" value={formData.phone} onChange={handlePhoneChange} maxLength={14} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">জন্মতারিখ *</label>
                <input type="date" className="w-full border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg cursor-pointer" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">বর্তমান ঠিকানা *</label>
                <input type="text" placeholder="যেমন: হাজীগঞ্জ, চাঁদপুর" className="w-full border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">কোনো রোগ বা অ্যালার্জি আছে কি? (ঐচ্ছিক)</label>
              <input type="text" placeholder="না থাকলে ফাঁকা রাখুন" className="w-full border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} />
            </div>
            
            <div className="bg-red-50 p-4 rounded-xl mt-4 border border-red-100">
              <label className="text-xs text-red-600 font-bold uppercase tracking-wider">আপনার ইমেইল এড্রেস *</label>
              <p className="text-xs text-gray-500 mb-2 mt-1">ভবিষ্যতে প্রোফাইল আপডেট করার জন্য সঠিক ইমেইল দিন (এখানেই OTP যাবে):</p>
              <input type="email" placeholder="example@gmail.com" className="w-full border-b-2 border-red-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button 
                onClick={handleRegister}
                className="bg-red-600 text-white py-3 px-6 rounded-lg w-full font-bold hover:bg-red-700 shadow-md transition-all text-lg"
              >
                নিবন্ধন সম্পন্ন করুন
              </button>
              <button onClick={handleCloseForm} className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg w-full md:w-auto font-bold hover:bg-gray-200 transition-all text-lg">বাতিল</button>
            </div>
          </div>
        </div>
      )}

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
              
              {revealedPhone === detailsModal.id ? (
                <div className="flex flex-col items-center gap-4">
                  <a href={`tel:${detailsModal.phone}`} className="text-2xl font-bold text-[#116cb4] tracking-widest bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 w-full">{detailsModal.phone}</a>
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
              ) : (
                <button onClick={() => setRevealedPhone(detailsModal.id)} className="bg-[#116cb4] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 w-full transition-all shadow-md">
                  মোবাইল নম্বর দেখুন
                </button>
              )}
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