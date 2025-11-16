import IdeaValidationReportLMS from "@/app/components/reports/IdeaValidationReportLMS";
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

  console.log(
    "AI Idea Validation Result:",
    aiIdeaValidationResult.result.problem_validation.affected_users
  );

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
        aiIdeaValidationResult.result.problem_validation.discovery
      }
      sources={aiIdeaValidationResult.result.problem_validation.sources}
      confidenceLevel={
        aiIdeaValidationResult.result.problem_validation.confidence_level
      }
    />
  );
}
