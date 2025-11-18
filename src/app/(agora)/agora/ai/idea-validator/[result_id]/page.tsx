import IdeaValidationReportLMS from "@/app/components/reports/IdeaValidationReportLMS";
import { AIIdeaValidation_ProblemFreq } from "@/trpc/routers/ai_tool/enum.ai_tool";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface AIIdeaValidatorResultLMSProps {
  params: Promise<{ result_id: string }>;
}

export default async function AIIdeaValidatorResultLMS({
  params,
}: AIIdeaValidatorResultLMSProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const { result_id } = await params;
  const userData = (await trpc.auth.checkSession()).user;

  let aiIdeaValidationData;
  try {
    aiIdeaValidationData = await trpc.read.ai.ideaValidation({ id: result_id });
  } catch (error) {
    return notFound();
  }

  const aiIdeaValidationResult = aiIdeaValidationData.result;

  return (
    <IdeaValidationReportLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      resultName={aiIdeaValidationResult.name}
      problemDiscovery={
        aiIdeaValidationResult.result.problem_fit.validation.discovery
      }
      problemFrequency={
        aiIdeaValidationResult.result.problem_fit.validation.frequency
      }
      problemFitScore={
        aiIdeaValidationResult.result.problem_fit.final_problem_fit_score
      }
      affectedSegments={
        aiIdeaValidationResult.result.problem_fit.validation.affected_segments
      }
      problemFactors={
        aiIdeaValidationResult.result.problem_fit.validation.key_factors
      }
      existingAlternatives={
        aiIdeaValidationResult.result.problem_fit.validation
          .existing_alternatives
      }
      sources={aiIdeaValidationResult.result.problem_fit.validation.sources}
      confidenceLevel={
        aiIdeaValidationResult.result.problem_fit.validation
          .data_confidence_level
      }
    />
  );
}
