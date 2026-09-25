import { NextRequest, NextResponse } from "next/server";
import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { createHash, randomUUID } from "crypto";
import sharp from "sharp";

import { adminDb } from "@/lib/firebase-admin";
import { s3 } from "@/lib/aws-s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET_NAME =
  process.env.AWS_S3_MEDIA_BUCKET_NAME;

const OTP_SECRET =
  process.env.PROFILE_PHOTO_OTP_SECRET;

if (!BUCKET_NAME) {
  console.warn(
    "AWS_S3_MEDIA_BUCKET_NAME is missing."
  );
}

if (!OTP_SECRET) {
  console.warn(
    "PROFILE_PHOTO_OTP_SECRET is missing."
  );
}

function hashUploadToken(token: string) {
  if (!OTP_SECRET) {
    throw new Error(
      "PROFILE_PHOTO_OTP_SECRET is missing."
    );
  }

  return createHash("sha256")
    .update(`${OTP_SECRET}:${token}`)
    .digest("hex");
}

export async function POST(
  request: NextRequest
) {
  let uploadedS3Key: string | null = null;

  try {
    // --------------------------------------------------
    // ENV CHECK
    // --------------------------------------------------

    if (!BUCKET_NAME) {
      return NextResponse.json(
        {
          success: false,
          message:
            "AWS S3 media configuration missing.",
        },
        { status: 500 }
      );
    }

    if (!OTP_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Profile photo verification configuration missing.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // FORM DATA
    // --------------------------------------------------

    const formData =
      await request.formData();

    const donorId = String(
      formData.get("donorId") || ""
    ).trim();

    const verificationId = String(
      formData.get("verificationId") || ""
    ).trim();

    const uploadToken = String(
      formData.get("uploadToken") || ""
    ).trim();

    const file =
      formData.get("file");

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!donorId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Donor ID পাওয়া যায়নি।",
        },
        { status: 400 }
      );
    }

    if (!verificationId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email verification পাওয়া যায়নি।",
        },
        { status: 403 }
      );
    }

    if (!uploadToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Photo upload verification পাওয়া যায়নি। আগে email verify করুন।",
        },
        { status: 403 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "একটি ছবি নির্বাচন করুন।",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message:
            "শুধু image file আপলোড করা যাবে।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // VERIFY OTP SESSION
    // --------------------------------------------------

    const sessionRef =
      adminDb
        .collection(
          "donorPhotoOtpSessions"
        )
        .doc(verificationId);

    const sessionSnap =
      await sessionRef.get();

    if (!sessionSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification session পাওয়া যায়নি। আবার OTP verify করুন।",
        },
        { status: 403 }
      );
    }

    const sessionData =
      sessionSnap.data() || {};

    // --------------------------------------------------
    // DONOR ID MATCH
    // --------------------------------------------------

    if (
      String(
        sessionData.donorId || ""
      ) !== donorId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification information সঠিক নয়।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // VERIFIED STATUS
    // --------------------------------------------------

    if (
      sessionData.status !==
      "verified"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "আগে OTP verification সম্পন্ন করুন।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // UPLOAD TOKEN CHECK
    // --------------------------------------------------

    const savedTokenHash =
      String(
        sessionData.uploadTokenHash ||
          ""
      );

    const incomingTokenHash =
      hashUploadToken(uploadToken);

    if (
      !savedTokenHash ||
      incomingTokenHash !==
        savedTokenHash
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Photo upload authorization সঠিক নয়। আবার OTP verify করুন।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // UPLOAD TOKEN EXPIRY
    // --------------------------------------------------

    const uploadTokenExpiresAt =
      Number(
        sessionData.uploadTokenExpiresAt ||
          0
      );

    if (
      !uploadTokenExpiresAt ||
      Date.now() >
        uploadTokenExpiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Photo upload verification-এর মেয়াদ শেষ হয়েছে। আবার OTP verify করুন।",
        },
        { status: 410 }
      );
    }

    // --------------------------------------------------
    // DONOR CHECK
    // --------------------------------------------------

    const donorRef =
      adminDb
        .collection("donors")
        .doc(donorId);

    const donorSnap =
      await donorRef.get();

    if (!donorSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "এই Donor ID-এর কোনো তথ্য পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    const donorData =
      donorSnap.data() || {};

    // --------------------------------------------------
    // ACTIVE CHECK
    // --------------------------------------------------

    if (
      donorData.deletedAt ||
      donorData.active === false
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "এই donor profile বর্তমানে active নয়।",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // 15-DAY LOCK
    // --------------------------------------------------

    const lockedUntil =
      Number(
        donorData.profilePhotoLockedUntil ||
          0
      );

    if (
      lockedUntil > 0 &&
      Date.now() < lockedUntil
    ) {
      const remainingDays =
        Math.ceil(
          (lockedUntil -
            Date.now()) /
            (1000 *
              60 *
              60 *
              24)
        );

      return NextResponse.json(
        {
          success: false,
          message: `আপনার প্রোফাইল ছবি পরিবর্তন বর্তমানে locked। আরও প্রায় ${remainingDays} দিন পর পরিবর্তন করতে পারবেন।`,
          lockedUntil,
        },
        { status: 429 }
      );
    }

    // --------------------------------------------------
    // EXISTING PENDING REQUEST
    // --------------------------------------------------

    const existingRequestSnap =
      await adminDb
        .collection(
          "donorPhotoRequests"
        )
        .where(
          "donorId",
          "==",
          donorId
        )
        .where(
          "status",
          "==",
          "pending"
        )
        .limit(1)
        .get();

    if (
      !existingRequestSnap.empty
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "আপনার একটি profile photo request ইতিমধ্যে Admin approval-এর অপেক্ষায় আছে।",
        },
        { status: 409 }
      );
    }

    // --------------------------------------------------
    // READ IMAGE
    // --------------------------------------------------

    const originalBuffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    if (
      !originalBuffer.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ছবিটি খালি। অন্য ছবি নির্বাচন করুন।",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // IMAGE PROCESSING
    //
    // No MB limit
    // Auto rotate
    // Square 1:1
    // 800x800
    // WebP
    // --------------------------------------------------

    const processedBuffer =
      await sharp(
        originalBuffer
      )
        .rotate()
        .resize(800, 800, {
          fit: "cover",
          position: "centre",
        })
        .webp({
          quality: 82,
          effort: 4,
        })
        .toBuffer();

    // --------------------------------------------------
    // S3 KEY
    // --------------------------------------------------

    const timestamp =
      new Date()
        .toISOString()
        .replace(
          /[:.]/g,
          "-"
        );

    const uniqueId =
      randomUUID();

    const s3Key =
      `donors/${donorId}/pending/` +
      `profile-${timestamp}-${uniqueId}.webp`;

    // --------------------------------------------------
    // UPLOAD TO S3
    // --------------------------------------------------

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,

        Key: s3Key,

        Body: processedBuffer,

        ContentType:
          "image/webp",

        ServerSideEncryption:
          "AES256",

        Metadata: {
          donorId,
          purpose:
            "profile-photo-pending",
          verificationId,
        },
      })
    );

    uploadedS3Key =
      s3Key;

    // --------------------------------------------------
    // CREATE PHOTO REQUEST
    // --------------------------------------------------

    const requestRef =
      adminDb
        .collection(
          "donorPhotoRequests"
        )
        .doc();

    const now =
      Date.now();

    await requestRef.set({
      donorId,

      donorName: String(
        donorData.name || ""
      ),

      status: "pending",

      pendingKey: s3Key,

      currentPhoto:
        donorData.profilePhoto ||
        donorData.photoURL ||
        "/profile/anik-pic.svg",

      originalFileName:
        file.name || "",

      originalContentType:
        file.type || "",

      originalSizeBytes:
        originalBuffer.length,

      processedContentType:
        "image/webp",

      processedSizeBytes:
        processedBuffer.length,

      processedWidth: 800,

      processedHeight: 800,

      verificationId,

      createdAt: now,

      updatedAt: now,

      submittedAt: now,
    });

    // --------------------------------------------------
    // CONSUME UPLOAD TOKEN
    //
    // Token আর দ্বিতীয়বার ব্যবহার করা যাবে না।
    // --------------------------------------------------

    await sessionRef.update({
      status:
        "upload_completed",

      uploadTokenHash:
        null,

      uploadTokenExpiresAt:
        null,

      uploadCompletedAt:
        now,

      requestId:
        requestRef.id,
    });

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "প্রোফাইল ছবির পরিবর্তনের অনুরোধ সফলভাবে পাঠানো হয়েছে। Admin approval-এর পর নতুন ছবি প্রকাশ হবে।",

        requestId:
          requestRef.id,

        status:
          "pending",

        processedSizeBytes:
          processedBuffer.length,

        image: {
          width: 800,
          height: 800,
          format: "webp",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Profile photo request error:",
      error
    );

    // --------------------------------------------------
    // S3 CLEANUP
    // --------------------------------------------------

    if (
      uploadedS3Key &&
      BUCKET_NAME
    ) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket:
              BUCKET_NAME,

            Key:
              uploadedS3Key,
          })
        );

        console.log(
          "Orphan S3 pending file deleted:",
          uploadedS3Key
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Failed to cleanup S3 pending file:",
          cleanupError
        );
      }
    }

    // --------------------------------------------------
    // ERROR RESPONSE
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: false,

        message:
          "প্রোফাইল ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}