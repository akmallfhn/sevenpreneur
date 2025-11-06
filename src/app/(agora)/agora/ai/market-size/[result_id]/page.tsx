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
  const userData = (await trpc.auth.checkSession()).user;

  let aiMarketSizeData;
  try {
    aiMarketSizeData = await trpc.read.ai.marketSize({ id: result_id });
  } catch (error) {
    return notFound();
  }

  const aiMarketSizeResult = aiMarketSizeData.result;

  return (
    <MarketSizeReportLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      resultName={aiMarketSizeResult.name}
      productName={"Your Product"}
      tamValue={aiMarketSizeResult.result.TAM_insight.TAM_value}
      samValue={aiMarketSizeResult.result.SAM_insight.SAM_value}
      tamInsight={aiMarketSizeResult.result.TAM_insight.remarks}
      samInsight={aiMarketSizeResult.result.SAM_insight.remarks}
      somInsight={aiMarketSizeResult.result.SOM_insight.remarks}
      sources={aiMarketSizeResult.result.TAM_insight.sources}
      confidenceLevel={aiMarketSizeResult.result.TAM_insight.confidence_level}
    />
  );
}
