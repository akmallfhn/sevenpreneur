import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setSecretKey, trpc } from "@/trpc/server";
import HomeSVP from "@/app/components/pages/HomeSVP";

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
        url: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/cohort/hero-sbbp-desktop.webp",
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
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/cohort/hero-sbbp-desktop.webp",
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

  // Get Data
  setSecretKey(secretKey!);
  let cohortDataRaw;
  try {
    cohortDataRaw = (await trpc.read.cohort({ id: 36 })).cohort;
  } catch (error) {
    return notFound();
  }

  // Return 404 if INACTIVE status
  if (cohortDataRaw.status !== "ACTIVE") {
    return notFound();
  }

  // Sanitize data type
  const cohortData = {
    ...cohortDataRaw,
    cohort_prices: cohortDataRaw.cohort_prices.map((price: any) => ({
      ...price,
      amount: Number(price.amount),
    })),
  };

  return <HomeSVP imageHero={cohortData.image} />;
}
