import AppButton from "@/app/components/buttons/AppButton";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CohortDetailsPageProps {
  params: Promise<{ cohort_name: string; cohort_id: string }>;
}

export default async function CohortDetailsPage({
  params,
}: CohortDetailsPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  const { cohort_name, cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  // --- Checking Access
  setSessionToken(sessionToken);
  const checkUser = (await trpc.auth.checkSession()).user;
  if (checkUser.role_id !== 0) {
    return notFound();
  }

  const cohortDetails = await trpc.read.cohort({ id: cohortId });
  const data = cohortDetails.cohort;

  return (
    <div className="w-full h-[700px]">
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <Link href={`/cohorts/${cohort_name}/${cohort_id}/checkout`}>
        <AppButton>Buy</AppButton>
      </Link>
    </div>
  );
}
