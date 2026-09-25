import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// AWS S3 MEDIA CONFIG
// ============================================================

const region = process.env.S3_AWS_REGION;
const accessKeyId = process.env.S3_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_S3_MEDIA_BUCKET_NAME;

// CloudFront
const CLOUDFRONT_DOMAIN =
  process.env.NEXT_PUBLIC_DONOR_CLOUDFRONT_URL ||
  "https://d2vneetxm2xhbc.cloudfront.net";

if (!region) {
  throw new Error("S3_AWS_REGION is missing.");
}

if (!accessKeyId) {
  throw new Error("S3_AWS_ACCESS_KEY_ID is missing.");
}

if (!secretAccessKey) {
  throw new Error("S3_AWS_SECRET_ACCESS_KEY is missing.");
}

if (!bucketName) {
  throw new Error("AWS_S3_MEDIA_BUCKET_NAME is missing.");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// ============================================================
// GET APPROVED DONOR PROFILE PHOTO
// ============================================================

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      donorId: string;
    }>;
  }
) {
  try {
    // ========================================================
    // 1. GET DONOR ID
    // ========================================================

    const { donorId } = await context.params;

    const cleanDonorId = String(donorId || "").trim();

    if (!cleanDonorId) {
      return new NextResponse(null, {
        status: 400,
      });
    }

    // ========================================================
    // 2. GET DONOR FROM FIRESTORE
    // ========================================================

    const donorRef = adminDb
      .collection("donors")
      .doc(cleanDonorId);

    const donorSnap = await donorRef.get();

    if (!donorSnap.exists) {
      return new NextResponse(null, {
        status: 404,
      });
    }

    const donorData = donorSnap.data() || {};

    // ========================================================
    // 3. ONLY ACTIVE DONORS
    // ========================================================

    if (
      donorData.active === false ||
      donorData.deletedAt
    ) {
      return new NextResponse(null, {
        status: 404,
      });
    }

    // ========================================================
    // 4. PROFILE PHOTO KEY
    // ========================================================

    const profilePhotoKey = String(
      donorData.profilePhotoKey || ""
    ).trim();

    if (!profilePhotoKey) {
      return new NextResponse(null, {
        status: 404,
      });
    }

    // ========================================================
    // 5. SECURITY CHECK
    // ========================================================

    const expectedPrefix =
      `donors/${cleanDonorId}/profile/`;

    if (
      !profilePhotoKey.startsWith(
        expectedPrefix
      )
    ) {
      console.error(
        "Invalid donor profile photo key:",
        {
          donorId: cleanDonorId,
          profilePhotoKey,
        }
      );

      return new NextResponse(null, {
        status: 404,
      });
    }

    // ========================================================
    // 6. VERIFY OBJECT EXISTS IN S3
    // ========================================================

    const s3Result = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: profilePhotoKey,
      })
    );

    if (!s3Result.Body) {
      return new NextResponse(null, {
        status: 404,
      });
    }

    // ========================================================
    // 7. DO NOT SEND S3 BYTES THROUGH NEXT.JS
    //
    // Security checks are already completed above.
    // The actual image will now be served by CloudFront.
    // ========================================================

    const cleanCloudFrontDomain =
      CLOUDFRONT_DOMAIN.replace(/\/+$/, "");

    const cloudFrontUrl =
      `${cleanCloudFrontDomain}/${profilePhotoKey}`;

    // ========================================================
    // 8. REDIRECT TO CLOUDFRONT
    // ========================================================

    return NextResponse.redirect(
      cloudFrontUrl,
      {
        status: 302,
        headers: {
          "Cache-Control":
            "public, max-age=60, stale-while-revalidate=300",

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    console.error(
      "Donor profile photo API error:",
      error
    );

    return new NextResponse(null, {
      status: 404,
    });
  }
}