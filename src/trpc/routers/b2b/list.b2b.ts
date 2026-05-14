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
        page: numberIsPosInt().optional(),
        page_size: numberIsPosInt().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
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

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.b2BPipeline.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const pipelineList = await opts.ctx.prisma.b2BPipeline.findMany({
        include: {
          owner: { select: { id: true, full_name: true, avatar: true } },
        },
        orderBy: [{ created_at: "desc" }],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      const returnedList = pipelineList.map((entry) => ({
        id: entry.id,
        name: entry.name,
        product: entry.product,
        stage: entry.stage,
        probability: entry.probability,
        project_value: entry.project_value,
        owner_id: entry.owner.id,
        owner_name: entry.owner.full_name,
        owner_avatar: entry.owner.avatar,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      }));

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: {
          ...paging.metapaging,
          keyword: opts.input.keyword,
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
