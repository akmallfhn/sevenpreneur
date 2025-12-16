import { createTRPCRouter } from "@/trpc/init";
import { useAITool } from "./ai_tool/use.ai_tool";

export const useRouter = createTRPCRouter({
  // AI tools //
  ai: {
    ideaValidation: useAITool.ideaValidation,
    marketSize: useAITool.marketSize,
    competitorGrading: useAITool.competitorGrading,
    COGSStructure: useAITool.COGSStructure,
    pricingStrategy: useAITool.pricingStrategy,
    submissionAnalysis: useAITool.submissionAnalysis,
    sendChat: useAITool.sendChat,
  },
});
