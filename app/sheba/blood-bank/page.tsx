"use client";

import { useState, useEffect } from "react";
import { db } from "../../../firebase"; 
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const checkAvailability = (lastDonationDate: string) => {
  if (!lastDonationDate) return true;
  const lastDate = new Date(lastDonationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 90;
};

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function BloodBankPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);

  // লগিন/OTP মডালের স্টেট
  const [loginModal, setLoginModal] = useState({ isOpen: false, donorId: null as string | null });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false); // OTP পাঠানো হয়েছে কি না তা ট্র্যাক করার জন্য
  const [isProcessing, setIsProcessing] = useState(false); // লোডিং বোঝানোর জন্য
  
  const [loading, setLoading] = useState(true);

  // নতুন ডোনার ফর্ম স্টেট (পাসওয়ার্ড বাদ দেওয়া হয়েছে)
  const [formData, setFormData] = useState({ 
    name: "", group: "A+", phone: "", address: "", disease: "", allergy: "", email: "" 
  });

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "donors"));
        const donorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDonors(donorsList);
        setLoading(false);
      } catch (error) {
        console.error("ডাটা লোড করতে সমস্যা হচ্ছে: ", error);
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const filteredDonors = donors.filter(d => d.group === selectedGroup);

  // ১. নতুন ডোনার রেজিস্ট্রেশন ফাংশন (শুধু ডাটাবেসে সেভ হবে)
  const handleRegister = async () => {
    if (!formData.email || !formData.name || !formData.phone) {
      alert("অনুগ্রহ করে নাম, মোবাইল নম্বর এবং ইমেইল পূরণ করুন!");
      return;
    }

    try {
      const donorDataToSave = {
        name: formData.name,
        group: formData.group,
        phone: formData.phone,
        address: formData.address,
        disease: formData.disease,
        allergy: formData.allergy,
        email: formData.email, 
        lastDonation: "", 
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "donors"), donorDataToSave);
      
      setDonors([{ id: docRef.id, ...donorDataToSave }, ...donors]);
      setShowForm(false);
      setSelectedGroup(formData.group);
      
      // ফর্ম রিসেট
      setFormData({ name: "", group: "A+", phone: "", address: "", disease: "", allergy: "", email: "" });
      alert("সফলভাবে নিবন্ধন সম্পন্ন হয়েছে!");

    } catch (error: any) {
      console.error("রেজিস্ট্রেশন এরর:", error);
      alert("নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  // ২. ইমেইলে OTP পাঠানোর ফাংশন
  const handleSendOtp = async () => {
    if (!loginEmail) {
      alert("অনুগ্রহ করে আপনার ইমেইল এড্রেস দিন।");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail })
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        alert("আপনার ইমেইলে একটি ৬-ডিজিটের OTP পাঠানো হয়েছে!");
      } else {
        alert(data.message || "OTP পাঠাতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("সার্ভারে সমস্যা হচ্ছে। একটু পর আবার চেষ্টা করুন।");
    }
    setIsProcessing(false);
  };

  // ৩. OTP ভেরিফাই করে স্ট্যাটাস আপডেট করার ফাংশন
  const handleVerifyAndUpdate = async () => {
    if (!loginOtp) {
      alert("অনুগ্রহ করে ইমেইলে আসা OTP কোডটি দিন।");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, otp: loginOtp })
      });

      const data = await res.json();

      if (res.ok) {
        // OTP সঠিক হলে ফায়ারবেসে স্ট্যাটাস আপডেট করা হবে
        if (loginModal.donorId) {
          const todayStr = new Date().toISOString().split('T')[0];
          const donorRef = doc(db, "donors", loginModal.donorId);
          
          await updateDoc(donorRef, { lastDonation: todayStr });
          
          setDonors(donors.map(d => d.id === loginModal.donorId ? { ...d, lastDonation: todayStr } : d));
          setRevealedPhone(null);
          alert("ধন্যবাদ! আপনার রক্ত দেওয়ার তথ্য সফলভাবে আপডেট করা হয়েছে।");
        }

        // মডাল ও স্টেট রিসেট করা
        closeModal();
      } else {
        alert(data.message || "ভুল OTP দেওয়া হয়েছে বা মেয়াদ শেষ।");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("ভেরিফাই করতে সমস্যা হচ্ছে।");
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
    <main className="max-w-screen-md mx-auto px-4 py-8 font-[Kalpurush] min-h-screen">
      
      {/* হেডার অংশ */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-3 flex items-center justify-center gap-2">
          <span>🩸</span> রক্তদাতা সংগঠন
        </h1>
        <p className="text-gray-600 text-[17px] mb-6">জরুরি মুহূর্তে রক্তের সন্ধানে আমরা আছি আপনার পাশে।</p>
        
        <button 
          onClick={() => { setShowForm(true); setSelectedGroup(null); }}
          className="bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold text-lg hover:bg-red-700 transition shadow-md"
        >
          আমি রক্ত দিতে চাই 🩸
        </button>
      </div>

      {/* রক্ত দিতে চাই ফর্ম */}
      {showForm ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">রক্তদাতা নিবন্ধন ফর্ম</h2>
          <div className="grid gap-4">
            <input type="text" placeholder="আপনার পুরো নাম" className="border p-2.5 rounded w-full outline-none focus:border-red-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <select className="border p-2.5 rounded w-full outline-none focus:border-red-500" value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})}>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <input type="text" placeholder="মোবাইল নম্বর (যোগাযোগের জন্য)" className="border p-2.5 rounded w-full outline-none focus:border-red-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <input type="text" placeholder="ঠিকানা (যেমন: হাজীগঞ্জ, চাঁদপুর)" className="border p-2.5 rounded w-full outline-none focus:border-red-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <input type="text" placeholder="কোনো গোপন রোগ আছে কি? (না থাকলে ফাঁকা রাখুন)" className="border p-2.5 rounded w-full outline-none focus:border-red-500" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} />
            <input type="text" placeholder="অ্যালার্জি বা অন্য সমস্যা? (না থাকলে ফাঁকা রাখুন)" className="border p-2.5 rounded w-full outline-none focus:border-red-500" value={formData.allergy} onChange={e => setFormData({...formData, allergy: e.target.value})} />
            
            {/* ইমেইল ফিল্ড (পাসওয়ার্ড রিমুভ করা হয়েছে) */}
            <div className="border-t mt-2 pt-4">
              <p className="text-sm text-gray-500 mb-3">ভবিষ্যতে আপনার প্রোফাইল আপডেট করার জন্য নিচে আপনার সঠিক ইমেইলটি দিন (এখানেই OTP যাবে):</p>
              <input type="email" placeholder="আপনার ইমেইল এড্রেস" className="border p-2.5 rounded w-full outline-none focus:border-red-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="flex gap-4 mt-4">
              <button 
                onClick={handleRegister}
                className="bg-red-600 text-white py-2.5 rounded w-full font-bold hover:bg-red-700"
              >
                সাবমিট করুন
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-800 py-2.5 rounded w-full font-bold hover:bg-gray-400">বাতিল</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3 mb-8">
            {bloodGroups.map(bg => (
              <button 
                key={bg} 
                onClick={() => setSelectedGroup(bg)}
                className={`py-3 rounded-lg font-bold text-xl transition-all border ${selectedGroup === bg ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
              >
                {bg}
              </button>
            ))}
          </div>

          {selectedGroup && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-l-4 border-red-600 pl-3">
                {selectedGroup} রক্তের ডোনার তালিকা
              </h3>
              
              {loading ? (
                <p className="text-center py-10 text-gray-500">ডাটা লোড হচ্ছে...</p>
              ) : filteredDonors.length > 0 ? (
                <div className="space-y-4">
                  {filteredDonors.map(donor => {
                    const isAvailable = checkAvailability(donor.lastDonation);
                    
                    return (
                      <div key={donor.id} className={`p-4 rounded-lg border ${isAvailable ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-gray-50 opacity-75'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg text-gray-900">{donor.name}</h4>
                            <p className="text-sm text-gray-600">{donor.address}</p>
                            
                            <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-bold rounded ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isAvailable ? '✅ রক্ত দিতে প্রস্তুত' : '⏳ এখন রক্ত দিতে পারবেন না'}
                            </span>
                          </div>

                          <div className="text-right">
                            {isAvailable ? (
                              revealedPhone === donor.id ? (
                                <div className="flex flex-col items-end">
                                  <a href={`tel:${donor.phone}`} className="text-[#116cb4] font-bold text-lg mb-2">{donor.phone}</a>
                                  <button 
                                    onClick={() => setLoginModal({ isOpen: true, donorId: donor.id })}
                                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
                                  >
                                    আমি রক্ত দিয়েছি
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => setRevealedPhone(donor.id)} className="bg-[#116cb4] text-white text-sm px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
                                  যোগাযোগ করুন
                                </button>
                              )
                            ) : (
                              <p className="text-gray-400 font-bold mt-2">01***-******</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500 bg-gray-50 rounded border border-dashed">এই গ্রুপের কোনো ডোনার আপাতত নেই। আপনি প্রথম হতে পারেন!</p>
              )}
            </div>
          )}
        </>
      )}

      {/* স্ট্যাটাস আপডেটের জন্য OTP মডাল */}
      {loginModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] px-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center shadow-xl">
            <h3 className="text-xl font-bold mb-2">স্ট্যাটাস আপডেট করুন</h3>
            
            {!otpSent ? (
              <>
                <p className="text-sm text-gray-600 mb-4">রক্ত দেওয়ার স্ট্যাটাস আপডেট করতে আপনার নিবন্ধিত ইমেইলটি দিন। সেখানে একটি কোড পাঠানো হবে।</p>
                <input 
                  type="email" 
                  placeholder="আপনার ইমেইল এড্রেস" 
                  className="border-2 border-gray-300 p-2.5 rounded w-full mb-4 outline-none focus:border-red-500 text-left"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
                <div className="flex gap-3">
                  <button onClick={handleSendOtp} disabled={isProcessing} className="bg-blue-600 text-white py-2 w-full rounded font-bold hover:bg-blue-700 disabled:opacity-50">
                    {isProcessing ? 'পাঠানো হচ্ছে...' : 'OTP পাঠান'}
                  </button>
                  <button onClick={closeModal} className="bg-gray-200 text-gray-800 py-2 w-full rounded font-bold hover:bg-gray-300">বাতিল</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-green-600 mb-4 font-semibold">আপনার ইমেইলে একটি ৬-ডিজিটের কোড পাঠানো হয়েছে।</p>
                <input 
                  type="text" 
                  placeholder="৬-ডিজিটের OTP কোড" 
                  className="border-2 border-green-300 p-2.5 rounded w-full mb-4 outline-none focus:border-green-500 text-center text-xl tracking-[0.3em] font-bold"
                  value={loginOtp}
                  onChange={e => setLoginOtp(e.target.value)}
                  maxLength={6}
                />
                <div className="flex gap-3">
                  <button onClick={handleVerifyAndUpdate} disabled={isProcessing} className="bg-green-600 text-white py-2 w-full rounded font-bold hover:bg-green-700 disabled:opacity-50">
                    {isProcessing ? 'ভেরিফাই হচ্ছে...' : 'ভেরিফাই ও আপডেট'}
                  </button>
                  <button onClick={closeModal} className="bg-gray-200 text-gray-800 py-2 w-full rounded font-bold hover:bg-gray-300">বাতিল</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </main>
  );
}