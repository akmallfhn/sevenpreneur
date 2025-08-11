"use client";
import { useEffect } from "react";
import Link from "next/link";
import { setSessionToken, trpc } from "@/trpc/client";
import UserItemListCMS from "@/app/components/items/UserItemListCMS";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { ChevronRight, PlusCircle, Loader2 } from "lucide-react";

interface UserListCMSProps {
  sessionToken: string;
}

export default function UserListCMS({ sessionToken }: UserListCMSProps) {
  const utils = trpc.useUtils();

  // Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // Return data from tRPC
  const { data, isLoading, isError } = trpc.list.users.useQuery(
    { page: 1, page_size: 20 },
    { enabled: !!sessionToken }
  );
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
    <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
      {/* --- PAGE HEADER */}
      <div className="page-header flex flex-col gap-3">
        <AppBreadcrumb>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href="/users" isCurrentPage>
            Users
          </AppBreadcrumbItem>
        </AppBreadcrumb>
        <div className="page-title-actions flex justify-between items-center">
          {/* -- Page Title */}
          <TitleRevealCMS
            titlePage={"User List"}
            descPage={
              "View and manage all registered users in one place, with quick access to actions like edit or delete."
            }
          />
          {/* -- Page Actions */}
          <Link href={"/users/create"} className="w-fit h-fit">
            <AppButton variant="cmsPrimary">
              <PlusCircle className="size-5" />
              Add Account
            </AppButton>
          </Link>
        </div>
      </div>

      {/* --- TABLE */}
      <div className="table-cons flex flex-col shadow-md rounded-md">
        <div className="flex w-full bg-[#f5f5f5] px-7 py-4 text-[13px] text-alternative font-bodycopy font-semibold rounded-t-md">
          <p className="flex w-full max-w-[30vw] lg:max-w-[33vw] 2xl:max-w-[49vw]">
            USER
          </p>
          <div className="flex gap-7 items-center">
            <p className="flex max-w-[120px] w-full shrink-0 text-left">ROLE</p>
            <p className="flex max-w-[102px] w-full shrink-0 text-left">
              CREATED AT
            </p>
            <p className="flex max-w-[102px] w-full shrink-0 text-left">
              LAST LOGIN
            </p>
            <p className="flex max-w-[102px] w-full shrink-0 text-left">
              STATUS
            </p>
            <p className="flex max-w-[102px] w-full shrink-0 text-left">
              ACTIONS
            </p>
          </div>
        </div>
        <div className="table-container flex flex-col flex-wrap gap-7 p-7 w-full bg-white rounded-b-md">
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
      </div>
    </div>
  );
}
