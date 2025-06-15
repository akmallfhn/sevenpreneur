import { administratorProcedure, createTRPCRouter } from "@/trpc/init";
import {
  numberIsID,
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
        avatar: stringNotBlank().optional(),
        role_id: numberIsID().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        date_of_birth: z.date().optional(),
        learning_goal: stringNotBlank().optional(),
        entrepreneur_stage_id: numberIsID().optional(),
        business_name: stringNotBlank().optional(),
        industry_id: numberIsID().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedUser = await opts.ctx.prisma.user.updateManyAndReturn({
        data: {
          full_name: opts.input.full_name,
          email: opts.input.email,
          avatar: opts.input.avatar,
          role_id: opts.input.role_id,
          status: opts.input.status,
          date_of_birth: opts.input.date_of_birth,
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
});
