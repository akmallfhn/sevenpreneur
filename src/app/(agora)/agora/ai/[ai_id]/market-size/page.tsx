import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface AIMarketSizePageLMSProps {
  params: Promise<{ ai_id: string; ai_name: string }>;
}

export default async function AIMarketSizePageLMS({
  params,
}: AIMarketSizePageLMSProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const { ai_id, ai_name } = await params;
  const aiId = parseInt(ai_id, 10);

  const userData = (await trpc.auth.checkSession()).user;

  const aiMarketSizeResultList = (
    await trpc.list.aiResults({
      ai_tool_slug: ai_name,
    })
  ).list;

  console.log("data:", aiMarketSizeResultList);

  let aiMarketSizeDetails;
  try {
    aiMarketSizeDetails = await trpc.read.ai.marketSize({ id: aiId });
  } catch (error) {
    return notFound();
  }

  return <></>;
}
