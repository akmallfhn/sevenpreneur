import CohortDetailsCMS from "@/app/components/templates/CohortDetailsCMS";
import LearningDetailsCMS from "@/app/components/templates/LearningDetailsCMS";
import { cookies } from "next/headers";

interface LearningDetailPageProps {
  params: Promise<{ cohort_id: string; learning_id: string }>;
}

export default async function LearningDetailPage({
  params,
}: LearningDetailPageProps) {
  const { cohort_id, learning_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";
  const cohortId = parseInt(cohort_id);
  const learningId = parseInt(learning_id);

  console.log("learningId:", learningId);

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <LearningDetailsCMS
        sessionToken={sessionToken}
        cohortId={cohortId}
        learningId={learningId}
      />
    </div>
  );
}
