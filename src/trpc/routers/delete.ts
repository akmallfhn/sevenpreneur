import { administratorProcedure, createTRPCRouter } from "@/trpc/init";
import { numberIsID, stringIsUUID } from "@/trpc/utils/validation";
import { z } from "zod";

export const deleteRouter = createTRPCRouter({
  user: administratorProcedure
    .input(
      z.object({
        id: stringIsUUID(),
      })
    )
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedUser: number = await opts.ctx.prisma
        .$executeRaw`UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ${opts.input.id}::uuid;`;
      if (deletedUser > 1) {
        console.error("delete.user: More-than-one users are deleted at once.");
      }
      return {
        status: 200,
        message: "Success",
      };
    }),

  cohort: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedCohort: number = await opts.ctx.prisma
        .$executeRaw`UPDATE cohorts SET deleted_at = CURRENT_TIMESTAMP WHERE id = ${opts.input.id};`;
      if (deletedCohort > 1) {
        console.error(
          "delete.cohort: More-than-one cohorts are deleted at once."
        );
      }
      return {
        status: 200,
        message: "Success",
      };
    }),

  cohortPrice: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedCohortPrice = await opts.ctx.prisma.cohortPrice.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedCohortPrice.count > 1) {
        console.error(
          "delete.cohortPrice: More-than-one cohort prices are deleted at once."
        );
      }
      return {
        status: 200,
        message: "Success",
      };
    }),
});
