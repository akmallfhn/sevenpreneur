import CohortListCMS from "@/components/indexes/CohortListCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function CohortsPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userSession = await trpc.auth.checkSession();
  const allowedRolesListCohort = [
    "Administrator",
    "Super Admin",
    "Educator",
    "Class Manager",
  ];

  if (!allowedRolesListCohort.includes(userSession.user.role_name)) {
    return (
      <PageContainerCMS>
        <AppPageState variant="FORBIDDEN" />
      </PageContainerCMS>
    );
  }

  return (
    <CohortListCMS
      sessionToken={sessionToken}
      sessionUserRoleName={userSession.user.role_name}
    />
  );
}
