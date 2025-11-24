import IdeaValidationReportLMS from "@/app/components/reports/IdeaValidationReportLMS";
import {
  AIIdeaValidation_LongevityAlignment,
  AIIdeaValidation_ProblemFreq,
} from "@/trpc/routers/ai_tool/enum.ai_tool";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface AIIdeaValidatorResultLMSProps {
  params: Promise<{ result_id: string }>;
}

export default async function AIIdeaValidatorResultLMS({
  params,
}: AIIdeaValidatorResultLMSProps) {
  const { result_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

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
      sessionToken={sessionToken}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      resultId={result_id}
      resultName={aiIdeaValidationResult.name}
      resultStatus={aiIdeaValidationResult.is_done}
      problemDiscovery={
        aiIdeaValidationResult?.result?.problem_fit.validation.discovery ?? ""
      }
      problemFrequency={
        aiIdeaValidationResult?.result?.problem_fit.validation
          .frequency as AIIdeaValidation_ProblemFreq
      }
      problemFitScore={
        aiIdeaValidationResult?.result?.problem_fit.final_problem_fit_score ?? 0
      }
      affectedSegments={
        aiIdeaValidationResult?.result?.problem_fit.validation
          .affected_segments ?? []
      }
      problemFactor={
        aiIdeaValidationResult?.result?.problem_fit.validation.key_factor ?? ""
      }
      existingAlternatives={
        aiIdeaValidationResult?.result?.problem_fit.validation
          .existing_alternatives ?? ""
      }
      sources={
        aiIdeaValidationResult?.result?.problem_fit.validation.sources ?? []
      }
      confidenceLevel={
        aiIdeaValidationResult?.result?.problem_fit.validation
          .data_confidence_level ?? 0
      }
      solutionFitScore={
        aiIdeaValidationResult?.result?.solution_fit.final_solution_fit_score ??
        0
      }
      solutionValue={
        aiIdeaValidationResult?.result?.solution_fit.validation
          .value_proposition ?? ""
      }
      solutionFeasibility={
        aiIdeaValidationResult?.result?.solution_fit.validation
          .feasibility_analysis ?? ""
      }
      industryDirection={
        aiIdeaValidationResult?.result?.solution_fit.validation
          .industry_direction ?? ""
      }
      longevityAlignment={
        aiIdeaValidationResult?.result?.solution_fit.validation
          .longevity_alignment as AIIdeaValidation_LongevityAlignment
      }
      longevityReason={
        aiIdeaValidationResult?.result?.solution_fit.validation
          .longevity_reason ?? ""
      }
      ideaMarketRecommendation={
        aiIdeaValidationResult?.result?.idea_refinement
          .market_alignment_suggestions ?? ""
      }
      ideaCompetitiveRecommendation={
        aiIdeaValidationResult?.result?.idea_refinement
          .competitive_advantage_suggestions ?? ""
      }
      ideaResourceRecommendation={
        aiIdeaValidationResult?.result?.idea_refinement
          .resource_based_recommendation ?? ""
      }
      ideaPriorityFocus={
        aiIdeaValidationResult?.result?.idea_refinement.priority_focus ?? ""
      }
      ideaNextStep={
        aiIdeaValidationResult?.result?.idea_refinement.next_validation_steps ??
        []
      }
    />
  );
}
