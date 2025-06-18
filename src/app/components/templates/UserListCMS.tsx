"use client";
import { useEffect } from "react";
import UserItemListCMS from "../elements/UserItemListCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";

interface UserListCMSProps {
  sessionToken: string;
}

export default function UserListCMS({ sessionToken }: UserListCMSProps) {
  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Trigger to refetch component
  const utils = trpc.useUtils();

  // --- Return data from tRPC
  const { data, isLoading, isError } = trpc.list.users.useQuery(undefined, {
    enabled: !!sessionToken,
  });
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 p-7">
      {data?.list.map((post, index) => (
        <UserItemListCMS
          key={index}
          sessionToken={sessionToken}
          userId={post.id}
          userName={post.full_name}
          userEmail={post.email}
          userAvatar={post.avatar ?? undefined}
          userRole={post.role_name}
          userStatus={post.status}
          createdAt={post.created_at}
          lastLogin={post.last_login}
          onDeleteSuccess={() => utils.list.users.invalidate()}
        />
      ))}
    </div>
  );
}
