import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import {
  numberIsPositive,
  stringIsNanoid,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";
import { isEnrolledAITool } from "./util.ai_tool";

export const listAITool = {
  aiTools: loggedInProcedure.query(async (opts) => {
    const whereClause = {
      status: undefined as Optional<StatusEnum>,
    };
    if (opts.ctx.user.role.name === "General User") {
      await isEnrolledAITool(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to view AI tools."
      );
      whereClause.status = StatusEnum.ACTIVE;
    }
    const aiToolsList = await opts.ctx.prisma.aITool.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        slug_url: true,
        status: true,
      },
      where: whereClause,
      orderBy: [{ id: "desc" }],
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: aiToolsList,
    };
  }),

  aiResults: loggedInProcedure
    .input(
      z.object({
        ai_tool_slug: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to view AI tools."
        );
      }
      const aiResultsList = await opts.ctx.prisma.aIResult.findMany({
        select: {
          id: true,
          name: true,
          created_at: true,
          is_done: true,
          ai_tool: {
            select: {
              name: true,
              slug_url: true,
            },
          },
        },
        where: {
          user_id: opts.ctx.user.id,
          ai_tool: {
            slug_url: opts.input.ai_tool_slug,
          },
        },
        orderBy: [{ created_at: "desc" }],
      });
      const returnedList = aiResultsList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          ai_tool_name: entry.ai_tool.name,
          ai_tool_slug_url: entry.ai_tool.slug_url,
          is_done: entry.is_done,
          created_at: entry.created_at,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  aiConversations: loggedInProcedure.query(async (opts) => {
    if (opts.ctx.user.role.name === "General User") {
      await isEnrolledAITool(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to view AI tools."
      );
    }
    const aiConversationsList = await opts.ctx.prisma.aIConversation.findMany({
      select: {
        id: true,
        name: true,
        is_done: true,
        created_at: true,
      },
      where: {
        user_id: opts.ctx.user.id,
      },
      orderBy: [{ created_at: "desc" }],
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: aiConversationsList,
    };
  }),

  aiChats: loggedInProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        size: numberIsPositive().min(1).optional(),
        before: stringIsNanoid().optional(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledAITool(
          opts.ctx.prisma,
          opts.ctx.user.id,
          "You're not allowed to view AI tools."
        );
      }

      const aiConversation = await opts.ctx.prisma.aIConversation.findFirst({
        select: { name: true, is_done: true },
        where: {
          id: opts.input.conv_id,
          user_id: opts.ctx.user.id,
        },
      });
      if (!aiConversation) {
        throw readFailedNotFound("conversation");
      }

      let lastTime: Optional<Date> = undefined;
      if (opts.input.before) {
        const lastChat = await opts.ctx.prisma.aIChat.findFirst({
          select: { created_at: true },
          where: { id: opts.input.before },
        });
        if (lastChat) {
          lastTime = lastChat.created_at;
        }
      }

      const aiChatsList = await opts.ctx.prisma.aIChat.findMany({
        select: {
          id: true,
          role: true,
          message: true,
          created_at: true,
        },
        where: {
          conv_id: opts.input.conv_id,
          created_at: {
            lt: lastTime,
          },
          conv: {
            user_id: opts.ctx.user.id,
          },
        },
        orderBy: [{ created_at: "desc" }],
        take: opts.input.size,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        conversation_name: aiConversation.name,
        is_done: aiConversation.is_done,
        list: aiChatsList,
      };
    }),
};
