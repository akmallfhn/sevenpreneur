import PlaylistDetailsSVP from "@/app/components/pages/PlaylistDetailsSVP";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface PlaylistDetailsPageProps {
  params: Promise<{ playlist_name: string; playlist_id: string }>;
}

export default async function PlaylistDetailsPage({
  params,
}: PlaylistDetailsPageProps) {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { playlist_id } = await params;
  const playlistId = parseInt(playlist_id);

  // Get Data
  // setSecretKey(secretKey!);
  // const cohortDetails = await trpc.read.cohort({ id: cohortId });
  // const data = cohortDetails.cohort;

  return <PlaylistDetailsSVP />;
}
