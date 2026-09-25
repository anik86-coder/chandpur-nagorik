import "server-only";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const region = process.env.SES_AWS_REGION;
const accessKeyId = process.env.SES_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.SES_AWS_SECRET_ACCESS_KEY;
const fromEmail = process.env.SES_FROM_EMAIL;

if (!region) {
  throw new Error("SES_AWS_REGION is missing.");
}

if (!accessKeyId) {
  throw new Error("SES_AWS_ACCESS_KEY_ID is missing.");
}

if (!secretAccessKey) {
  throw new Error("SES_AWS_SECRET_ACCESS_KEY is missing.");
}

if (!fromEmail) {
  throw new Error("SES_FROM_EMAIL is missing.");
}

export const sesClient = new SESClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions) {
  const recipients = Array.isArray(to) ? to : [to];

  const command = new SendEmailCommand({
    Source: fromEmail,

    Destination: {
      ToAddresses: recipients,
    },

    ReplyToAddresses: replyTo ? [replyTo] : undefined,

    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },

      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },

        Text: {
          Data: text ?? "",
          Charset: "UTF-8",
        },
      },
    },
  });

  return sesClient.send(command);
}