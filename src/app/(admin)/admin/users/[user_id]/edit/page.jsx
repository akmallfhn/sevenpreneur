import { cookies } from "next/headers";
import EditUserForm from "@/app/components/forms/EditUserFormCMS";

export default async function EditUserPage({ params }) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
      <EditUserForm sessionToken={sessionToken} userId={user_id} />
    </div>
  );
}
