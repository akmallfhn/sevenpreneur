import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK,
} from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { checkUpdateResult, readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsNanoid, stringNotBlank } from "@/trpc/utils/validation";
import { TRPCError } from "@trpc/server";
import z from "zod";
import {
  AICOGSStructure_CustomerType,
  AICOGSStructure_ProductCategory,
  AIMarketSize_CustomerType,
  AIMarketSize_ProductType,
} from "./enum.ai_tool";
import { aiToolPrompts } from "./prompt.ai_tool";
import {
  AI_TOOL_EPHEMERAL_ID_COGS_STRUCTURE,
  AI_TOOL_ID_COMPETITOR_GRADER,
  AI_TOOL_ID_IDEA_VAL,
  AI_TOOL_ID_MARKET_SIZE,
  AIChatRole,
  AIGenerate,
  AIGenerateTitle,
  AIModelName,
  AISaveMessage,
  AISendChat,
  isEnrolledAITool,
} from "./util.ai_tool";

export const useAITool = {
  ideaValidation: loggedInProcedure
    .input(
      z.object({
        model: z.enum(AIModelName),
        problem: stringNotBlank(),
        location: stringNotBlank(),
        ideation: stringNotBlank(),
        resources: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const resultId = await AIGenerate(
        opts.input.model,
        aiToolPrompts.ideaValidation(
          opts.input.problem,
          opts.input.location,
          opts.input.ideation,
          opts.input.resources
        ),
        opts.ctx.prisma,
        opts.ctx.user.id,
        AI_TOOL_ID_IDEA_VAL
      );

      return {
        code: STATUS_CREATED,
        message: "Queued",
        result_id: resultId,
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
    .mutation(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const resultId = await AIGenerate(
        opts.input.model,
        aiToolPrompts.marketSize(
          opts.input.additional_persona || "",
          opts.input.product_name,
          opts.input.description,
          opts.input.product_type,
          opts.input.customer_type,
          opts.input.company_operating_area,
          opts.input.sales_channel
        ),
        opts.ctx.prisma,
        opts.ctx.user.id,
        AI_TOOL_ID_MARKET_SIZE
      );

      return {
        code: STATUS_CREATED,
        message: "Queued",
        result_id: resultId,
      };
    }),

  competitorGrading: loggedInProcedure
    .input(
      z.object({
        model: z.enum(AIModelName),
        product_name: stringNotBlank(),
        product_description: stringNotBlank(),
        country: stringNotBlank(),
        industry: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const resultId = await AIGenerate(
        opts.input.model,
        aiToolPrompts.competitorGrading(
          opts.input.product_name,
          opts.input.product_description,
          opts.input.country,
          opts.input.industry
        ),
        opts.ctx.prisma,
        opts.ctx.user.id,
        AI_TOOL_ID_COMPETITOR_GRADER
      );

      return {
        code: STATUS_CREATED,
        message: "Queued",
        result_id: resultId,
      };
    }),

  COGSStructure: loggedInProcedure
    .input(
      z.object({
        model: z.enum(AIModelName),
        product_name: stringNotBlank(),
        description: stringNotBlank(),
        product_category: z.enum(AICOGSStructure_ProductCategory),
        COGS_calculation: z.enum(AICOGSStructure_CustomerType),
        volume_per_batch: z.number().default(0),
      })
    )
    .mutation(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to use AI tools."
        );
      }

      const resultId = await AIGenerate(
        opts.input.model,
        aiToolPrompts.COGSStructure(
          opts.input.product_name,
          opts.input.description,
          opts.input.product_category,
          opts.input.COGS_calculation,
          opts.input.volume_per_batch
        ),
        opts.ctx.prisma,
        opts.ctx.user.id,
        AI_TOOL_EPHEMERAL_ID_COGS_STRUCTURE
      );

      return {
        code: STATUS_CREATED,
        message: "Queued",
        result_id: resultId,
      };
    }),

  sendChat: loggedInProcedure
    .input(
      z.object({
        model: z.enum(AIModelName),
        conv_id: stringIsNanoid().optional(),
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

      let convId = "";
      if (!opts.input.conv_id) {
        const createdConversation = await opts.ctx.prisma.aIConversation.create(
          {
            data: {
              user_id: opts.ctx.user.id,
              name: "", // start empty
            },
          }
        );
        convId = createdConversation.id;
      } else {
        convId = opts.input.conv_id;
      }

      const theConversation = await opts.ctx.prisma.aIConversation.findFirst({
        select: { id: true, name: true },
        where: {
          id: convId,
          user_id: opts.ctx.user.id,
        },
      });
      if (!theConversation) {
        if (!opts.input.conv_id) {
          throw new TRPCError({
            code: STATUS_INTERNAL_SERVER_ERROR,
            message: "Failed to create a new conversation.",
          });
        } else {
          throw readFailedNotFound("conversation");
        }
      }

      const chatMessage = await AISaveMessage(
        opts.ctx.prisma,
        convId,
        "user",
        opts.input.message
      );

      let conversationName = theConversation.name;
      if (!opts.input.conv_id) {
        const parsedResult = await AIGenerateTitle(
          opts.input.model,
          aiToolPrompts.generateTitle(opts.input.message)
        );

        const updatedConversation =
          await opts.ctx.prisma.aIConversation.updateManyAndReturn({
            data: {
              name: parsedResult.response.title,
            },
            where: {
              id: convId,
            },
          });
        checkUpdateResult(
          updatedConversation.length,
          "AI conversation",
          "AI conversations"
        );

        conversationName = parsedResult.response.title;
      }

      const aiChatsList = await opts.ctx.prisma.aIChat.findMany({
        select: {
          role: true,
          message: true,
        },
        where: {
          conv_id: convId,
          conv: {
            user_id: opts.ctx.user.id,
          },
        },
        orderBy: [{ created_at: "desc" }],
        take: 4,
      });
      const history = aiChatsList.reverse().map((entry) => {
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

      const resultMessage = await AISaveMessage(
        opts.ctx.prisma,
        convId,
        "assistant",
        textResult
      );

      return {
        code: STATUS_OK,
        message: "Success",
        conv_id: convId,
        conv_name: conversationName,
        chat_id: chatMessage.id,
        chat: opts.input.message,
        chat_created_at: chatMessage.created_at,
        result_id: resultMessage.id,
        result: textResult,
        result_created_at: resultMessage.created_at,
      };
    }),
};
