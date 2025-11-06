import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyNanoid } from "@/trpc/utils/validation";
import { AIResultIdeaGeneration, AIResultMarketSize } from "./prompt.ai_tool";
import {
  AI_TOOL_ID_IDEA_GEN,
  AI_TOOL_ID_MARKET_SIZE,
  isEnrolledAITool,
} from "./util.ai_tool";

export const readAIResult = {
  ideaGeneration: loggedInProcedure
    .input(objectHasOnlyNanoid())
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const theAIResult = await opts.ctx.prisma.aIResult.findFirst({
        select: { name: true, result: true, created_at: true },
        where: {
          id: opts.input.id,
          user_id: opts.ctx.user.id,
          ai_tool_id: AI_TOOL_ID_IDEA_GEN,
        },
      });
      if (!theAIResult) {
        throw readFailedNotFound("AI result (idea generation)");
      }

      return {
        code: STATUS_OK,
        message: "Success",
        result: {
          name: theAIResult.name,
          result: theAIResult.result as AIResultIdeaGeneration,
          created_at: theAIResult.created_at,
        },
      };
    }),

  marketSize: loggedInProcedure
    .input(objectHasOnlyNanoid())
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const theAIResult = await opts.ctx.prisma.aIResult.findFirst({
        select: { name: true, result: true, created_at: true },
        where: {
          id: opts.input.id,
          user_id: opts.ctx.user.id,
          ai_tool_id: AI_TOOL_ID_MARKET_SIZE,
        },
      });
      if (!theAIResult) {
        throw readFailedNotFound("AI result (market size)");
      }

      return {
        code: STATUS_OK,
        message: "Success",
        result: {
          name: theAIResult.name,
          result: theAIResult.result as AIResultMarketSize,
          created_at: theAIResult.created_at,
        },
      };
    }),
};
