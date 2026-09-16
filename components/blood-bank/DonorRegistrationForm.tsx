"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

type FormErrors = {
  name?: string;
  phone?: string;
  dob?: string;
  address?: string;
  email?: string;
  consent?: string;
  captcha?: string;
};

export default function DonorRegistrationForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    group: "A+",
    phone: "+880",
    dob: "",
    address: "",
    disease: "",
    allergy: "",
    email: "",
  });

  const [voluntaryConsent, setVoluntaryConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);

  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [showCancelWarning, setShowCancelWarning] = useState(false);

  const generateCaptcha = () => {
    setCaptchaA(Math.floor(Math.random() * 8) + 2);
    setCaptchaB(Math.floor(Math.random() * 8) + 1);
    setCaptchaAnswer("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateName = (name: string) => {
    const clean = name.trim();

    if (!clean) return "আপনার পুরো নাম লিখুন।";
    if (clean.length < 3) return "সঠিক পূর্ণ নাম লিখুন।";
    if (clean.length > 80) return "নাম সর্বোচ্চ ৮০ অক্ষরের মধ্যে দিন।";

    // নামের মধ্যে সংখ্যা/অস্বাভাবিক symbol আটকানো
    if (/[0-9]/.test(clean)) {
      return "নামে কোনো সংখ্যা দেওয়া যাবে না।";
    }

    return "";
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value;

    // +88 সবসময় থাকবে
    if (!value.startsWith("+88")) {
      value = "+88";
    }

    let digits = value
      .substring(3)
      .replace(/\D/g, "");

    // বাংলাদেশি নম্বর অবশ্যই 01 দিয়ে শুরু হবে
    if (digits.length >= 1 && digits[0] !== "0") {
      setErrors((prev) => ({
        ...prev,
        phone: "মোবাইল নম্বর অবশ্যই 01 দিয়ে শুরু হতে হবে।",
      }));
    } else if (
      digits.length >= 2 &&
      digits.substring(0, 2) !== "01"
    ) {
      setErrors((prev) => ({
        ...prev,
        phone: "মোবাইল নম্বর অবশ্যই 01 দিয়ে শুরু হতে হবে।",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        phone: undefined,
      }));
    }

    digits = digits.slice(0, 11);

    updateField("phone", "+88" + digits);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob + "T00:00:00");
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDobChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const dob = e.target.value;

    updateField("dob", dob);

    if (!dob) return;

    const age = calculateAge(dob);

    if (age < 18) {
      setErrors((prev) => ({
        ...prev,
        dob: "রক্তদাতা হিসেবে নিবন্ধনের জন্য বয়স কমপক্ষে ১৮ বছর হতে হবে।",
      }));
    }
  };

  const validateEmail = (email: string) => {
    const clean = email.trim().toLowerCase();

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!clean) return "ইমেইল এড্রেস দিন।";

    if (!emailRegex.test(clean)) {
      return "সঠিক ইমেইল দিন, যেমন example@gmail.com";
    }

    const domain = clean.split("@")[1] || "";

    if (!domain.includes(".") || domain.endsWith(".")) {
      return "সঠিক ইমেইল ডোমেইন দিন।";
    }

    return "";
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);

    if (nameError) {
      newErrors.name = nameError;
    }

    if (!formData.group) {
      newErrors.name = "রক্তের গ্রুপ নির্বাচন করুন।";
    }

    const phoneDigits = formData.phone.substring(3);

    if (!phoneDigits) {
      newErrors.phone = "মোবাইল নম্বর দিন।";
    } else if (!/^01\d{9}$/.test(phoneDigits)) {
      newErrors.phone =
        "মোবাইল নম্বর অবশ্যই 01 দিয়ে শুরু হওয়া ১১ ডিজিটের হতে হবে।";
    }

    if (!formData.dob) {
      newErrors.dob = "জন্মতারিখ দিন।";
    } else {
      const birthDate = new Date(
        formData.dob + "T00:00:00"
      );

      const today = new Date();

      if (birthDate > today) {
        newErrors.dob =
          "ভবিষ্যতের জন্মতারিখ দেওয়া যাবে না।";
      } else if (calculateAge(formData.dob) < 18) {
        newErrors.dob =
          "রক্তদাতা হিসেবে নিবন্ধনের জন্য বয়স কমপক্ষে ১৮ বছর হতে হবে।";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "বর্তমান ঠিকানা লিখুন।";
    } else if (formData.address.trim().length < 4) {
      newErrors.address = "সঠিক বর্তমান ঠিকানা লিখুন।";
    }

    const emailError = validateEmail(formData.email);

    if (emailError) {
      newErrors.email = emailError;
    }

    if (!voluntaryConsent || !termsConsent) {
      newErrors.consent =
        "নিবন্ধন করতে উভয় সম্মতিতে টিক দিতে হবে।";
    }

    if (!captchaAnswer.trim()) {
      newErrors.captcha = "ক্যাপচা উত্তর দিন।";
    } else if (
      Number(captchaAnswer) !== captchaA + captchaB
    ) {
      newErrors.captcha = "ক্যাপচা উত্তর সঠিক হয়নি।";
    }

    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstError = Object.keys(validationErrors)[0];

      const element = document.getElementById(firstError);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    setErrors({});
    setIsProcessing(true);

    try {
      const trimmedEmail = formData.email
        .trim()
        .toLowerCase();

      /*
       * IMPORTANT:
       *
       * Public user pending request collection পড়তে পারবে না।
       * তাই এখানে bloodDonorRequests থেকে duplicate check করা হচ্ছে না।
       *
       * শুধু approved/public donors collection থেকে email duplicate check করা হচ্ছে।
       */
      const emailSnapshot = await getDocs(
        query(
          collection(db, "donors"),
          where("email", "==", trimmedEmail),
          limit(1)
        )
      );

      if (!emailSnapshot.empty) {
        setErrors({
          email:
            "এই ইমেইল দিয়ে আগে থেকেই একজন ডোনার নিবন্ধিত আছেন।",
        });

        setIsProcessing(false);
        return;
      }

      // Unique 8-digit donor ID
      let donorId = "";

      while (!donorId) {
        const candidate = String(
          Math.floor(10000000 + Math.random() * 90000000)
        );

        const existingId = await getDoc(
          doc(db, "donors", candidate)
        );

        if (!existingId.exists()) {
          donorId = candidate;
        }
      }

      /*
       * IMPORTANT:
       *
       * Public donor list-এ সরাসরি যোগ না করে
       * আগে admin approval-এর জন্য pending request হিসেবে রাখা হচ্ছে।
       */
      await setDoc(
        doc(db, "bloodDonorRequests", donorId),
        {
          name: formData.name.trim(),
          group: formData.group,
          phone: formData.phone,
          dob: formData.dob,
          address: formData.address.trim(),
          disease: formData.disease.trim(),
          allergy: formData.allergy.trim(),
          email: trimmedEmail,
          lastDonation: "",
          status: "pending",
          createdAt: new Date().toISOString(),
        }
      );

      setSuccessId(donorId);
    } catch (error) {
      console.error(
        "রেজিস্ট্রেশন এরর:",
        error
      );

      setErrors({
        captcha:
          "নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ==============================
  // Success Screen
  // ==============================

  if (successId) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-lg max-w-2xl mx-auto font-[Kalpurush]">
        <div className="text-center">

          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-4">
            ✓
          </div>

          <h2 className="text-2xl font-bold text-green-700 mb-2">
            আবেদন সফলভাবে জমা হয়েছে
          </h2>

          <p className="text-gray-600 text-sm mb-6">
            আপনার রক্তদাতা নিবন্ধনটি Admin approval-এর অপেক্ষায় আছে।
            অনুমোদনের পর আপনাকে Blood Bank তালিকায় যুক্ত করা হবে।
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
            <p className="text-sm text-gray-500 mb-1">
              আপনার Donor ID
            </p>

            <p className="text-2xl font-bold font-mono tracking-wider text-green-700 break-all">
              {successId}
            </p>

            <p className="text-xs text-gray-500 mt-3">
              ভবিষ্যতে তথ্য আপডেট বা যোগাযোগের প্রয়োজনে এই ID সংরক্ষণ করুন।
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/sheba/blood-bank")
            }
            className="bg-red-600 text-white px-7 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            ব্লাড ব্যাংকে ফিরে যান
          </button>

        </div>
      </div>
    );
  }

  const errorText = (field: keyof FormErrors) =>
    errors[field] ? (
      <p className="text-red-600 text-xs font-semibold mt-1.5">
        ⚠ {errors[field]}
      </p>
    ) : null;

  return (
    <div className="font-[Kalpurush] w-full max-w-full min-w-0 overflow-x-hidden">

      {/* Form Box */}
      <div className="bg-white w-full max-w-2xl min-w-0 box-border p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-lg mb-8 mx-auto overflow-hidden">

        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b-2 border-red-100 pb-3 text-center">
          রক্তদাতা নিবন্ধন ফর্ম
        </h2>

        <div className="grid gap-6 w-full max-w-full min-w-0">

          {/* Name */}
          <div id="name">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              আপনার পুরো নাম *
            </label>

            <input
              type="text"
              placeholder="যেমন: মো. সাঈদুর রহমান"
              value={formData.name}
              onChange={(e) =>
                updateField(
                  "name",
                  e.target.value
                )
              }
              className={`block w-full max-w-full min-w-0 box-border border-b-2 ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-200"
              } py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg`}
            />

            {errorText("name")}
          </div>

          {/* Blood Group + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full max-w-full min-w-0">

            <div>
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                রক্তের গ্রুপ *
              </label>

              <select
                value={formData.group}
                onChange={(e) =>
                  updateField(
                    "group",
                    e.target.value
                  )
                }
                className="block w-full max-w-full min-w-0 box-border border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg cursor-pointer"
              >
                {bloodGroups.map((bg) => (
                  <option
                    key={bg}
                    value={bg}
                  >
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div id="phone">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                মোবাইল নম্বর *
              </label>

              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={14}
                placeholder="+8801XXXXXXXXX"
                className={`block w-full max-w-full min-w-0 box-border border-b-2 ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg tracking-wider`}
              />

              {errorText("phone")}
            </div>

          </div>

          {/* DOB + Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full max-w-full min-w-0">

            <div id="dob">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                জন্মতারিখ *
              </label>

              <input
                type="date"
                value={formData.dob}
                onChange={handleDobChange}
                className={`block w-full max-w-full min-w-0 box-border border-b-2 ${
                  errors.dob
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg cursor-pointer`}
              />

              {errorText("dob")}
            </div>

            <div id="address">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                বর্তমান ঠিকানা *
              </label>

              <input
                type="text"
                placeholder="যেমন: হাজীগঞ্জ, চাঁদপুর"
                value={formData.address}
                onChange={(e) =>
                  updateField(
                    "address",
                    e.target.value
                  )
                }
                className={`block w-full max-w-full min-w-0 box-border border-b-2 ${
                  errors.address
                    ? "border-red-500"
                    : "border-gray-200"
                } py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg`}
              />

              {errorText("address")}
            </div>

          </div>

          {/* Disease / Allergy */}
          <div>
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              কোনো রোগ অথবা অ্যালার্জি আছে কি?{" "}
              <span className="text-gray-400">
                (ঐচ্ছিক)
              </span>
            </label>

            <input
              type="text"
              placeholder="থাকলে রোগ বা অ্যালার্জির নাম লিখুন"
              value={
                formData.disease ||
                formData.allergy
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  disease: e.target.value,
                  allergy: "",
                })
              }
              className="block w-full max-w-full min-w-0 box-border border-b-2 border-gray-200 py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg"
            />
          </div>

          {/* Email */}
          <div
            id="email"
            className="bg-red-50 p-4 rounded-xl mt-2 border border-red-100"
          >
            <label className="text-xs text-red-600 font-bold uppercase tracking-wider">
              আপনার ইমেইল এড্রেস *
            </label>

            <p className="text-sm text-gray-600 mb-3 mt-1 font-semibold">
              ভবিষ্যতে প্রোফাইল আপডেট করার জন্য সঠিক ইমেইল দিন।
            </p>

            <input
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                updateField(
                  "email",
                  e.target.value
                )
              }
              className={`block w-full max-w-full min-w-0 box-border border-b-2 ${
                errors.email
                  ? "border-red-500"
                  : "border-red-200"
              } py-2 outline-none focus:border-red-600 transition-colors bg-transparent text-gray-800 text-lg`}
            />

            {errorText("email")}
          </div>

          {/* Consent */}
          <div
            id="consent"
            className="border-t border-gray-200 pt-5 mt-1 space-y-3"
          >

            <label className="flex items-start gap-3 w-full max-w-full min-w-0 cursor-pointer">
              <input
                type="checkbox"
                checked={voluntaryConsent}
                onChange={(e) => {
                  setVoluntaryConsent(
                    e.target.checked
                  );

                  setErrors((prev) => ({
                    ...prev,
                    consent: undefined,
                  }));
                }}
                className="mt-1 w-4 h-4 accent-red-600 cursor-pointer flex-shrink-0"
              />

              <span className="min-w-0 flex-1 max-w-full text-sm text-gray-600 leading-6 break-words overflow-wrap-anywhere">
                আমি স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন করছি এবং
                প্রয়োজনের সময়ে রক্তদানে সম্মত আছি।
              </span>
            </label>

            <label className="flex items-start gap-3 w-full max-w-full min-w-0 cursor-pointer">
              <input
                type="checkbox"
                checked={termsConsent}
                onChange={(e) => {
                  setTermsConsent(
                    e.target.checked
                  );

                  setErrors((prev) => ({
                    ...prev,
                    consent: undefined,
                  }));
                }}
                className="mt-1 w-4 h-4 accent-red-600 cursor-pointer flex-shrink-0"
              />

              <span className="min-w-0 flex-1 max-w-full text-sm text-gray-600 leading-6 break-words overflow-wrap-anywhere">
                আমি{" "}
                <a
                  href="/sheba/blood-bank/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 font-bold hover:underline"
                >
                  Terms & Conditions
                </a>{" "}
                পড়েছি এবং এতে সম্মত।
              </span>
            </label>

            {errorText("consent")}
          </div>

          {/* CAPTCHA */}
          <div
            id="captcha"
            className="bg-gray-50 border border-gray-200 rounded-xl p-4"
          >

            <div className="flex items-center justify-between gap-2 w-full min-w-0 mb-3">
              <label className="text-xs text-gray-600 font-bold uppercase tracking-wider">
                নিরাপত্তা যাচাই *
              </label>

              <button
                type="button"
                onClick={generateCaptcha}
                className="shrink-0 text-xs text-red-600 font-bold hover:underline mr-1 whitespace-nowrap"
              >
                নতুন ক্যাপচা
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full max-w-full min-w-0">

              <div className="shrink-0 max-w-full bg-white border border-gray-200 rounded-lg px-4 py-2 font-bold text-lg text-gray-800 whitespace-nowrap">
                {captchaA} + {captchaB} = ?
              </div>

              <input
                type="text"
                inputMode="numeric"
                value={captchaAnswer}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 2);

                  setCaptchaAnswer(value);

                  setErrors((prev) => ({
                    ...prev,
                    captcha: undefined,
                  }));
                }}
                placeholder="উত্তর"
                className="flex-1 min-w-[0] max-w-full border-b-2 border-gray-300 py-2 px-2 outline-none focus:border-red-600 bg-transparent text-gray-800 text-lg"
              />

            </div>

            {errorText("captcha")}
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-2">

            <button
              onClick={handleRegister}
              disabled={isProcessing}
              className="bg-red-600 text-white py-3 px-6 rounded-lg w-full font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all text-lg flex items-center justify-center gap-3"
            >

              {isProcessing ? (
                <>
                  <span
                    className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"
                    aria-hidden="true"
                  />

                  <span>
                    নিবন্ধন হচ্ছে...
                  </span>
                </>
              ) : (
                "নিবন্ধন সম্পন্ন করুন"
              )}

            </button>

            <button
              type="button"
              onClick={() => setShowCancelWarning(true)}
              className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg w-full md:w-auto font-bold hover:bg-gray-200 transition-all text-lg"
            >
              বাতিল
            </button>

          </div>

        </div>
      </div>

      {/* ================= CANCEL WARNING ================= */}
      {showCancelWarning && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          {/* No blur — only a simple dark overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCancelWarning(false)}
          />

          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl">
              ⚠️
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              আপনি কি বাতিল করতে চান?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              বাতিল করলে আপনার পূরণ করা তথ্যগুলো সংরক্ষণ করা হবে না।
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCancelWarning(false)}
                className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                না, থাক
              </button>

              <button
                type="button"
                onClick={() => router.push("/sheba/blood-bank")}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                হ্যাঁ, বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}