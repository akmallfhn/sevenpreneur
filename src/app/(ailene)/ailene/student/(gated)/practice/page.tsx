import PracticeStudentAILN from "@/components/pages/PracticeStudentAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Tugas",
};

export default async function StudentPracticePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return <PracticeStudentAILN sessionToken={sessionToken} />;
}
