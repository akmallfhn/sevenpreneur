import SurveyBusinessUpdateSVP from "@/app/components/forms/SurveyBusinessUpdatesSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Survey - Business Information Update | Sevenpreneur",
  description:
    "Pembaruan informasi bisnis agar data bisnismu tetap akurat dan membantu Sevenpreneur memberi rekomendasi yang lebih relevan",
  keywords:
    "Sevenpreneur, Business Blueprint, Raymond Chin, Video On Demand Bisnis",
  authors: [{ name: "Sevenpreneur" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Survey - Business Information Update | Sevenpreneur",
    description:
      "Pembaruan informasi bisnis agar data bisnismu tetap akurat dan membantu Sevenpreneur memberi rekomendasi yang lebih relevan",
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
    title: "Survey - Business Information Update | Sevenpreneur",
    description:
      "Pembaruan informasi bisnis agar data bisnismu tetap akurat dan membantu Sevenpreneur memberi rekomendasi yang lebih relevan",
    images:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-1.webp",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function UpdateBusinessPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/surveys/business-update`);
  }
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;
  const industriesData = (await trpc.list.industries()).list;

  return (
    <SurveyBusinessUpdateSVP
      sessionUserId={userData.id}
      sessionUserName={userData.full_name}
      sessionUserEmail={userData.email}
      industriesData={industriesData}
    />
  );
}
