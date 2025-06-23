import CohortListCMS from "@/app/components/templates/CohortListCMS";
import { cookies } from "next/headers";

export default async function CohortListPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
      <CohortListCMS sessionToken={sessionToken} />
    </div>
  );
}
