import HomeLMS from "@/app/components/pages/HomeLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function DashboardPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  return (
    <HomeLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
    />
  );
}
