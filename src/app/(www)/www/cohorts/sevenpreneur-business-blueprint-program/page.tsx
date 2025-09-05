import React from "react";
import { setSecretKey, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlueprintProgramSVP from "@/app/components/pages/BlueprintProgramSVP";

export async function generateMetadata(): Promise<Metadata> {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;

  // Get Data
  setSecretKey(secretKey!);
  const cohortData = (await trpc.read.cohort({ id: 36 })).cohort;

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
      canonical: `/cohorts/sevenpreneur-business-blueprint-program`,
    },
    openGraph: {
      title: `${cohortData.name} | Sevenpreneur`,
      description: cohortData.description,
      url: `/cohorts/sevenpreneur-business-blueprint-program`,
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

export default async function BlueprintProgramPage() {
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

  return <BlueprintProgramSVP />;
}
