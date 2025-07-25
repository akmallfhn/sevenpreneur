import AppButton from "@/app/components/buttons/AppButton";
import HeaderNavbarSVP from "@/app/components/navigations/HeaderNavbarSVP";
import CohortSBBPBatch7SVP from "@/app/components/pages/CohortSBBPBatch7SVP";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface CohortDetailsPageProps {
  params: Promise<{ cohort_name: string; cohort_id: string }>;
}

export async function generateMetadata({
  params,
}: CohortDetailsPageProps): Promise<Metadata> {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  // Get Data
  setSecretKey(secretKey!);
  const cohortDetails = await trpc.read.cohort({ id: cohortId });
  const data = cohortDetails.cohort;

  return {
    title: data.name,
    description: data.description,
    keywords: "Sevenpreneur, Business Blueprint, Raymond Chin",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/cohorts/${data.slug_url}/${data.id}`,
    },
    openGraph: {
      title: data.name,
      description: data.description,
      url: `https://sevenpreneur.com/cohorts/${data.slug_url}/${data.id}`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: data.image,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.name,
      description: data.description,
      images: data.image,
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
}

export default async function CohortDetailsPage({
  params,
}: CohortDetailsPageProps) {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  // --- Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  // --- Check User Session for Header Navbar
  let userData:
    | Awaited<ReturnType<typeof trpc.auth.checkSession>>["user"]
    | null = null;
  if (sessionToken) {
    setSessionToken(sessionToken);
    const checkUser = await trpc.auth.checkSession();
    userData = checkUser.user;
  }

  // Get Data
  setSecretKey(secretKey!);
  const cohortDetails = await trpc.read.cohort({ id: cohortId });
  const data = cohortDetails.cohort;

  return (
    <React.Fragment>
      <HeaderNavbarSVP
        userAvatar={userData?.avatar ?? null}
        userRole={userData?.role_id}
        isLoggedIn={!!userData}
      />
      <div className="w-full">
        <CohortSBBPBatch7SVP />
      </div>
    </React.Fragment>
  );
}
