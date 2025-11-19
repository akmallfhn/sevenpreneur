import SubmissionListCMS from "@/app/components/indexes/SubmissionListCMS";
import ForbiddenComponent from "@/app/components/state/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface LearningDetailPageProps {
  params: Promise<{ cohort_id: string; project_id: string }>;
}

export default async function SubmissionsPageCMS({
  params,
}: LearningDetailPageProps) {
  const { cohort_id, project_id } = await params;
  const cohortId = parseInt(cohort_id);
  const projectId = parseInt(project_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesListSubmission = [0, 1, 2, 3];

  if (!allowedRolesListSubmission.includes(userSession.user.role_id)) {
    return (
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <SubmissionListCMS
        sessionToken={sessionToken}
        sessionUserRole={userSession.user.role_id}
        cohortId={cohortId}
        projectId={projectId}
      />
    </div>
  );
}
