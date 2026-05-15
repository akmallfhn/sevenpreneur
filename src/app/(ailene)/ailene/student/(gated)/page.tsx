import DashboardStudentAILN from "@/components/pages/DashboardStudentAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Student",
};

export default async function StudentPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return <DashboardStudentAILN sessionToken={sessionToken} />;
}
