import CohortMembersPerformanceCMS from "@/components/indexes/CohortMembersPerformanceCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface MembersPageProps {
  params: Promise<{ cohort_id: string }>;
}

export default async function PerformancePage({ params }: MembersPageProps) {
  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id);

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesPerformanceList = [0, 1, 2];

  if (!allowedRolesPerformanceList.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <AppPageState variant="FORBIDDEN" />
      </PageContainerCMS>
    );
  }

  return (
    <CohortMembersPerformanceCMS
      sessionToken={sessionToken}
      sessionUserId={userSession.user.id}
      sessionUserRole={userSession.user.role_id}
      cohortId={cohortId}
    />
  );
}
