import { createTRPCRouter } from "@/trpc/init";
import { checkAITool } from "./ai_tool/check.ai_tool";

export const checkRouter = createTRPCRouter({
  // AI tools //
  aiTools: checkAITool.aiTools,
});
