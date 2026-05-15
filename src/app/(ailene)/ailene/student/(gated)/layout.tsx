import SidebarStudentAILN from "@/components/navigations/SidebarStudentAILN";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function GatedStudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Force pre-assessment completion before accessing any other student route.
  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (ailMember && !ailMember.has_pre_assessment) {
    redirect("/student/pre-assessment");
  }

  return (
    <>
      <SidebarStudentAILN sessionToken={sessionToken} />
      {children}
    </>
  );
}
