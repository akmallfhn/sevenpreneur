import CohortDetailsLMS from "@/app/components/pages/CohortDetailsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

interface CohortDetailsPageLMSProps {
  params: Promise<{ cohort_id: string }>;
}

export default async function CohortDetailsPageLMS({
  params,
}: CohortDetailsPageLMSProps) {
  // Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  // Fetch tRPC
  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id, 10);
  const userData = (await trpc.auth.checkSession()).user;

  let enrolledCohortDetails;
  try {
    enrolledCohortDetails = await trpc.read.enrolledCohort({
      id: cohortId,
    });
  } catch (error) {
    return notFound();
  }

  if (!enrolledCohortDetails) {
    return notFound();
  }

  const learningListRaw = (await trpc.list.learnings({ cohort_id: cohortId }))
    .list;
  const learningList = learningListRaw.map((item) => ({
    ...item,
    meeting_date: item.meeting_date ? item.meeting_date.toISOString() : "",
  }));

  return (
    <CohortDetailsLMS
      userName={userData.full_name}
      userAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      userRole={userData.role_id}
      cohortName={enrolledCohortDetails.cohort.cohort.name}
      learningList={learningList}
    />
  );
}
