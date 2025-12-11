import UserListCMS from "@/app/components/indexes/UserListCMS";
import { setSessionToken } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function UsersPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return <UserListCMS sessionToken={sessionToken} />;
}
