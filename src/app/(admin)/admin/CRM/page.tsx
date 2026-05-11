import CrmKanbanCMS from "@/components/indexes/CrmKanbanCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function CrmPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization — only role_id 0 (Administrator) allowed
  const userSession = await trpc.auth.checkSession();
  const allowedRolesCRM = [0];

  if (!allowedRolesCRM.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <AppPageState variant="FORBIDDEN" />
      </PageContainerCMS>
    );
  }

  return <CrmKanbanCMS sessionToken={sessionToken} />;
}
