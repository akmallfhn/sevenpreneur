import Link from "next/link";
import { cookies } from "next/headers";
import AppButton from "@/app/components/elements/AppButton";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import { ChevronRight, PlusCircle } from "lucide-react";
import UserListCMS from "@/app/components/templates/UserListCMS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import AppBreadcrumb from "@/app/components/elements/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/elements/AppBreadcrumbItem";

export default async function UserListPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
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
            {/* --- Page Title */}
            <TitleRevealCMS
              titlePage={"List User"}
              descPage={
                "Manage your published content easily. Click on an article to view or edit its details."
              }
            />

            {/* --- Page Actions */}
            <Link href={"/users/create"} className="w-fit h-fit">
              <AppButton variant="cmsPrimary">
                <PlusCircle className="size-5" />
                Add New User
              </AppButton>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="table-cons flex flex-col shadow-md rounded-md">
          <div className="flex w-full bg-[#f5f5f5] px-7 py-4 text-[13px] text-alternative font-bodycopy font-semibold rounded-t-md">
            <p className="flex w-full max-w-[30vw] lg:max-w-[33vw] 2xl:max-w-[49vw]">
              USER
            </p>
            <div className="flex gap-7 items-center">
              <p className="flex max-w-[120px] w-full shrink-0 text-left">
                ROLE
              </p>
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
          <UserListCMS sessionToken={sessionToken} />
        </div>
      </div>
    </div>
  );
}
