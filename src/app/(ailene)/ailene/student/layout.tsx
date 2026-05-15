import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;

  if (
    !ailMember ||
    (ailMember.role !== "STUDENT" && ailMember.role !== "CHAMPION")
  ) {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return <>{children}</>;
}
