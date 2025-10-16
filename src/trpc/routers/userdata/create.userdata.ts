import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsRoleID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createUserData = {
  user: administratorProcedure
    .input(
      z.object({
        full_name: stringNotBlank(),
        email: stringNotBlank(),
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
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
      const dateOfBirth = stringToDate(opts.input.date_of_birth);
      const createdUser = await opts.ctx.prisma.user.create({
        data: {
          full_name: opts.input.full_name,
          email: opts.input.email,
          phone_country_id: opts.input.phone_country_id,
          phone_number: opts.input.phone_number,
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
          phone_country: true,
          role: true,
          entrepreneur_stage: true,
          industry: true,
        },
        where: { id: createdUser.id },
      });
      if (!theUser) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new user.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        user: theUser,
      };
    }),
};
