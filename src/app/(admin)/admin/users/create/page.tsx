import CreateUserForm from "@/app/components/forms/CreateUserFormCMS";
import { cookies } from "next/headers";

export default async function CreateUserPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <CreateUserForm sessionToken={sessionToken} />
    </div>
  );
}
