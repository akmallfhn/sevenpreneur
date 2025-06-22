import { administratorProcedure, createTRPCRouter } from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import {
  numberIsID,
  numberIsRoleID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createRouter = createTRPCRouter({
  user: administratorProcedure
    .input(
      z.object({
        full_name: stringNotBlank(),
        email: stringNotBlank(),
        avatar: stringNotBlank().nullable().optional(),
        role_id: numberIsRoleID(),
        status: z.nativeEnum(StatusEnum),
        date_of_birth: z.string().date().nullable().optional(),
        learning_goal: stringNotBlank().nullable().optional(),
        entrepreneur_stage_id: numberIsID().nullable().optional(),
        business_name: stringNotBlank().nullable().optional(),
        industry_id: numberIsID().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const dateOfBirth =
        typeof opts.input.date_of_birth !== "undefined"
          ? opts.input.date_of_birth !== null
            ? new Date(opts.input.date_of_birth)
            : null
          : undefined;
      const createdUser = await opts.ctx.prisma.user.create({
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
      });
      const theUser = await opts.ctx.prisma.user.findFirst({
        include: {
          role: true,
          entrepreneur_stage: true,
          industry: true,
        },
        where: { id: createdUser.id },
      });
      if (!theUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new user.",
        });
      }
      return {
        status: 200,
        message: "Success",
        user: theUser,
      };
    }),

  cohort: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        description: stringNotBlank(),
        image: stringNotBlank(),
        status: z.nativeEnum(StatusEnum),
        slug_url: stringNotBlank().optional(),
        start_date: stringIsTimestampTz(),
        end_date: stringIsTimestampTz(),
        published_at: stringIsTimestampTz().optional(),
        cohort_prices: z
          .array(
            z.object({
              name: stringNotBlank(),
              amount: z.number(),
              status: z.nativeEnum(StatusEnum),
            })
          )
          .min(1),
      })
    )
    .mutation(async (opts) => {
      const slugUrl =
        typeof opts.input.slug_url !== "undefined"
          ? opts.input.slug_url
          : createSlugFromTitle(opts.input.name);
      const createdCohort = await opts.ctx.prisma.cohort.create({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          status: opts.input.status,
          slug_url: slugUrl,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
          published_at: opts.input.published_at,
          cohort_prices: {
            create: opts.input.cohort_prices,
          },
        },
      });
      const theCohort = await opts.ctx.prisma.cohort.findFirst({
        include: {
          cohort_prices: true,
        },
        where: {
          id: createdCohort.id,
          deleted_at: null,
        },
      });
      if (!theCohort) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new cohort.",
        });
      }
      return {
        status: 200,
        message: "Success",
        cohort: theCohort,
      };
    }),
});
