import { createTRPCRouter, loggedInProcedure } from "@/trpc/init";
import { stringIsUUID } from "@/trpc/utils/validation";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const readRouter = createTRPCRouter({
  industry: loggedInProcedure
    .input(
      z.object({
        id: z.number().finite().gt(0),
      })
    )
    .query(async (opts) => {
      const theIndustry = await opts.ctx.prisma.industry.findFirst({
        where: { id: opts.input.id },
      });
      if (!theIndustry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The industry with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        industry: theIndustry,
      };
    }),

  entrepreneurStage: loggedInProcedure
    .input(
      z.object({
        id: z.number().finite().gt(0),
      })
    )
    .query(async (opts) => {
      const theEntrepreneurStage =
        await opts.ctx.prisma.entrepreneurStage.findFirst({
          where: { id: opts.input.id },
        });
      if (!theEntrepreneurStage) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The entrepreneur stage with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        entrepreneur_stage: theEntrepreneurStage,
      };
    }),

  role: loggedInProcedure
    .input(
      z.object({
        id: z.number().finite().gte(0),
      })
    )
    .query(async (opts) => {
      const theRole = await opts.ctx.prisma.role.findFirst({
        where: { id: opts.input.id },
      });
      if (!theRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The role with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        role: theRole,
      };
    }),

  user: loggedInProcedure
    .input(
      z.object({
        id: stringIsUUID(),
      })
    )
    .query(async (opts) => {
      const theUser = await opts.ctx.prisma.user.findFirst({
        where: { id: opts.input.id },
      });
      if (!theUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The user with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        user: theUser,
      };
    }),
});
