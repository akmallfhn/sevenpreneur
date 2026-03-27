import HomeCMS from "@/app/components/pages/HomeCMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function HomePageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const checkSession = await trpc.auth.checkSession();
  const sessionUser = checkSession.user;

  return <HomeCMS sessionUserName={sessionUser.full_name} />;
}
