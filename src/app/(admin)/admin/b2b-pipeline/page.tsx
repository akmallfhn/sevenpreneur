import B2BPipelineListCMS from "@/components/indexes/B2BPipelineListCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function B2BPipelinePageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization
  const userSession = await trpc.auth.checkSession();
  const allowedRolesListB2BPipeline = ["Administrator", "Super Admin"];

  if (!allowedRolesListB2BPipeline.includes(userSession.user.role_name)) {
    return (
      <PageContainerCMS>
        <AppPageState variant="FORBIDDEN" />
      </PageContainerCMS>
    );
  }

  return <B2BPipelineListCMS sessionToken={sessionToken} />;
}
