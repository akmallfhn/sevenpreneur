import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsNanoid, stringNotBlank } from "@/trpc/utils/validation";
import z from "zod";
import {
  AIMarketSize_CustomerType,
  AIMarketSize_ProductType,
} from "./enum.ai_tool";
import { aiToolPrompts } from "./prompt.ai_tool";
import {
  AI_TOOL_ID_IDEA_GEN,
  AI_TOOL_ID_MARKET_SIZE,
  AIChatRole,
  AIGenerate,
  AIModelName,
  AISaveMessage,
  AISaveResult,
  AISendChat,
  isEnrolledAITool,
} from "./util.ai_tool";

export const useAITool = {
  ideaGeneration: loggedInProcedure
    .input(
      z.object({
        model: z.enum(AIModelName),
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
        opts.input.model,
        aiToolPrompts.ideaGeneration(opts.input.count)
      );

      const resultId = await AISaveResult(
        opts.ctx.prisma,
        opts.ctx.user.id,
        AI_TOOL_ID_IDEA_GEN,
        parsedResult.title,
        parsedResult.response
      );

      return {
        code: STATUS_OK,
        message: "Success",
        id: resultId,
        title: parsedResult.title,
        result: parsedResult.response,
      };
    }),

  marketSize: loggedInProcedure
    .input(
      z.object({
        model: z.enum(AIModelName),
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
        opts.input.model,
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

      const formattedResult = {
        product_name: opts.input.product_name,
        ...parsedResult.response,
      };

      const resultId = await AISaveResult(
        opts.ctx.prisma,
        opts.ctx.user.id,
        AI_TOOL_ID_MARKET_SIZE,
        parsedResult.title,
        formattedResult
      );

      return {
        code: STATUS_OK,
        message: "Success",
        id: resultId,
        title: parsedResult.title,
        result: formattedResult,
      };
    }),

  sendChat: loggedInProcedure
    .input(
      z.object({
        model: z.enum(AIModelName),
        conv_id: stringIsNanoid(),
        message: stringNotBlank(),
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

      const theConversation = await opts.ctx.prisma.aIConversation.findFirst({
        where: {
          id: opts.input.conv_id,
          user_id: opts.ctx.user.id,
        },
      });
      if (!theConversation) {
        throw readFailedNotFound("conversation");
      }

      const chatId = await AISaveMessage(
        opts.ctx.prisma,
        opts.ctx.user.id,
        opts.input.conv_id,
        "user",
        opts.input.message
      );

      const aiChatsList = await opts.ctx.prisma.aIChat.findMany({
        select: {
          role: true,
          message: true,
        },
        where: {
          conv_id: opts.input.conv_id,
          conv: {
            user_id: opts.ctx.user.id,
          },
        },
        orderBy: [{ created_at: "desc" }],
        take: 4,
      });
      const history = aiChatsList.map((entry) => {
        return {
          role: entry.role.toString().toLowerCase() as AIChatRole,
          content: entry.message,
        };
      });

      const textResult = await AISendChat(
        opts.input.model,
        history,
        opts.input.message
      );

      const resultId = await AISaveMessage(
        opts.ctx.prisma,
        opts.ctx.user.id,
        opts.input.conv_id,
        "assistant",
        textResult
      );

      return {
        code: STATUS_OK,
        message: "Success",
        chat_id: chatId,
        chat: opts.input.message,
        result_id: resultId,
        result: textResult,
      };
    }),
};
