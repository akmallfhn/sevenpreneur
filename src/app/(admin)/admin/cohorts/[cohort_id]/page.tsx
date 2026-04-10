import CohortDetailsCMS from "@/components/pages/CohortDetailsCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import ForbiddenComponent from "@/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface CohortDetailPageProps {
  params: Promise<{ cohort_id: string }>;
}

export default async function CohortDetailsPage({
  params,
}: CohortDetailPageProps) {
  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesDetailsCohort = [0, 1, 2];

  if (!allowedRolesDetailsCohort.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <ForbiddenComponent />
      </PageContainerCMS>
    );
  }

  return (
    <CohortDetailsCMS
      sessionToken={sessionToken}
      sessionUserRole={userSession.user.role_id}
      cohortId={cohortId}
    />
  );
}
