import SidebarStudentAILN from "@/components/navigations/SidebarStudentAILN";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  return (
    <>
      <SidebarStudentAILN sessionToken={sessionToken} />
      {children}
    </>
  );
}
