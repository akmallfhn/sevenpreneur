"use client";
import { trpc } from "@/trpc/client";
import UserItemCMS from "../items/UserItemCMS";
import { Loader2 } from "lucide-react";

interface EnrolledUserListCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function EnrolledUserListCMS({
  sessionToken,
  cohortId,
}: EnrolledUserListCMSProps) {
  // Call data from tRPC
  const {
    data: enrolledUser,
    isError,
    isLoading,
  } = trpc.list.cohortMembers.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );
  const enrolledUserList = enrolledUser?.list;

  return (
    <div className="enrolled-user flex flex-col gap-3 p-3 bg-section-background rounded-md">
      <h2 className="label-name font-brand font-bold">Enrolled Users</h2>
      {isLoading && (
        <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}
      {(!enrolledUserList || enrolledUserList.length === 0) && (
        <div className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}
      <div className="user-list flex flex-col w-full gap-4 bg-white rounded-md p-4 max-h-[320px] overflow-y-auto">
        {enrolledUserList?.map((post) => (
          <UserItemCMS
            key={post.id}
            userId={post.id}
            userName={post.full_name}
            userAvatar={
              post.avatar ||
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
            }
            userEmail={post.email}
            userPhoneNumber={post.phone_number || ""}
          />
        ))}
      </div>
    </div>
  );
}
