import { BARI_QUESTIONS } from "@/lib/bari-questions";
import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import { numberIsPosInt } from "@/trpc/utils/validation";
import z from "zod";

export const listBari = {
  questions: loggedInProcedure
    .input(
      z
        .object({
          stage: z.int().min(1).max(2).optional(),
        })
        .optional()
    )
    .query(async (opts) => {
      const list = opts.input?.stage
        ? BARI_QUESTIONS.filter((q) => q.stage === opts.input?.stage)
        : BARI_QUESTIONS;

      return {
        code: STATUS_OK,
        message: "Success",
        list,
      };
    }),

  assessments: loggedInProcedure
    .input(
      z.object({
        page: numberIsPosInt().optional(),
        page_size: numberIsPosInt().optional(),
      })
    )
    .query(async (opts) => {
      const isAdmin = opts.ctx.user.role.name === "Administrator";

      const whereClause = {
        user_id: isAdmin ? undefined : opts.ctx.user.id,
      };

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.bariAssessment.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const assessmentList = await opts.ctx.prisma.bariAssessment.findMany({
        select: {
          id: true,
          user: { select: { id: true, full_name: true, avatar: true } },
          industry: { select: { id: true, industry_name: true } },
          team_size: true,
          revenue_model: true,
          status: true,
          completed_at: true,
          created_at: true,
          updated_at: true,
        },
        where: whereClause,
        orderBy: [{ created_at: "desc" }],
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: assessmentList,
        metapaging: paging.metapaging,
      };
    }),
};
