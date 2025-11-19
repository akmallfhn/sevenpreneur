import { cookies } from "next/headers";
import UserListCMS from "@/app/components/indexes/UserListCMS";
import { setSessionToken } from "@/trpc/server";

export default async function UsersPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <UserListCMS sessionToken={sessionToken} />
    </div>
  );
}
