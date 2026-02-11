import UserDetailsCMS from "@/app/components/pages/UserDetailsCMS";
import ForbiddenComponent from "@/app/components/states/403Forbidden";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface UserDetailPageProps {
  params: Promise<{ user_id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization
  const userSession = await trpc.auth.checkSession();
  const allowedRolesReadUser = [0, 1, 2];

  if (!allowedRolesReadUser.includes(userSession.user.role_id)) {
    return (
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  return <UserDetailsCMS sessionToken={sessionToken} userId={user_id} />;
}
