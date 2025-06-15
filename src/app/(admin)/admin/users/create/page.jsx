import { cookies } from "next/headers";
import Link from "next/link";
import AppButton from "@/app/components/elements/AppButton";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import { Save } from "lucide-react";
import CreateUserForm from "@/app/components/templates/UserCreateCMS";

export default async function CreateUserPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
      <div className="index-article w-[1040px] flex flex-col gap-4">
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <div className="page-title-actions flex justify-between items-center">
            {/* --- Page Title */}
            <TitleRevealCMS
              titlePage={"Add New User"}
              descPage={
                "Manage your published content easily. Click on an article to view or edit its details."
              }
            />

            {/* --- Page Actions */}
            <div className="page-actions flex items-center gap-4">
              <Link href={"/users"}>
                <AppButton variant="outline">Cancel</AppButton>
              </Link>
              <AppButton variant="cmsPrimary">
                <Save className="size-5" />
                Add New User
              </AppButton>
            </div>
          </div>
        </div>

        {/* --- CREATE USER FORM */}
        <CreateUserForm sessionToken={sessionToken} />
      </div>
    </div>
  );
}
