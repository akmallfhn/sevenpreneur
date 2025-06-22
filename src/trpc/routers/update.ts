import { administratorProcedure, createTRPCRouter } from "@/trpc/init";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsRoleID,
  stringIsTimestampTz,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateRouter = createTRPCRouter({
  user: administratorProcedure
    .input(
      z.object({
        id: stringIsUUID(),
        full_name: stringNotBlank().optional(),
        email: stringNotBlank().optional(),
        avatar: stringNotBlank().nullable().optional(),
        role_id: numberIsRoleID().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        date_of_birth: z.string().date().nullable().optional(),
        learning_goal: stringNotBlank().nullable().optional(),
        entrepreneur_stage_id: numberIsID().nullable().optional(),
        business_name: stringNotBlank().nullable().optional(),
        industry_id: numberIsID().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const dateOfBirth = stringToDate(opts.input.date_of_birth);
      const updatedUser = await opts.ctx.prisma.user.updateManyAndReturn({
        data: {
          full_name: opts.input.full_name,
          email: opts.input.email,
          avatar: opts.input.avatar,
          role_id: opts.input.role_id,
          status: opts.input.status,
          date_of_birth: dateOfBirth,
          learning_goal: opts.input.learning_goal,
          entrepreneur_stage_id: opts.input.entrepreneur_stage_id,
          business_name: opts.input.business_name,
          industry_id: opts.input.industry_id,
        },
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      if (updatedUser.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected user is not found.",
        });
      } else if (updatedUser.length > 1) {
        console.error("update.user: More-than-one users are updated at once.");
      }
      return {
        status: 200,
        message: "Success",
        user: updatedUser[0],
      };
    }),

  cohort: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        image: stringNotBlank().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        slug_url: stringNotBlank().optional().optional(),
        start_date: stringIsTimestampTz().optional(),
        end_date: stringIsTimestampTz().optional(),
        published_at: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedCohort = await opts.ctx.prisma.cohort.updateManyAndReturn({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          status: opts.input.status,
          slug_url: opts.input.slug_url,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
          published_at: opts.input.published_at,
        },
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      if (updatedCohort.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected cohort is not found.",
        });
      } else if (updatedCohort.length > 1) {
        console.error(
          "update.cohort: More-than-one cohorts are updated at once."
        );
      }
      return {
        status: 200,
        message: "Success",
        cohort: updatedCohort[0],
      };
    }),
});
