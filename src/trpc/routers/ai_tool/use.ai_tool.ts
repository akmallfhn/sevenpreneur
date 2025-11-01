import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { stringNotBlank } from "@/trpc/utils/validation";
import z from "zod";
import {
  AIMarketSize_CustomerType,
  AIMarketSize_ProductType,
  aiToolPrompts,
} from "./prompt.ai_tool";
import { AIGenerate, AISaveResult, isEnrolledAITool } from "./util.ai_tool";

export const useAITool = {
  ideaGeneration: loggedInProcedure
    .input(
      z.object({
        count: z.number().min(1).max(5),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const parsedResult = await AIGenerate(
        aiToolPrompts.ideaGeneration(opts.input.count)
      );

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

  marketSize: loggedInProcedure
    .input(
      z.object({
        additional_persona: stringNotBlank().optional(),
        product_name: stringNotBlank(),
        description: stringNotBlank(),
        product_type: z.enum(AIMarketSize_ProductType),
        customer_type: z.enum(AIMarketSize_CustomerType),
        company_operating_area: stringNotBlank(),
        sales_channel: stringNotBlank(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const parsedResult = await AIGenerate(
        aiToolPrompts.marketSize(
          opts.input.additional_persona || "",
          opts.input.product_name,
          opts.input.description,
          opts.input.product_type,
          opts.input.customer_type,
          opts.input.company_operating_area,
          opts.input.sales_channel
        )
      );

      await AISaveResult(
        opts.ctx.prisma,
        opts.ctx.user.id,
        2, // market-size
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
