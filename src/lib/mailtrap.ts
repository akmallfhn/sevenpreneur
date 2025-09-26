import { MailtrapClient } from "mailtrap";

interface SendEmailProps {
  mailRecipients: string[];
  mailSubject: string;
  mailBody?: string;
  mailHtml?: string;
}

const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN!,
});

const sender = {
  name: "Sevenpreneur",
  email: "no-reply@sevenpreneur.com",
};

export async function sendEmail({
  mailRecipients,
  mailSubject,
  mailBody,
  mailHtml,
}: SendEmailProps) {
  try {
    const responseMail = await client.send({
      from: sender,
      to: mailRecipients.map((email) => ({ email })),
      subject: mailSubject,
      text: mailBody,
      html: mailHtml,
    });
    return responseMail;
  } catch (error) {
    console.error("Mailtrap send error:", error);
  }
}
