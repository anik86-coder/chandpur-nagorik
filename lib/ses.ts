import "server-only";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const region = process.env.AWS_REGION;
const fromEmail = process.env.SES_FROM_EMAIL;

if (!region) {
  throw new Error("AWS_REGION is missing.");
}

if (!fromEmail) {
  throw new Error("SES_FROM_EMAIL is missing.");
}

export const sesClient = new SESClient({
  region,
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