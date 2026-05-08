import BARISVP from "@/components/pages/BARISVP";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "BARI — Business AI Readiness Index | Know where your business stands — Sevenpreneur",
  description:
    "Business AI Readiness Index (BARI). A six-dimension diagnostic that tells you where your business stands on AI readiness — and how far it can go. Editorial-grade report with AI tool recommendations and a 30-60-90 day roadmap.",
  keywords: [
    "BARI",
    "Business AI Readiness Index",
    "AI readiness assessment",
    "AI maturity",
    "AI adoption diagnostic",
    "AI strategy",
    "sevenpreneur",
  ],
  openGraph: {
    title: "BARI — Business AI Readiness Index",
    description:
      "Six-dimension diagnostic that tells you where your business stands on AI readiness — and how far it can go.",
    url: "https://sevenpreneur.com/business-ai-readiness-index",
    siteName: "Sevenpreneur",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BARI — Business AI Readiness Index",
    description:
      "Six-dimension diagnostic that tells you where your business stands on AI readiness.",
  },
  alternates: {
    canonical: "https://www.sevenpreneur.com/business-ai-readiness-index",
  },
};

export default function BusinessAIReadinessIndexPage() {
  return <BARISVP />;
}
