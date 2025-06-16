import Link from "next/link";
import { cookies } from "next/headers";
import AppButton from "@/app/components/elements/AppButton";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import { PlusCircle } from "lucide-react";
import UserListCMS from "@/app/components/templates/UserListCMS";

export default async function UserListPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
      <div className="index-article w-[1040px] flex flex-col gap-4">
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
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

        {/* --- TABLE  */}
        <div className="flex flex-col gap-7 bg-white pb-7 rounded-md shadow-md">
          {/* --- Column Name */}
          <div className="column-name flex px-7 p-4 items-center font-bodycopy font-semibold text-alternative text-sm bg-[#f5f5f5] border-b border-[#e3e3e3] rounded-t-md">
            <div className="max-w-[380px] w-full shrink-0 text-xs">USER</div>
            <div className="flex items-center gap-7 text-xs">
              <div className="max-w-[120px] w-full shrink-0">ROLE</div>
              <div className="max-w-[102px] w-full shrink-0">CREATED AT</div>
              <div className="max-w-[102px] w-full shrink-0">LAST LOGIN</div>
              <div className="max-w-[102px] w-full shrink-0">STATUS</div>
              <div className="max-w-[102px] w-full shrink-0">ACTIONS</div>
            </div>
          </div>

          {/* --- Row List */}
          <UserListCMS sessionToken={sessionToken} />
        </div>
      </div>
    </div>
  );
}
