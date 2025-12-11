import CompetitorGradingReportLMS from "@/app/components/reports/CompetitorGradingReportLMS";
import { AICompetitorGrader_MarketMaturity } from "@/trpc/routers/ai_tool/enum.ai_tool";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface AICompetitorGraderResultLMSProps {
  params: Promise<{ result_id: string }>;
}

export default async function AICompetitorGraderResultLMS({
  params,
}: AICompetitorGraderResultLMSProps) {
  const { result_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  let aiCompetitorGradingData;
  try {
    aiCompetitorGradingData = await trpc.read.ai.competitorGrading({
      id: result_id,
    });
  } catch {
    return notFound();
  }

  const aiCompetitorGradingResult = aiCompetitorGradingData.result;

  const projection = (aiCompetitorGradingResult.result?.industry_analysis.CAGR
    .projection ?? {}) as Record<string, number>;
  const years = [2024, 2025, 2026, 2027, 2028];

  const aiCAGRprojection = years.map((year) => projection[year]);

  return (
    <CompetitorGradingReportLMS
      sessionToken={sessionToken}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      resultId={result_id}
      resultName={aiCompetitorGradingResult.name}
      resultStatus={aiCompetitorGradingResult.is_done}
      productName={aiCompetitorGradingResult.result?.product_name ?? ""}
      productXPosition={
        aiCompetitorGradingResult.result?.competitor_analysis.user_product.x ??
        0
      }
      productYPosition={
        aiCompetitorGradingResult.result?.competitor_analysis.user_product.y ??
        0
      }
      industryCurrentCondition={
        aiCompetitorGradingResult.result?.industry_analysis.current_condition ??
        ""
      }
      industryCAGRValue={aiCAGRprojection ?? []}
      industryCAGRReason={
        aiCompetitorGradingResult.result?.industry_analysis.CAGR.reason ?? ""
      }
      industryMarketMaturity={
        aiCompetitorGradingResult.result?.industry_analysis.market_maturity
          .status as AICompetitorGrader_MarketMaturity
      }
      industryMarketMaturityReason={
        aiCompetitorGradingResult.result?.industry_analysis.market_maturity
          .reason ?? ""
      }
      competitorList={
        aiCompetitorGradingResult.result?.competitor_analysis.competitors ?? []
      }
      xLeftAttribute={
        aiCompetitorGradingResult.result?.competitor_analysis.attributes.x
          .left ?? ""
      }
      xRightAttribute={
        aiCompetitorGradingResult.result?.competitor_analysis.attributes.x
          .right ?? ""
      }
      yTopAttribute={
        aiCompetitorGradingResult.result?.competitor_analysis.attributes.y
          .top ?? ""
      }
      yBottomAttribute={
        aiCompetitorGradingResult.result?.competitor_analysis.attributes.y
          .bottom ?? ""
      }
      growthOpportunity={
        aiCompetitorGradingResult.result?.competitor_analysis
          .room_of_growth_opportunity ?? ""
      }
      sources={
        aiCompetitorGradingResult.result?.industry_analysis.sources ?? []
      }
      confidenceLevel={
        aiCompetitorGradingResult.result?.industry_analysis
          .data_confidence_level ?? 0
      }
    />
  );
}
