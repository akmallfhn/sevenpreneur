import CohortDetailsCMS from "@/app/components/pages/CohortDetailsCMS";
import { cookies } from "next/headers";

interface CohortDetailPageProps {
  params: Promise<{ cohort_id: string }>;
}

export default async function CohortDetailsPage({
  params,
}: CohortDetailPageProps) {
  const { cohort_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";
  const cohortId = parseInt(cohort_id);

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <CohortDetailsCMS sessionToken={sessionToken} cohortId={cohortId} />
    </div>
  );
}
