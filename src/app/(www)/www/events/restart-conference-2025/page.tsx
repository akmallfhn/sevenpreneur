import { Metadata } from "next";
import Restart25Page from "@/app/components/custom-pages/Restart25Page";

export const metadata: Metadata = {
  title:
    "RE:START Conference by Sevenpreneur and Raymond Chin | Business Conference for Indonesia's Millennial and Gen Z Entrepreneurs 2025",
  description:
    "Ikuti RE:START, konferensi bisnis dari Sevenpreneur dan Raymond Chin untuk generasi Millennial dan Gen Z Indonesia. Jelajahi tren, teknologi, strategi, dan mindset yang membentuk masa depan bisnis. Saatnya Anda menjadi entrepreneur global berikutnya.",
  keywords:
    "konferensi bisnis untuk millennial Indonesia, event bisnis generasi Z Indonesia, RESTART, Sevenpreneur, Raymond Chin, konferensi entrepreneur muda Indonesia, tren bisnis masa depan Indonesia, acara startup Indonesia 2025, Sevenpreneur business conference, event inovasi dan teknologi bisnis Indonesia",
  authors: [{ name: "Sevenpreneur" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/events/restart-conference-2025",
  },
  openGraph: {
    title:
      "RE:START Conference by Sevenpreneur and Raymond Chin | Business Conference for Indonesia's Millennial and Gen Z Entrepreneurs 2025",
    description:
      "Ikuti RE:START, konferensi bisnis dari Sevenpreneur dan Raymond Chin untuk generasi Millennial dan Gen Z Indonesia. Jelajahi tren, teknologi, strategi, dan mindset yang membentuk masa depan bisnis. Saatnya Anda menjadi entrepreneur global berikutnya.",
    url: "/events/restart-conference-2025",
    siteName: "Sevenpreneur",
    images: [
      {
        url: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//restart-og-images%20(1).webp",
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "RE:START Conference by Sevenpreneur and Raymond Chin | Business Conference for Indonesia's Millennial and Gen Z Entrepreneurs 2025",
    description:
      "Ikuti RE:START, konferensi bisnis dari Sevenpreneur dan Raymond Chin untuk generasi Millennial dan Gen Z Indonesia. Jelajahi tren, teknologi, strategi, dan mindset yang membentuk masa depan bisnis. Saatnya Anda menjadi entrepreneur global berikutnya.",
    images:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//restart-og-images%20(1).webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "googlebot-news": "index, follow",
  },
};

export default function Restart25EventPage() {
  return <Restart25Page />;
}
