import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsRoleID,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const updateUserData = {
  user: administratorProcedure
    .input(
      z.object({
        id: stringIsUUID(),
        full_name: stringNotBlank().optional(),
        email: stringNotBlank().optional(),
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
        avatar: stringNotBlank().nullable().optional(),
        role_id: numberIsRoleID().optional(),
        status: z.enum(StatusEnum).optional(),
        date_of_birth: z.iso.date().nullable().optional(),
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
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      checkUpdateResult(updatedUser.length, "user", "users");
      return {
        code: STATUS_OK,
        message: "Success",
        user: updatedUser[0],
      };
    }),
};
