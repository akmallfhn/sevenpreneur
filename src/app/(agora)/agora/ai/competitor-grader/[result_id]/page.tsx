import CompetitorGradingReportLMS from "@/app/components/reports/CompetitorGradingReportLMS";
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
  } catch (error) {
    return notFound();
  }

  const aiCompetitorGradingResult = aiCompetitorGradingData.result;

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
    />
  );
}
