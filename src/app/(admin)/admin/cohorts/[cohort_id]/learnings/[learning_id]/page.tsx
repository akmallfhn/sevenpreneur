import LearningDetailsCMS from "@/app/components/pages/LearningDetailsCMS";
import ForbiddenComponent from "@/app/components/states/403Forbidden";
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
  const allowedRolesDetailsLearning = [0, 1, 2];

  if (!allowedRolesDetailsLearning.includes(userSession.user.role_id)) {
    return (
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <LearningDetailsCMS
        sessionToken={sessionToken}
        sessionUserRole={userSession.user.role_id}
        cohortId={cohortId}
        learningId={learningId}
      />
    </div>
  );
}
