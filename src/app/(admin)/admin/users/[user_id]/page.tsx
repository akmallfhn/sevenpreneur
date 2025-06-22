import UserProfileDetailCMS from "@/app/components/templates/UserProfileDetailCMS";
import { cookies } from "next/headers";

interface UserDetailPageProps {
  params: Promise<{ user_id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root flex w-full h-full justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
      <UserProfileDetailCMS sessionToken={sessionToken} userId={user_id} />
    </div>
  );
}
