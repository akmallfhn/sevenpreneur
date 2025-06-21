import { administratorProcedure, createTRPCRouter } from "@/trpc/init";
import {
  numberIsID,
  numberIsRoleID,
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
});
