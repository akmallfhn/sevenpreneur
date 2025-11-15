import CohortListCMS from "@/app/components/indexes/CohortListCMS";
import ForbiddenComponent from "@/app/components/state/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function CohortsPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const userSession = await trpc.auth.checkSession();
  const allowedRolesListCohort = [0, 1, 2, 3];

  if (!allowedRolesListCohort.includes(userSession.user.role_id)) {
    return (
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <CohortListCMS
        sessionToken={sessionToken}
        sessionUserRole={userSession.user.role_id}
      />
    </div>
  );
}
