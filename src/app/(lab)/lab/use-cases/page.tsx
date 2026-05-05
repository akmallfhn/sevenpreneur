import UseCasesLab from "@/components/pages/UseCasesLab";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Use Cases" };

export default async function UseCasesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);
  return <UseCasesLab sessionToken={sessionToken} />;
}
