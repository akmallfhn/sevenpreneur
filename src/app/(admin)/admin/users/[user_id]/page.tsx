import UserProfileDetailCMS from "@/app/components/pages/UserProfileDetailCMS";
import { cookies } from "next/headers";
import React from "react";

interface UserDetailPageProps {
  params: Promise<{ user_id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { user_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <UserProfileDetailCMS sessionToken={sessionToken} userId={user_id} />
    </div>
  );
}
