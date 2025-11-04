import MarketSizeReportLMS from "@/app/components/reports/MarketSizeReportLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface AIMarketSizeResultLMSProps {
  params: Promise<{ result_id: string }>;
}

export default async function AIMarketSizeResultLMS({
  params,
}: AIMarketSizeResultLMSProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const { result_id } = await params;
  const resultId = parseInt(result_id, 10);
  const userData = (await trpc.auth.checkSession()).user;

  let aiMarketSizeResultLMS;
  try {
    aiMarketSizeResultLMS = (await trpc.read.ai.marketSize({ id: resultId }))
      .result;
  } catch (error) {
    return notFound();
  }

  return (
    <MarketSizeReportLMS
      tamValue={aiMarketSizeResultLMS.result.TAM_insight.TAM_value}
      samValue={aiMarketSizeResultLMS.result.SAM_insight.SAM_value}
    />
  );
}
