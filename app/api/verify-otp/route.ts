import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase-admin";

export const dynamic = "force-dynamic";

const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCK_DURATION_MS = 20 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const normalizedEmail = String(body?.email || "")
      .trim()
      .toLowerCase();

    const normalizedOtp = String(body?.otp || "").trim();

    const normalizedDonorId = String(body?.donorId || "").trim();

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (
      !normalizedEmail ||
      !normalizedOtp ||
      !normalizedDonorId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Email, OTP এবং Donor ID প্রয়োজন।",
        },
        { status: 400 }
      );
    }

    // OTP অবশ্যই ৬ ডিজিট হতে হবে
    if (!/^\d{6}$/.test(normalizedOtp)) {
      return NextResponse.json(
        {
          success: false,
          message: "সঠিক ৬-ডিজিটের OTP দিন।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // HASH USER OTP
    // --------------------------------------------------

    /*
     * User যে OTP দিয়েছে সেটাকে SHA-256 hash করা হচ্ছে।
     *
     * Example:
     *
     * User OTP:
     * 583214
     *
     * Result:
     * d8cbda.......
     *
     * Firestore-এর otpHash-এর সাথে এই hash compare হবে।
     */

    const submittedOtpHash = createHash("sha256")
      .update(normalizedOtp)
      .digest("hex");

    // --------------------------------------------------
    // FIRESTORE REFERENCES
    // --------------------------------------------------

    const otpRef = adminDb
      .collection("otps")
      .doc(normalizedEmail);

    const donorRef = adminDb
      .collection("donors")
      .doc(normalizedDonorId);

    const privateRef = adminDb
      .collection("donorPrivate")
      .doc(normalizedDonorId);

    const lockRef = adminDb
      .collection("otpLocks")
      .doc(normalizedEmail);

    // --------------------------------------------------
    // ATOMIC TRANSACTION
    // --------------------------------------------------

    const result = await adminDb.runTransaction(
      async (transaction) => {
        /*
         * প্রয়োজনীয় documentগুলো এক transaction-এর
         * মধ্যে read হচ্ছে।
         */

        const [
          otpSnap,
          donorSnap,
          privateSnap,
          lockSnap,
        ] = await Promise.all([
          transaction.get(otpRef),
          transaction.get(donorRef),
          transaction.get(privateRef),
          transaction.get(lockRef),
        ]);

        const now = Date.now();

        // ------------------------------------------------
        // 20 MINUTE LOCK CHECK
        // ------------------------------------------------

        if (lockSnap.exists) {
          const lockData = lockSnap.data() || {};

          const lockedUntil = Number(
            lockData.lockedUntil || 0
          );

          // Lock এখনো active
          if (
            lockedUntil > 0 &&
            now < lockedUntil
          ) {
            return {
              type: "OTP_LOCKED" as const,
              retryAfterSeconds: Math.ceil(
                (lockedUntil - now) / 1000
              ),
            };
          }

          // Lock expired
          if (
            lockedUntil > 0 &&
            now >= lockedUntil
          ) {
            transaction.delete(lockRef);
          }
        }

        // ------------------------------------------------
        // OTP CHECK
        // ------------------------------------------------

        if (!otpSnap.exists) {
          return {
            type: "OTP_NOT_FOUND" as const,
          };
        }

        // ------------------------------------------------
        // DONOR CHECK
        // ------------------------------------------------

        if (!donorSnap.exists) {
          return {
            type: "DONOR_NOT_FOUND" as const,
          };
        }

        // ------------------------------------------------
        // PRIVATE DONOR CHECK
        // ------------------------------------------------

        if (!privateSnap.exists) {
          return {
            type: "PRIVATE_DONOR_NOT_FOUND" as const,
          };
        }

        const otpData = otpSnap.data() || {};
        const privateData = privateSnap.data() || {};

        // ------------------------------------------------
        // OTP EXPIRY
        // ------------------------------------------------

        const expiresAt = Number(
          otpData.expiresAt || 0
        );

        if (
          !expiresAt ||
          now > expiresAt
        ) {
          /*
           * Expired OTP আর ব্যবহার করা যাবে না।
           */
          transaction.delete(otpRef);

          return {
            type: "OTP_EXPIRED" as const,
          };
        }

        // ------------------------------------------------
        // EMAIL VALIDATION
        // ------------------------------------------------

        const registeredEmail = String(
          privateData.email || ""
        )
          .trim()
          .toLowerCase();

        if (
          !registeredEmail ||
          registeredEmail !== normalizedEmail
        ) {
          return {
            type: "EMAIL_MISMATCH" as const,
          };
        }

        // ------------------------------------------------
        // OTP → DONOR VALIDATION
        // ------------------------------------------------

        const otpDonorId = String(
          otpData.donorId || ""
        ).trim();

        if (
          !otpDonorId ||
          otpDonorId !== normalizedDonorId
        ) {
          return {
            type: "OTP_DONOR_MISMATCH" as const,
          };
        }

        // ------------------------------------------------
        // CURRENT ATTEMPT COUNT
        // ------------------------------------------------

        const currentAttempts = Math.max(
          0,
          Number(otpData.attempts || 0)
        );

        // ------------------------------------------------
        // HASH COMPARISON
        // ------------------------------------------------

        /*
         * Firestore-এ এখন plaintext `otp` নেই।
         *
         * তাই otpHash-এর সাথে submittedOtpHash compare হবে।
         */

        const storedOtpHash = String(
          otpData.otpHash || ""
        ).trim();

        if (
          !storedOtpHash ||
          storedOtpHash !== submittedOtpHash
        ) {
          const newAttempts =
            currentAttempts + 1;

          // ----------------------------------------------
          // 5TH WRONG ATTEMPT
          // ----------------------------------------------

          if (
            newAttempts >= MAX_OTP_ATTEMPTS
          ) {
            const lockedUntil =
              now + OTP_LOCK_DURATION_MS;

            /*
             * পুরোনো OTP delete।
             */
            transaction.delete(otpRef);

            /*
             * ২০ মিনিটের lock।
             */
            transaction.set(lockRef, {
              lockedUntil,
              createdAt: now,
              reason: "MAX_OTP_ATTEMPTS",
            });

            return {
              type: "MAX_ATTEMPTS_REACHED" as const,
              retryAfterSeconds: Math.ceil(
                OTP_LOCK_DURATION_MS / 1000
              ),
            };
          }

          // ----------------------------------------------
          // SAVE WRONG ATTEMPT
          // ----------------------------------------------

          transaction.update(otpRef, {
            attempts: newAttempts,
          });

          return {
            type: "INVALID_OTP" as const,
            attemptsLeft:
              MAX_OTP_ATTEMPTS - newAttempts,
          };
        }

        // ------------------------------------------------
        // CORRECT OTP
        // ------------------------------------------------

        const todayStr = new Date()
          .toISOString()
          .split("T")[0];

        // Donor update
        transaction.update(donorRef, {
          lastDonation: todayStr,
        });

        // OTP successful → delete
        transaction.delete(otpRef);

        return {
          type: "SUCCESS" as const,
          lastDonation: todayStr,
        };
      }
    );

    // ==================================================
    // RESPONSE HANDLING
    // ==================================================

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    if (result.type === "SUCCESS") {
      return NextResponse.json(
        {
          success: true,
          message:
            "OTP ভেরিফাই এবং ডোনেশন স্ট্যাটাস আপডেট সফল হয়েছে!",
          lastDonation: result.lastDonation,
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------
    // 20 MINUTE LOCK
    // --------------------------------------------------

    if (result.type === "OTP_LOCKED") {
      const totalSeconds =
        result.retryAfterSeconds;

      const minutes = Math.floor(
        totalSeconds / 60
      );

      const seconds =
        totalSeconds % 60;

      const remainingTime = `${String(
        minutes
      ).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;

      return NextResponse.json(
        {
          success: false,
          locked: true,
          message:
            "নিরাপত্তার কারণে OTP verification সাময়িকভাবে বন্ধ আছে। ২০ মিনিট পর আবার চেষ্টা করুন।",
          retryAfterSeconds:
            result.retryAfterSeconds,
          remainingTime,
        },
        { status: 429 }
      );
    }

    // --------------------------------------------------
    // OTP NOT FOUND
    // --------------------------------------------------

    if (result.type === "OTP_NOT_FOUND") {
      return NextResponse.json(
        {
          success: false,
          message:
            "কোনো OTP পাওয়া যায়নি। নতুন OTP নিয়ে আবার চেষ্টা করুন।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // OTP EXPIRED
    // --------------------------------------------------

    if (result.type === "OTP_EXPIRED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP এর মেয়াদ শেষ হয়ে গেছে। নতুন OTP নিয়ে আবার চেষ্টা করুন।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // INVALID OTP
    // --------------------------------------------------

    if (result.type === "INVALID_OTP") {
      return NextResponse.json(
        {
          success: false,
          message: `ভুল OTP দেওয়া হয়েছে। আরও ${result.attemptsLeft} বার চেষ্টা করতে পারবেন।`,
          attemptsLeft:
            result.attemptsLeft,
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 5 ATTEMPTS COMPLETED
    // --------------------------------------------------

    if (
      result.type ===
      "MAX_ATTEMPTS_REACHED"
    ) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          message:
            "আপনি ৫ বার ভুল OTP দিয়েছেন। নিরাপত্তার জন্য verification ২০ মিনিটের জন্য বন্ধ করা হয়েছে।",
          attemptsLeft: 0,
          retryAfterSeconds:
            result.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // --------------------------------------------------
    // DONOR NOT FOUND
    // --------------------------------------------------

    if (
      result.type ===
      "DONOR_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ডোনারের তথ্য পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // PRIVATE DONOR NOT FOUND
    // --------------------------------------------------

    if (
      result.type ===
      "PRIVATE_DONOR_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ডোনারের ব্যক্তিগত তথ্য পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // EMAIL MISMATCH
    // --------------------------------------------------

    if (
      result.type ===
      "EMAIL_MISMATCH"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "এই ইমেইলটি এই ডোনারের নিবন্ধিত ইমেইল নয়।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // OTP DONOR MISMATCH
    // --------------------------------------------------

    if (
      result.type ===
      "OTP_DONOR_MISMATCH"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "এই OTP এই ডোনারের জন্য বৈধ নয়। নতুন OTP নিয়ে আবার চেষ্টা করুন।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // FALLBACK
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: false,
        message:
          "OTP যাচাই করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "OTP যাচাই করতে সার্ভারে সমস্যা হয়েছে।",
      },
      { status: 500 }
    );
  }
}