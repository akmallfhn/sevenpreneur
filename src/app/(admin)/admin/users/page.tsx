import { cookies } from "next/headers";
import UserListCMS from "@/app/components/indexes/UserListCMS";

export default async function UserListPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
      <UserListCMS sessionToken={sessionToken} />
    </div>
  );
}
