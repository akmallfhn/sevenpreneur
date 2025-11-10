import GenerateAIChatLMS from "@/app/components/forms/GenerateAIChatLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function AIChatLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const hasAIAccess = await trpc.check.aiTools();
  if (!hasAIAccess) return notFound();

  const userData = (await trpc.auth.checkSession()).user;

  return <GenerateAIChatLMS />;
}
