import SidebarChampionAILN from "@/components/navigations/SidebarChampionAILN";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function ChampionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <>
      <SidebarChampionAILN sessionToken={sessionToken} />
      {children}
    </>
  );
}
