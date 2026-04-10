import EditUserForm from "@/components/forms/EditUserFormCMS";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import ForbiddenComponent from "@/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface EditUserPageProps {
  params: Promise<{ user_id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization
  const userSession = await trpc.auth.checkSession();
  const allowedRolesUpdateUser = [0];

  if (!allowedRolesUpdateUser.includes(userSession.user.role_id)) {
    return (
      <PageContainerCMS>
        <ForbiddenComponent />
      </PageContainerCMS>
    );
  }

  return <EditUserForm sessionToken={sessionToken} userId={user_id} />;
}
