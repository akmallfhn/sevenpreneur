import CohortListCMS from "@/components/indexes/CohortListCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import ForbiddenComponent from "@/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function CohortsPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesListCohort = [0, 1, 2];

  if (!allowedRolesListCohort.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <ForbiddenComponent />
      </PageContainerCMS>
    );
  }

  return (
    <CohortListCMS
      sessionToken={sessionToken}
      sessionUserRole={userSession.user.role_id}
    />
  );
}
