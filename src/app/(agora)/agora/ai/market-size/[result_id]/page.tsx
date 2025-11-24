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
  const { result_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

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
      sessionToken={sessionToken}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      resultId={result_id}
      resultName={aiMarketSizeResult.name}
      resultStatus={aiMarketSizeResult.is_done}
      productName={aiMarketSizeResult?.result?.product_name ?? ""}
      tamValue={aiMarketSizeResult?.result?.TAM_insight.TAM_value ?? 0}
      samValue={aiMarketSizeResult?.result?.SAM_insight.SAM_value ?? 0}
      tamInsight={aiMarketSizeResult?.result?.TAM_insight.remarks ?? ""}
      samInsight={aiMarketSizeResult?.result?.SAM_insight.remarks ?? ""}
      somInsight={aiMarketSizeResult.result?.SOM_insight.remarks ?? ""}
      sources={aiMarketSizeResult?.result?.TAM_insight.sources ?? []}
      confidenceLevel={
        aiMarketSizeResult?.result?.TAM_insight.confidence_level ?? 0
      }
    />
  );
}
