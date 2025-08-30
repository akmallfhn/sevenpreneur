import SubmissionListCMS from "@/app/components/indexes/SubmissionListCMS";
import { cookies } from "next/headers";

interface LearningDetailPageProps {
  params: Promise<{ cohort_id: string; project_id: string }>;
}

export default async function SubmissionsPageCMS({
  params,
}: LearningDetailPageProps) {
  const { cohort_id, project_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";
  const cohortId = parseInt(cohort_id);
  const projectId = parseInt(project_id);

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <SubmissionListCMS
        sessionToken={sessionToken}
        cohortId={cohortId}
        projectId={projectId}
      />
    </div>
  );
}
