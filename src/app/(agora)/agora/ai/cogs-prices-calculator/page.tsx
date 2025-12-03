import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function AICOGSPricesCalculatorLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const hasAIAccess = await trpc.check.aiTools();
  if (!hasAIAccess) return notFound();

  const userData = (await trpc.auth.checkSession()).user;

  return <></>;
}
