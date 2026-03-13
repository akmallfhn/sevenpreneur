import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function AccountPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;
  const userId = userData.id;

  return <div>{userId}</div>;
}
