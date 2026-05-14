import LearningDetailsCMS from "@/components/pages/LearningDetailsCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface LearningDetailPageProps {
  params: Promise<{ cohort_id: string; learning_id: string }>;
}

export default async function LearningDetailsPage({
  params,
}: LearningDetailPageProps) {
  const { cohort_id, learning_id } = await params;
  const cohortId = parseInt(cohort_id);
  const learningId = parseInt(learning_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesDetailsLearning = [
    "Administrator",
    "Super Admin",
    "Educator",
    "Class Manager",
  ];

  if (!allowedRolesDetailsLearning.includes(userSession.user.role_name)) {
    return (
      <PageContainerCMS>
        <AppPageState variant="FORBIDDEN" />
      </PageContainerCMS>
    );
  }

  return (
    <LearningDetailsCMS
      sessionToken={sessionToken}
      sessionUserRoleName={userSession.user.role_name}
      cohortId={cohortId}
      learningId={learningId}
    />
  );
}
