"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

type Donor = {
  id: string;
  name?: string;
  email?: string;
  profilePhoto?: string;
};

type Props = {
  donor: Donor;
};

type Step = "email" | "otp" | "photo";

export default function DonorProfilePhotoEditor({
  donor,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [verificationId, setVerificationId] =
    useState("");

  const [uploadToken, setUploadToken] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState(
    donor.profilePhoto || "/profile/anik-pic.svg"
  );

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [resendCountdown, setResendCountdown] =
    useState(0);

  /* --------------------------------
     PREVIEW URL CLEANUP
  -------------------------------- */

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* --------------------------------
     RESEND COUNTDOWN
  -------------------------------- */

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setInterval(() => {
      setResendCountdown((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  /* --------------------------------
     OPEN EDITOR
  -------------------------------- */

  const handleOpen = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setStep("email");

    setEmail("");
    setOtp("");
    setVerificationId("");
    setUploadToken("");
    setSelectedFile(null);

    setError("");
    setSuccessMessage("");

    setResendCountdown(0);

    setPreviewUrl(
      donor.profilePhoto ||
        "/profile/anik-pic.svg"
    );

    setIsOpen(true);
  };

  /* --------------------------------
     CLOSE EDITOR
  -------------------------------- */

  const handleClose = () => {
    if (isSubmitting) return;

    // Do not close immediately after OTP verification.
    // Ask for confirmation so an accidental click does not
    // waste the already-sent OTP.
    if (step !== "email") {
      const confirmed = window.confirm(
        "আপনি কি Profile Photo পরিবর্তনের প্রক্রিয়া বন্ধ করতে চান?\n\nবন্ধ করলে বর্তমান OTP/verification session আর ব্যবহার করা যাবে না।"
      );

      if (!confirmed) return;
    }

    setIsOpen(false);

    setStep("email");

    setEmail("");
    setOtp("");
    setVerificationId("");
    setUploadToken("");
    setSelectedFile(null);

    setError("");
    setSuccessMessage("");

    setResendCountdown(0);

    setPreviewUrl(
      donor.profilePhoto ||
        "/profile/anik-pic.svg"
    );
  };

  /* --------------------------------
     SEND OTP
  -------------------------------- */

  const handleSendOtp = async () => {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        "আপনার নিবন্ধিত ইমেইল ঠিকানা দিন।"
      );
      return;
    }

    if (!normalizedEmail.includes("@")) {
      setError(
        "সঠিক ইমেইল ঠিকানা দিন।"
      );
      return;
    }

    if (resendCountdown > 0) {
      setError(
        `আবার OTP পাঠাতে ${resendCountdown} সেকেন্ড অপেক্ষা করুন।`
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/donor/profile-photo/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            donorId: donor.id,
            email: normalizedEmail,
          }),
        }
      );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        // Expected business response such as the 14-day profile-photo lock.
        // Show the server message in the UI instead of throwing an Error,
        // so Next.js does not display a development error overlay.
        setError(
          data?.message ||
            "OTP পাঠানো যায়নি।"
        );
        return;
      }

      if (!data?.verificationId) {
        throw new Error(
          "Verification ID পাওয়া যায়নি। আবার চেষ্টা করুন।"
        );
      }

      setVerificationId(
        data.verificationId
      );

      setEmail(normalizedEmail);

      setOtp("");

      setStep("otp");

      setResendCountdown(
        Number(
          data.resendAfterSeconds || 120
        )
      );

      setSuccessMessage(
        "আপনার নিবন্ধিত ইমেইলে OTP পাঠানো হয়েছে।"
      );
    } catch (error) {
      console.error(
        "Profile photo send OTP error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "OTP পাঠাতে সমস্যা হয়েছে।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* --------------------------------
     VERIFY OTP
  -------------------------------- */

  const handleVerifyOtp = async () => {
    const normalizedOtp =
      otp.trim();

    if (!verificationId) {
      setError(
        "Verification session পাওয়া যায়নি। আবার OTP নিন।"
      );

      setStep("email");

      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setError(
        "৬ সংখ্যার OTP দিন।"
      );

      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/donor/profile-photo/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            donorId: donor.id,
            verificationId,
            otp: normalizedOtp,
          }),
        }
      );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "OTP verification ব্যর্থ হয়েছে।"
        );
      }

      if (!data?.uploadToken) {
        throw new Error(
          "Photo upload authorization পাওয়া যায়নি। আবার চেষ্টা করুন।"
        );
      }

      setUploadToken(
        data.uploadToken
      );

      setOtp("");

      setStep("photo");

      setError("");

      /*
       * এখানে কোনো successMessage দেওয়া হচ্ছে না।
       * কারণ Photo step-এর উপরে আলাদা green box-এ
       * Email verification successful দেখানো হবে।
       */
      setSuccessMessage("");
    } catch (error) {
      console.error(
        "Profile photo OTP verification error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "OTP verify করতে সমস্যা হয়েছে।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* --------------------------------
     CHANGE EMAIL
  -------------------------------- */

  const handleChangeEmail = () => {
    if (isSubmitting) return;

    setStep("email");

    setOtp("");

    setVerificationId("");

    setUploadToken("");

    setError("");

    setSuccessMessage("");

    setResendCountdown(0);
  };

  /* --------------------------------
     FILE SELECT
  -------------------------------- */

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setError("");

    setSuccessMessage("");

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "শুধু JPG, PNG অথবা WebP ছবি নির্বাচন করুন।"
      );

      e.target.value = "";

      return;
    }

    setSelectedFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  /* --------------------------------
     UPLOAD PHOTO REQUEST
  -------------------------------- */

  const handleSubmit = async () => {
    if (!verificationId) {
      setError(
        "Email verification সম্পূর্ণ হয়নি।"
      );
      return;
    }

    if (!uploadToken) {
      setError(
        "Photo upload authorization পাওয়া যায়নি। আবার OTP verify করুন।"
      );
      return;
    }

    if (!selectedFile) {
      setError(
        "আগে একটি ছবি নির্বাচন করুন।"
      );
      return;
    }

    setIsSubmitting(true);

    setError("");

    setSuccessMessage("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "donorId",
        donor.id
      );

      formData.append(
        "verificationId",
        verificationId
      );

      formData.append(
        "uploadToken",
        uploadToken
      );

      const response =
        await fetch(
          "/api/donor/profile-photo/request",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "ছবির পরিবর্তনের অনুরোধ পাঠানো যায়নি।"
        );
      }

      setSuccessMessage(
        data?.message ||
          "প্রোফাইল ছবির পরিবর্তনের অনুরোধ সফলভাবে পাঠানো হয়েছে।"
      );

      setUploadToken("");

      setVerificationId("");

      setSelectedFile(null);

      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (error) {
      console.error(
        "Profile photo request error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "ছবির পরিবর্তনের অনুরোধ পাঠাতে সমস্যা হয়েছে।"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ==========================================
          PEN BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={handleOpen}
        className="
          absolute
          -right-3
          bottom-1
          z-10
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border-[3px]
          border-white
          bg-red-500
          text-white
          shadow-lg
          transition-all
          hover:bg-red-600
          hover:scale-105
          active:scale-95
        "
        aria-label="প্রোফাইল ছবি পরিবর্তন"
        title="প্রোফাইল ছবি পরিবর্তন"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 3.487a2.25 2.25 0 013.182 3.182L8.25 18.463 4 19.75l1.287-4.25L16.862 3.487z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.5 5l3.5 3.5"
          />
        </svg>
      </button>

      {/* ==========================================
          MODAL
      ========================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[260]
            flex
            items-center
            justify-center
            bg-black/65
            px-3
            backdrop-blur-sm
          "
          onClick={(e) => {
            // Intentionally do nothing when clicking outside.
            // The modal must stay open until the user explicitly
            // clicks X or a Cancel button.
            if (
              e.target ===
              e.currentTarget
            ) {
              return;
            }
          }}
        >
          <div
            className="
              relative
              w-full
              max-w-[390px]
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-2xl
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-200
                px-5
                py-4
              "
            >
              <div>
                <h2 className="text-[19px] font-extrabold text-gray-900">
                  প্রোফাইল ছবি পরিবর্তন
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  {step === "email" &&
                    "প্রথমে আপনার নিবন্ধিত ইমেইল যাচাই করুন"}

                  {step === "otp" &&
                    "আপনার ইমেইলে পাঠানো OTP দিন"}

                  {step === "photo" &&
                    "এখন নতুন ছবি নির্বাচন করুন"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-gray-500
                  hover:bg-red-50
                  hover:text-red-600
                  disabled:opacity-50
                "
              >
                ×
              </button>
            </div>

            {/* ======================================
                STEP INDICATOR
            ====================================== */}

            <div className="px-5 pt-4">
              <div className="flex items-center gap-2">

                <div
                  className={`
                    h-2
                    flex-1
                    rounded-full
                    ${
                      step === "email" ||
                      step === "otp" ||
                      step === "photo"
                        ? "bg-red-500"
                        : "bg-gray-200"
                    }
                  `}
                />

                <div
                  className={`
                    h-2
                    flex-1
                    rounded-full
                    ${
                      step === "otp" ||
                      step === "photo"
                        ? "bg-red-500"
                        : "bg-gray-200"
                    }
                  `}
                />

                <div
                  className={`
                    h-2
                    flex-1
                    rounded-full
                    ${
                      step === "photo"
                        ? "bg-red-500"
                        : "bg-gray-200"
                    }
                  `}
                />

              </div>

              <div className="mt-2 flex justify-between text-[10px] font-bold text-gray-400">
                <span>EMAIL</span>
                <span>OTP</span>
                <span>PHOTO</span>
              </div>
            </div>

            {/* ======================================
                BODY
            ====================================== */}

            <div className="px-5 py-5">

              {/* ====================================
                  STEP 1 — EMAIL
              ==================================== */}

              {step === "email" && (
                <div>

                  <div className="mb-5 flex justify-center">
                    <div
                      className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-4xl
                      "
                    >
                      ✉️
                    </div>
                  </div>

                  <h3 className="text-center text-lg font-extrabold text-gray-900">
                    ইমেইল যাচাই করুন
                  </h3>

                  <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                    আপনার Donor profile-এ
                    নিবন্ধিত ইমেইল ঠিকানা দিন।
                    যাচাই সফল হলে OTP পাঠানো হবে।
                  </p>

                  <div className="mt-5">

                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      নিবন্ধিত ইমেইল
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          handleSendOtp();
                        }
                      }}
                      placeholder="example@gmail.com"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        px-4
                        text-sm
                        font-medium
                        text-gray-900
                        outline-none
                        transition
                        focus:border-red-500
                        focus:ring-2
                        focus:ring-red-100
                        disabled:bg-gray-100
                      "
                    />

                  </div>

                  {error && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-center">
                      <p className="text-sm font-bold leading-5 text-red-600">
                        {error}
                      </p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-center">
                      <p className="text-sm font-bold leading-5 text-green-700">
                        {successMessage}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={
                      isSubmitting ||
                      !email.trim()
                    }
                    className="
                      mt-5
                      h-12
                      w-full
                      rounded-xl
                      bg-red-500
                      font-bold
                      text-white
                      shadow-md
                      transition
                      hover:bg-red-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {isSubmitting
                      ? "OTP পাঠানো হচ্ছে..."
                      : "OTP পাঠান"}
                  </button>

                  <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-center">
                    <p className="text-xs leading-5 text-gray-500">
                      🔒 আপনার email শুধুমাত্র
                      profile photo verification-এর
                      জন্য ব্যবহার করা হবে।
                    </p>
                  </div>

                </div>
              )}

              {/* ====================================
                  STEP 2 — OTP
              ==================================== */}

              {step === "otp" && (
                <div>

                  <div className="mb-5 flex justify-center">
                    <div
                      className="
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-green-50
                        text-4xl
                      "
                    >
                      🔐
                    </div>
                  </div>

                  <h3 className="text-center text-lg font-extrabold text-gray-900">
                    OTP দিন
                  </h3>

                  <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                    এই ইমেইলে OTP পাঠানো হয়েছে:
                  </p>

                  <p className="mt-1 break-all text-center text-sm font-extrabold text-red-600">
                    {email}
                  </p>

                  <div className="mt-5">

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setOtp(value);

                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter"
                        ) {
                          handleVerifyOtp();
                        }
                      }}
                      placeholder="••••••"
                      autoFocus
                      disabled={isSubmitting}
                      className="
                        h-14
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        bg-white
                        px-4
                        text-center
                        text-2xl
                        font-extrabold
                        tracking-[0.5em]
                        text-gray-900
                        outline-none
                        transition
                        focus:border-red-500
                        focus:ring-2
                        focus:ring-red-100
                        disabled:bg-gray-100
                      "
                    />

                  </div>

                  {error && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-center">
                      <p className="text-sm font-bold leading-5 text-red-600">
                        {error}
                      </p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-center">
                      <p className="text-sm font-bold leading-5 text-green-700">
                        {successMessage}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={
                      isSubmitting ||
                      otp.length !== 6
                    }
                    className="
                      mt-5
                      h-12
                      w-full
                      rounded-xl
                      bg-red-500
                      font-bold
                      text-white
                      shadow-md
                      transition
                      hover:bg-red-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {isSubmitting
                      ? "যাচাই হচ্ছে..."
                      : "OTP যাচাই করুন"}
                  </button>

                  <div className="mt-4 flex items-center justify-between gap-3">

                    <button
                      type="button"
                      onClick={handleChangeEmail}
                      disabled={isSubmitting}
                      className="
                        text-xs
                        font-bold
                        text-gray-500
                        hover:text-red-600
                      "
                    >
                      ← ইমেইল পরিবর্তন
                    </button>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={
                        isSubmitting ||
                        resendCountdown > 0
                      }
                      className="
                        text-xs
                        font-bold
                        text-red-600
                        hover:text-red-700
                        disabled:cursor-not-allowed
                        disabled:text-gray-400
                      "
                    >
                      {resendCountdown > 0
                        ? `আবার পাঠান (${resendCountdown}s)`
                        : "OTP আবার পাঠান"}
                    </button>

                  </div>

                  <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-center">
                    <p className="text-xs leading-5 text-gray-500">
                      OTP-এর মেয়াদ ৫ মিনিট।
                    </p>
                  </div>

                </div>
              )}

              {/* ====================================
                  STEP 3 — PHOTO
              ==================================== */}

              {step === "photo" && (
                <div>

                  {/* শুধু একবার verification status */}

                  <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center">
                    <p className="text-sm font-extrabold text-green-700">
                      ✓ Email verification সফল
                    </p>
                  </div>

                  {/* PHOTO PREVIEW */}

                  <div className="flex justify-center">

                    <div
                      className="
                        h-[136px]
                        w-[136px]
                        overflow-hidden
                        rounded-2xl
                        border-[3px]
                        border-red-200
                        bg-gray-100
                        shadow-md
                      "
                    >
                      <img
                        src={previewUrl}
                        alt={
                          donor.name ||
                          "Donor"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    </div>

                  </div>

                  {/* FILE SELECT */}

                  <label
                    htmlFor={`donor-profile-photo-${donor.id}`}
                    className="
                      mt-5
                      flex
                      h-14
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-xl
                      border-2
                      border-dashed
                      border-red-300
                      bg-red-50
                      px-4
                      text-center
                      font-bold
                      text-red-600
                      transition
                      hover:border-red-400
                      hover:bg-red-100
                    "
                  >
                    📷 ছবি নির্বাচন করুন

                    <input
                      id={`donor-profile-photo-${donor.id}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={
                        handleFileChange
                      }
                      disabled={
                        isSubmitting
                      }
                    />
                  </label>

                  {/* SELECTED FILE */}

                  {selectedFile && (
                    <div className="mt-3 rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-center">

                      <p className="break-all text-sm font-bold text-green-700">
                        {selectedFile.name}
                      </p>

                      <p className="mt-0.5 text-xs text-green-600">
                        {(
                          selectedFile.size /
                          (1024 * 1024)
                        ).toFixed(2)}{" "}
                        MB
                      </p>

                    </div>
                  )}

                  {/* ERROR */}

                  {error && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-center">
                      <p className="text-sm font-bold leading-5 text-red-600">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* RULES */}

                  <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-4">

                    <p className="mb-2 text-center text-sm font-extrabold text-gray-700">
                      ছবির নিয়ম:
                    </p>

                    <ul className="space-y-1 text-center text-xs leading-5 text-gray-600">

                      <li>
                        • Square / 1:1 ছবি হবে
                      </li>

                      <li>
                        • JPG / PNG / WebP
                      </li>

                      <li>
                        • কোনো MB limit নেই
                      </li>

                      <li>
                        • Admin approval ছাড়া
                          public photo পরিবর্তন হবে না
                      </li>

                    </ul>

                  </div>

                  {/* BUTTONS */}

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={
                        isSubmitting
                      }
                      className="
                        h-12
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        font-bold
                        text-gray-700
                        hover:bg-gray-50
                        disabled:opacity-50
                      "
                    >
                      বাতিল
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        !selectedFile ||
                        isSubmitting
                      }
                      className="
                        h-12
                        rounded-xl
                        bg-red-500
                        font-bold
                        text-white
                        shadow-md
                        hover:bg-red-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isSubmitting
                        ? "আপলোড হচ্ছে..."
                        : "অনুরোধ পাঠান"}
                    </button>

                  </div>

                  {/* UPLOAD SUCCESS */}

                  {successMessage && (
                    <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-center">
                      <p className="text-sm font-bold leading-5 text-green-700">
                        {successMessage}
                      </p>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}