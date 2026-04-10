import UserListCMS from "@/components/indexes/UserListCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import ForbiddenComponent from "@/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function UsersPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization
  const userSession = await trpc.auth.checkSession();
  const allowedRolesListUser = [0, 1, 2];

  if (!allowedRolesListUser.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <ForbiddenComponent />
      </PageContainerCMS>
    );
  }

  return (
    <UserListCMS
      sessionToken={sessionToken}
      sessionUserRole={userSession.user.role_id}
    />
  );
}
