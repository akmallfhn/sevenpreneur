import AppInterstitialBanner from "@/app/components/modals/AppInterstitialBanner";
import HomeSVP from "@/app/components/pages/HomeSVP";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sevenpreneur | All-in-One Business Learning Platform",
  description:
    "All-in-one business learning platform untuk founder dan entrepreneur. Dapatkan roadmap, modul praktis, dan strategi eksekusi agar bisnismu bisa level up.",
  keywords:
    "Sevenpreneur, Business Blueprint, Raymond Chin, Video On Demand Bisnis",
  authors: [{ name: "Sevenpreneur" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sevenpreneur | All-in-One Business Learning Platform",
    description:
      "All-in-one business learning platform untuk founder dan entrepreneur. Dapatkan roadmap, modul praktis, dan strategi eksekusi agar bisnismu bisa level up.",
    url: "/",
    siteName: "Sevenpreneur",
    images: [
      {
        url: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-1.webp",
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sevenpreneur | All-in-One Business Learning Platform",
    description:
      "All-in-one business learning platform untuk founder dan entrepreneur. Dapatkan roadmap, modul praktis, dan strategi eksekusi agar bisnismu bisa level up.",
    images:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-1.webp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function HomePage() {
  let bannerTimeInterval = 1000 * 60 * 60; // 1 hour
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    bannerTimeInterval = 1000 * 40; // 40 seconds
  }

  const status = false;

  return (
    <div>
      <HomeSVP />
      {!!status && (
        <AppInterstitialBanner
          interstitialImageMobile="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//insterstitial-dseven.webp"
          interstitialImageDesktop="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//web-popup-dseven.webp"
          interstitialAction="Buy Now!"
          interstitialTimeInterval={bannerTimeInterval}
          interstitialURL="https://vesta.halofans.id/event/v2/re-start"
        />
      )}
    </div>
  );
}
