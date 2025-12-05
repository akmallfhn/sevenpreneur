import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface AICOGSPriceResultLMSProps {
  params: Promise<{ result_id: string }>;
}

export default async function AICOGSPricesResultLMS({
  params,
}: AICOGSPriceResultLMSProps) {
  const { result_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  let aiCOGSPriceStrategy;
  try {
    aiCOGSPriceStrategy = await trpc.read.ai.pricingStrategy({
      id: result_id,
    });
  } catch (error) {
    return notFound();
  }

  const aiCOGSPriceStrategyResult = aiCOGSPriceStrategy.result;

  return <></>;
}
