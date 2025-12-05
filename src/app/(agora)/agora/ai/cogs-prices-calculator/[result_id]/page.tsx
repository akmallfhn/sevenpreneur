import COGSPricesCalculationReportLMS from "@/app/components/reports/COGSPricesCalculationReportLMS";
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

  return (
    <COGSPricesCalculationReportLMS
      sessionToken={sessionToken}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      resultId={result_id}
      resultName={aiCOGSPriceStrategyResult.name}
      resultStatus={aiCOGSPriceStrategyResult.is_done}
      estimatedPriceByValue={
        aiCOGSPriceStrategyResult.result?.prices.value_based.estimated_price ??
        0
      }
      estimatedPriceByCost={
        aiCOGSPriceStrategyResult.result?.prices.cost_based.estimated_price ?? 0
      }
      estimatedPriceByCompetition={
        aiCOGSPriceStrategyResult.result?.prices.competition_based
          .estimated_price ?? 0
      }
      valueCommunication={
        aiCOGSPriceStrategyResult.result?.prices.value_based.value_communication
          .recommendations ?? ""
      }
      variableCostPerUnit={
        aiCOGSPriceStrategyResult.result?.total_cost.variable_cost ?? 0
      }
      fixedCostPerPeriod={
        aiCOGSPriceStrategyResult.result?.total_cost.fixed_cost ?? 0
      }
      productionPerPeriod={
        aiCOGSPriceStrategyResult.result?.production_per_month ?? 0
      }
    />
  );
}
