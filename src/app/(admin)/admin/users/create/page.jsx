import { cookies } from "next/headers";
import CreateUserForm from "@/app/components/templates/UserCreateCMS";

export default async function CreateUserPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
      <CreateUserForm sessionToken={sessionToken} />
    </div>
  );
}
