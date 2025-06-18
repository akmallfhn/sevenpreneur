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
      <div className="index-article max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
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
        <div className="table-container bg-white rounded-md shadow-md overflow-x-auto">
          <div className="table-content w-full flex flex-col">
            {/* --- Column Name */}
            <div className="column-name p-7 items-center font-bodycopy font-semibold text-alternative text-xs bg-[#f5f5f5] border-b border-[#e3e3e3] rounded-t-md">
              {/* <div className="">USER</div>
              <div className="flex items-center gap-7 ">
                <div className="">ROLE</div>
                <div className="">CREATED AT</div>
                <div className="">LAST LOGIN</div>
                <div className="">STATUS</div>
                <div className="">ACTIONS</div>
              </div> */}
            </div>

            {/* --- Row List */}
            <UserListCMS sessionToken={sessionToken} />
          </div>
        </div>
      </div>
    </div>
  );
}
