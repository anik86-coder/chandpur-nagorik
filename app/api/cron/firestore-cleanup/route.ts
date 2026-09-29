import { NextRequest, NextResponse } from "next/server";

import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// AUTOMATIC FIRESTORE CLEANUP
// ============================================================
//
// Cleanup policy:
//
// 1. donorPhotoOtpSessions
//    → expiresAt পার হয়ে গেলে session delete
//
// 2. donorPhotoRequests
//    → approved / rejected এবং 30 দিনের পুরোনো হলে delete
//    → pending কখনো delete হবে না
//
// 3. bloodDonorRequests
//    → approved / rejected এবং 90 দিনের পুরোনো হলে delete
//    → pending কখনো delete হবে না
//
// IMPORTANT:
// donors / donorPrivate এই cleanup কখনো touch করবে না.
// ============================================================

const PHOTO_REQUEST_RETENTION_MS =
  30 * 24 * 60 * 60 * 1000;

const BLOOD_REQUEST_RETENTION_MS =
  90 * 24 * 60 * 60 * 1000;

// Firestore batch maximum 500 operations.
// আমরা নিরাপদে 400 করে commit করব।
const BATCH_SIZE = 400;

// ============================================================
// DELETE DOCUMENTS IN BATCHES
// ============================================================

async function deleteDocsInBatches(
  docs: FirebaseFirestore.QueryDocumentSnapshot[]
) {
  let deletedCount = 0;

  for (
    let start = 0;
    start < docs.length;
    start += BATCH_SIZE
  ) {
    const batch = adminDb.batch();

    const chunk = docs.slice(
      start,
      start + BATCH_SIZE
    );

    for (const document of chunk) {
      batch.delete(document.ref);
    }

    await batch.commit();

    deletedCount += chunk.length;
  }

  return deletedCount;
}

// ============================================================
// CLEANUP DONOR PHOTO OTP SESSIONS
// ============================================================
//
// expiresAt Firestore-এ int64 / number হিসেবে রাখা আছে।
// তাই current Unix timestamp-এর সঙ্গে সরাসরি compare করা হবে.
//
// expiresAt <= এখন
// → session expired
// → automatic delete
//
// ============================================================

async function cleanupDonorPhotoOtpSessions() {
  const currentTime = Date.now();

  const snapshot = await adminDb
    .collection("donorPhotoOtpSessions")
    .where(
      "expiresAt",
      "<=",
      currentTime
    )
    .get();

  if (snapshot.empty) {
    return 0;
  }

  return deleteDocsInBatches(
    snapshot.docs
  );
}

// ============================================================
// CLEANUP DONOR PHOTO REQUESTS
// ============================================================

async function cleanupDonorPhotoRequests() {
  const cutoffDate = new Date(
    Date.now() -
      PHOTO_REQUEST_RETENTION_MS
  );

  const cutoffISO =
    cutoffDate.toISOString();

  let deletedCount = 0;

  // ----------------------------------------------------------
  // APPROVED
  // ----------------------------------------------------------

  const approvedSnapshot =
    await adminDb
      .collection("donorPhotoRequests")
      .where(
        "status",
        "==",
        "approved"
      )
      .where(
        "approvedAt",
        "<=",
        cutoffISO
      )
      .get();

  if (!approvedSnapshot.empty) {
    deletedCount +=
      await deleteDocsInBatches(
        approvedSnapshot.docs
      );
  }

  // ----------------------------------------------------------
  // REJECTED
  // ----------------------------------------------------------

  const rejectedSnapshot =
    await adminDb
      .collection("donorPhotoRequests")
      .where(
        "status",
        "==",
        "rejected"
      )
      .where(
        "rejectedAt",
        "<=",
        cutoffISO
      )
      .get();

  if (!rejectedSnapshot.empty) {
    deletedCount +=
      await deleteDocsInBatches(
        rejectedSnapshot.docs
      );
  }

  // ----------------------------------------------------------
  // IMPORTANT
  // ----------------------------------------------------------
  // pending request এখানে query করা হয়নি।
  // তাই pending photo request কখনো automatic delete হবে না.

  return deletedCount;
}

// ============================================================
// CLEANUP BLOOD DONOR REQUESTS
// ============================================================

async function cleanupBloodDonorRequests() {
  const cutoffDate = new Date(
    Date.now() -
      BLOOD_REQUEST_RETENTION_MS
  );

  const cutoffISO =
    cutoffDate.toISOString();

  let deletedCount = 0;

  // ----------------------------------------------------------
  // APPROVED
  // ----------------------------------------------------------

  const approvedSnapshot =
    await adminDb
      .collection("bloodDonorRequests")
      .where(
        "status",
        "==",
        "approved"
      )
      .where(
        "approvedAt",
        "<=",
        cutoffISO
      )
      .get();

  if (!approvedSnapshot.empty) {
    deletedCount +=
      await deleteDocsInBatches(
        approvedSnapshot.docs
      );
  }

  // ----------------------------------------------------------
  // REJECTED
  // ----------------------------------------------------------

  const rejectedSnapshot =
    await adminDb
      .collection("bloodDonorRequests")
      .where(
        "status",
        "==",
        "rejected"
      )
      .where(
        "rejectedAt",
        "<=",
        cutoffISO
      )
      .get();

  if (!rejectedSnapshot.empty) {
    deletedCount +=
      await deleteDocsInBatches(
        rejectedSnapshot.docs
      );
  }

  // ----------------------------------------------------------
  // IMPORTANT
  // ----------------------------------------------------------
  // pending request এখানে query করা হয়নি।
  // তাই pending donor application কখনো automatic delete হবে না.

  return deletedCount;
}

// ============================================================
// AUTHENTICATION
// ============================================================

function isAuthorized(request: NextRequest) {
  const cronSecret =
    process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error(
      "CRON_SECRET is missing."
    );

    return false;
  }

  const authorization =
    request.headers.get(
      "authorization"
    );

  if (!authorization) {
    return false;
  }

  return (
    authorization ===
    `Bearer ${cronSecret}`
  );
}

// ============================================================
// GET
// ============================================================

export async function GET(
  request: NextRequest
) {
  try {
    // --------------------------------------------------------
    // SECURITY
    // --------------------------------------------------------

    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------------
    // RUN CLEANUP
    // --------------------------------------------------------

    const startedAt =
      Date.now();

    const [
      deletedOtpSessions,
      deletedPhotoRequests,
      deletedBloodRequests,
    ] = await Promise.all([
      cleanupDonorPhotoOtpSessions(),
      cleanupDonorPhotoRequests(),
      cleanupBloodDonorRequests(),
    ]);

    const duration =
      Date.now() -
      startedAt;

    // --------------------------------------------------------
    // RESULT
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        cleanup: {
          donorPhotoOtpSessions:
            deletedOtpSessions,

          donorPhotoRequests:
            deletedPhotoRequests,

          bloodDonorRequests:
            deletedBloodRequests,
        },

        totalDeleted:
          deletedOtpSessions +
          deletedPhotoRequests +
          deletedBloodRequests,

        durationMs: duration,

        message:
          "Firestore cleanup successfully completed.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Firestore cleanup error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Firestore cleanup failed.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown error.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST
// ============================================================

export async function POST(
  request: NextRequest
) {
  return GET(request);
}