import SidebarSponsorAILN from "@/components/navigations/SidebarSponsorAILN";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function SponsorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <>
      <SidebarSponsorAILN sessionToken={sessionToken} />
      {children}
    </>
  );
}
