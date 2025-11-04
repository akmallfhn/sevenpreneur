import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { stringNotBlank } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";
import { isEnrolledAITool } from "./util.ai_tool";

export const listAITool = {
  aiTools: loggedInProcedure.query(async (opts) => {
    const whereClause = {};
    if (opts.ctx.user.role.name === "General User") {
      await isEnrolledAITool(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to view AI tools."
      );
      Object.assign(whereClause, {
        status: StatusEnum.ACTIVE,
      });
    }
    const aiToolsList = await opts.ctx.prisma.aITool.findMany({
      select: { name: true, description: true, slug_url: true, status: true },
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
      const formattedList = aiResultsList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          created_at: entry.created_at,
          ai_tool_name: entry.ai_tool.name,
          ai_tool_slug_url: entry.ai_tool.slug_url,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: formattedList,
      };
    }),
};
