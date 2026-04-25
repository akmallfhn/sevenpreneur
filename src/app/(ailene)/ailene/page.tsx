import HomeAilene from "@/components/pages/HomeAilene";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function AilenePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const checkSession = await trpc.auth.checkSession();
  return <HomeAilene sessionUserName={checkSession.user.full_name} />;
}
