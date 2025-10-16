import { STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { numberIsRoleID, objectHasOnlyID } from "@/trpc/utils/validation";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const readLookup = {
  role: loggedInProcedure
    .input(z.object({ id: numberIsRoleID() }))
    .query(async (opts) => {
      const theRole = await opts.ctx.prisma.role.findFirst({
        where: { id: opts.input.id },
      });
      if (!theRole) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The role with the given ID is not found.",
        });
      }
      return {
        code: STATUS_OK,
        message: "Success",
        role: theRole,
      };
    }),

  entrepreneurStage: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theEntrepreneurStage =
        await opts.ctx.prisma.entrepreneurStage.findFirst({
          where: { id: opts.input.id },
        });
      if (!theEntrepreneurStage) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The entrepreneur stage with the given ID is not found.",
        });
      }
      return {
        code: STATUS_OK,
        message: "Success",
        entrepreneur_stage: theEntrepreneurStage,
      };
    }),

  industry: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const theIndustry = await opts.ctx.prisma.industry.findFirst({
      where: { id: opts.input.id },
    });
    if (!theIndustry) {
      throw new TRPCError({
        code: STATUS_NOT_FOUND,
        message: "The industry with the given ID is not found.",
      });
    }
    return {
      code: STATUS_OK,
      message: "Success",
      industry: theIndustry,
    };
  }),
};
