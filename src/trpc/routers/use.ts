import { createTRPCRouter } from "@/trpc/init";
import { useAITool } from "./ai_tool/use.ai_tool";

export const useRouter = createTRPCRouter({
  // AI tools //
  ai: {
    ideaGeneration: useAITool.ideaGeneration,
    marketSize: useAITool.marketSize,
    sendChat: useAITool.sendChat,
  },
});
