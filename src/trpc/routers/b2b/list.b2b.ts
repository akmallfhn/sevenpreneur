import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsID,
  numberIsPosInt,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import {
  B2BActivityTypeEnum,
  B2BProductEnum,
  B2BSourceEnum,
  B2BStageEnum,
  Prisma,
} from "@prisma/client";
import z from "zod";

export const listB2B = {
  pipelines: administratorProcedure
    .input(
      z.object({
        product: z.enum(B2BProductEnum).optional(),
        source: z.enum(B2BSourceEnum).optional(),
        stage: z.enum(B2BStageEnum).optional(),
        owner_id: stringIsUUID().optional(),
        keyword: stringNotBlank().optional(),
        year: z.number().int().min(2020).max(2100).optional(),
        page: numberIsPosInt().optional(),
        page_size: numberIsPosInt().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause: Prisma.B2BPipelineWhereInput = {
        product: opts.input.product,
        source: opts.input.source,
        stage: opts.input.stage,
        owner_id: opts.input.owner_id,
        OR: undefined as Optional<
          [
            { name: { contains: string; mode: "insensitive" } },
            { pic_name: { contains: string; mode: "insensitive" } },
            { pic_email: { contains: string; mode: "insensitive" } },
          ]
        >,
      };

      if (opts.input.keyword !== undefined) {
        whereClause.OR = [
          { name: { contains: opts.input.keyword, mode: "insensitive" } },
          { pic_name: { contains: opts.input.keyword, mode: "insensitive" } },
          { pic_email: { contains: opts.input.keyword, mode: "insensitive" } },
        ];
      }

      if (opts.input.year !== undefined) {
        const yearStart = new Date(`${opts.input.year}-01-01T00:00:00.000Z`);
        const yearEnd = new Date(
          `${opts.input.year + 1}-01-01T00:00:00.000Z`
        );
        // Match leads in this year OR leads whose project window isn't set yet
        // (so freshly-identified leads without a start_month still show up).
        whereClause.AND = [
          {
            OR: [
              { project_start_month: { gte: yearStart, lt: yearEnd } },
              { project_start_month: null },
            ],
          },
        ];
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.b2BPipeline.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const [pipelineList, statsRows] = await Promise.all([
        opts.ctx.prisma.b2BPipeline.findMany({
          include: {
            owner: { select: { id: true, full_name: true, avatar: true } },
            industry: { select: { id: true, industry_name: true } },
          },
          orderBy: [{ project_value: "desc" }],
          where: whereClause,
          skip: paging.prisma.skip,
          take: paging.prisma.take,
        }),
        opts.ctx.prisma.b2BPipeline.findMany({
          select: {
            project_value: true,
            probability: true,
            stage: true,
          },
          where: whereClause,
        }),
      ]);

      const returnedList = pipelineList.map((entry) => ({
        id: entry.id,
        name: entry.name,
        industry_id: entry.industry.id,
        industry_name: entry.industry.industry_name,
        product: entry.product,
        stage: entry.stage,
        probability: entry.probability,
        project_value: entry.project_value,
        project_start_month: entry.project_start_month,
        project_end_month: entry.project_end_month,
        owner_id: entry.owner.id,
        owner_name: entry.owner.full_name,
        owner_avatar: entry.owner.avatar,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      }));

      // Scorecard aggregates (scoped to the same filter as the list)
      let pipelineValue = 0;
      let closedWonValue = 0;
      let weightedValue = 0;
      for (const row of statsRows) {
        const value = Number(row.project_value);
        pipelineValue += value;
        if (row.stage === B2BStageEnum.CLOSED_WON) {
          closedWonValue += value;
        }
        weightedValue += (value * row.probability) / 100;
      }

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        scorecards: {
          pipeline_value: pipelineValue,
          closed_won_value: closedWonValue,
          weighted_value: Math.round(weightedValue),
        },
        metapaging: {
          ...paging.metapaging,
          keyword: opts.input.keyword,
          year: opts.input.year,
        },
      };
    }),

  actions: administratorProcedure
    .input(
      z.object({
        company_id: numberIsID(),
        activity_type: z.enum(B2BActivityTypeEnum).optional(),
        page: numberIsPosInt().optional(),
        page_size: numberIsPosInt().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        company_id: opts.input.company_id,
        activity_type: opts.input.activity_type,
      };

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.b2BAction.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const actionList = await opts.ctx.prisma.b2BAction.findMany({
        orderBy: [{ created_at: "desc" }],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: actionList,
        metapaging: paging.metapaging,
      };
    }),
};
