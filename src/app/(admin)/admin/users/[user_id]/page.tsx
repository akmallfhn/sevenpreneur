import UserDetailsCMS from "@/app/components/pages/UserDetailsCMS";
import { cookies } from "next/headers";

interface UserDetailPageProps {
  params: Promise<{ user_id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return <UserDetailsCMS sessionToken={sessionToken} userId={user_id} />;
}
