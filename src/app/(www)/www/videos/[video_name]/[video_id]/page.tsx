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

interface VideoDetailsPageProps {
  params: Promise<{ video_name: string; video_id: string }>;
}

export default async function VideoDetailsPage({
  params,
}: VideoDetailsPageProps) {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { video_id } = await params;
  const videoId = parseInt(video_id);

  // Get Data
  // setSecretKey(secretKey!);
  // const cohortDetails = await trpc.read.cohort({ id: cohortId });
  // const data = cohortDetails.cohort;

  return (
    <React.Fragment>
      <div className="w-full">Test</div>
    </React.Fragment>
  );
}
