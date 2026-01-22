import AppInterstitialBanner from "@/app/components/modals/AppInterstitialBanner";
import HomeSVP from "@/app/components/pages/HomeSVP";
import { setSecretKey, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sevenpreneur | The 1st AI-Integrated Business Training Program",
  description:
    "All-in-one business learning platform untuk founder dan entrepreneur. Dapatkan roadmap, modul praktis, dan strategi eksekusi agar bisnismu bisa level up.",
  keywords:
    "Sevenpreneur, Business Blueprint, Raymond Chin, Video On Demand Bisnis, kelas bisnis, course bisnis",
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
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  setSecretKey(secretKey!);

  let interstitialAdsRaw = null;
  try {
    interstitialAdsRaw = (await trpc.read.ad.interstitial({ id: 1 }))
      .interstitial;
  } catch {
    interstitialAdsRaw = null;
  }
  const interstitialAds = {
    ...interstitialAdsRaw,
    start_date: interstitialAdsRaw?.start_date.toISOString(),
    end_date: interstitialAdsRaw?.end_date.toISOString(),
  };

  return (
    <div>
      <HomeSVP />
      {interstitialAds.status === "ACTIVE" && (
        <AppInterstitialBanner
          interstitialImageMobile={interstitialAds.image_mobile!}
          interstitialImageDesktop={interstitialAds.image_desktop!}
          interstitialAction={interstitialAds.call_to_action ?? "More Details"}
          interstitialURL={interstitialAds.target_url!}
        />
      )}
    </div>
  );
}
