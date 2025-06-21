import Link from "next/link";
import { cookies } from "next/headers";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { ChevronRight, PlusCircle } from "lucide-react";
import UserListCMS from "@/app/components/templates/UserListCMS";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";

export default async function UserListPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
      <UserListCMS sessionToken={sessionToken} />
    </div>
  );
}
