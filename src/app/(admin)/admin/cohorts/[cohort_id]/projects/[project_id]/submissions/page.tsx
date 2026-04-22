import SubmissionListCMS from "@/components/indexes/SubmissionListCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppPageState from "@/components/states/AppPageState";
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
  const allowedRolesListSubmission = [0, 1, 2];

  if (!allowedRolesListSubmission.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <AppPageState variant="FORBIDDEN" />
      </PageContainerCMS>
    );
  }

  return (
    <SubmissionListCMS
      sessionToken={sessionToken}
      sessionUserId={userSession.user.id}
      sessionUserRole={userSession.user.role_id}
      cohortId={cohortId}
      projectId={projectId}
    />
  );
}
