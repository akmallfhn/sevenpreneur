import { cookies } from "next/headers";
import EditUserForm from "@/app/components/forms/EditUserFormCMS";

interface EditUserPageProps {
  params: Promise<{ user_id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <EditUserForm sessionToken={sessionToken} userId={user_id} />
    </div>
  );
}
