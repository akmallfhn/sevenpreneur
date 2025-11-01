import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { aiToolPrompts } from "./prompt.ai_tool";
import { AIGenerate, AISaveResult, isEnrolledAITool } from "./util.ai_tool";

export const useAITool = {
  ideaGeneration: loggedInProcedure.query(async (opts) => {
    if (opts.ctx.user.role.name === "General User") {
      await isEnrolledAITool(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to use AI tools."
      );
    }

    const parsedResult = await AIGenerate(aiToolPrompts.ideaGeneration);

    await AISaveResult(
      opts.ctx.prisma,
      opts.ctx.user.id,
      1, // idea-gen
      parsedResult.title,
      parsedResult.response
    );

    return {
      code: STATUS_OK,
      message: "Success",
      title: parsedResult.title,
      result: parsedResult.response,
    };
  }),
};
