import UserProfileDetailsCMS from "@/app/components/pages/UserProfileDetailsCMS";
import { cookies } from "next/headers";
import React from "react";

interface UserDetailPageProps {
  params: Promise<{ user_id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return <UserProfileDetailsCMS sessionToken={sessionToken} userId={user_id} />;
}
