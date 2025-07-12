import AppButton from "@/app/components/buttons/AppButton";
import { trpc } from "@/trpc/server";
import Link from "next/link";

interface CohortDetailsPageProps {
  params: Promise<{ cohort_name: string; cohort_id: string }>;
}

export default async function CohortDetailsPage({
  params,
}: CohortDetailsPageProps) {
  const { cohort_name, cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  const cohortDetails = await trpc.read.cohort({ id: cohortId });
  const data = cohortDetails.cohort;
  console.log("data:", cohortDetails);

  return (
    <div className="w-full h-[700px]">
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <Link href={`/cohort/${cohort_name}/${cohort_id}/checkout`}>
        <AppButton>Buy</AppButton>
      </Link>
    </div>
  );
}
