import { sendEmail } from "@/lib/mailtrap";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const items = [
    { description: "Design Consultation", qty: 2, price: 300000 },
    { description: "Development (10 hours)", qty: 10, price: 150000 },
  ];

  try {
    const res = await sendEmail({
      mailRecipients: ["akmalluthfiansyah@gmail.com"],
      mailSubject: "Hello from Next.js + Mailtrap",
      mailBody: "This is a test email using Mailtrap SDK.",
    });

    return NextResponse.json({ success: true, res });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
