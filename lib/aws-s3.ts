import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.S3_AWS_REGION;
const accessKeyId = process.env.S3_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_AWS_SECRET_ACCESS_KEY;

if (!region) {
  throw new Error("S3_AWS_REGION is missing.");
}

if (!accessKeyId) {
  throw new Error("S3_AWS_ACCESS_KEY_ID is missing.");
}

if (!secretAccessKey) {
  throw new Error("S3_AWS_SECRET_ACCESS_KEY is missing.");
}

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});