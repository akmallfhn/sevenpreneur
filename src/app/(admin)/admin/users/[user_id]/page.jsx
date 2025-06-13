import Link from "next/link";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import AppButton from "@/app/components/elements/AppButton";
import { Settings2 } from "lucide-react";
import UserProfileDetailCMS from "@/app/components/templates/UserProfileDetailCMS";
import { cookies } from "next/headers";
import { use } from "react";

export default async function UserDetailPage({ params }) {
  const { user_id } = await params;
  console.log("user_id:", user_id);

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  return (
    <div className="root flex w-full h-full justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
      <div className="index-article w-[1040px] flex flex-col gap-4">
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <div className="page-title-actions flex justify-between items-center">
            {/* --- Page Title */}
            <TitleRevealCMS
              titlePage={"Detail Profile"}
              descPage={
                "Everything you need to know about your users — all in one centralized, easy-to-manage screen."
              }
            />
            {/* --- Page Actions */}
            <Link href={"/users/create"} className="w-fit h-fit">
              <AppButton variant="cmsPrimary">
                <Settings2 className="size-5" />
                Edit Profile
              </AppButton>
            </Link>
          </div>
        </div>

        {/* --- PROFILE USER */}
        <UserProfileDetailCMS sessionToken={sessionToken} userId={user_id} />
      </div>
    </div>
  );
}
