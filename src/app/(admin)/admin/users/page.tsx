import { cookies } from "next/headers";
import UserListCMS from "@/app/components/indexes/UserListCMS";

export default async function UserListPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 overflow-y-auto lg:flex lg:pl-64">
      <UserListCMS sessionToken={sessionToken} />
    </div>
  );
}
