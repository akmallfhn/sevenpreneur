import BlueprintProgramBatch7SVP from "@/app/components/custom-pages/BlueprintProgramBatch7SVP";
import Restart25Page from "@/app/components/custom-pages/Restart25Page";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";

import { notFound, redirect } from "next/navigation";
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
  const cohortData = (await trpc.read.cohort({ id: cohortId })).cohort;

  if (cohortData.status !== "ACTIVE") {
    return {
      title: `404 Not Found`,
      description:
        "Sorry, the page you’re looking for doesn’t exist or may have been moved.",
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  return {
    title: `${cohortData.name} | Sevenpreneur`,
    description: cohortData.description,
    keywords:
      "Sevenpreneur, Business Blueprint, Raymond Chin, Scale up business, Pengusaha naik level",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/cohorts/${cohortData.slug_url}/${cohortData.id}`,
    },
    openGraph: {
      title: `${cohortData.name} | Sevenpreneur`,
      description: cohortData.description,
      url: `/cohorts/${cohortData.slug_url}/${cohortData.id}`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: cohortData.image,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cohortData.name} | Sevenpreneur`,
      description: cohortData.description,
      images: cohortData.image,
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
  const { cohort_id, cohort_name } = await params;
  const cohortId = parseInt(cohort_id);

  // Get Data
  setSecretKey(secretKey!);
  let cohortDataRaw;
  try {
    cohortDataRaw = (await trpc.read.cohort({ id: cohortId })).cohort;
  } catch (error) {
    return notFound();
  }

  // Return 404 if INACTIVE status
  if (cohortDataRaw.status !== "ACTIVE") {
    return notFound();
  }

  // Auto Correction Slug
  const correctSlug = cohortDataRaw.slug_url;
  if (cohort_name.toLowerCase() !== correctSlug.toLowerCase()) {
    redirect(`/cohorts/${correctSlug}/${cohortId}`);
  }

  // Conditional Rendering by Landing Page
  if (cohortDataRaw.id === 36) {
    return <BlueprintProgramBatch7SVP />;
  } else if (cohortDataRaw.id === 37) {
    return <Restart25Page />;
  }

  return <div>No data</div>;
}
