import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure, loggedInProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsRoleID,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import {
  LegalEntityEnum,
  NumEmployeeEnum,
  OccupationEnum,
  RevenueEnum,
  StatusEnum,
} from "@prisma/client";
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
        business_name: stringNotBlank().nullable().optional(),
        industry_id: numberIsID().nullable().optional(),
        business_description: stringNotBlank().nullable().optional(),
        occupation: z.enum(OccupationEnum).nullable().optional(),
        yearly_revenue: z.enum(RevenueEnum).nullable().optional(),
        total_employees: z.enum(NumEmployeeEnum).nullable().optional(),
        company_profile_url: stringNotBlank().nullable().optional(),
        business_age_years: z.number().nullable().optional(),
        legal_entity_type: z.enum(LegalEntityEnum).nullable().optional(),
        average_selling_price: z.number().nullable().optional(),
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
          business_name: opts.input.business_name,
          industry_id: opts.input.industry_id,
          business_description: opts.input.business_description,
          occupation: opts.input.occupation,
          yearly_revenue: opts.input.yearly_revenue,
          total_employees: opts.input.total_employees,
          company_profile_url: opts.input.company_profile_url,
          business_age_years: opts.input.business_age_years,
          legal_entity_type: opts.input.legal_entity_type,
          average_selling_price: opts.input.average_selling_price,
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

  user_business: loggedInProcedure
    .input(
      z.object({
        date_of_birth: z.iso.date().nullable().optional(),
        business_name: stringNotBlank().nullable().optional(),
        industry_id: numberIsID().nullable().optional(),
        business_description: stringNotBlank().nullable().optional(),
        occupation: z.enum(OccupationEnum).nullable().optional(),
        yearly_revenue: z.enum(RevenueEnum).nullable().optional(),
        total_employees: z.enum(NumEmployeeEnum).nullable().optional(),
        company_profile_url: stringNotBlank().nullable().optional(),
        business_age_years: z.number().nullable().optional(),
        legal_entity_type: z.enum(LegalEntityEnum).nullable().optional(),
        average_selling_price: z.number().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const dateOfBirth = stringToDate(opts.input.date_of_birth);
      const updatedUser = await opts.ctx.prisma.user.updateManyAndReturn({
        data: {
          date_of_birth: dateOfBirth,
          business_name: opts.input.business_name,
          industry_id: opts.input.industry_id,
          business_description: opts.input.business_description,
          occupation: opts.input.occupation,
          yearly_revenue: opts.input.yearly_revenue,
          total_employees: opts.input.total_employees,
          company_profile_url: opts.input.company_profile_url,
          business_age_years: opts.input.business_age_years,
          legal_entity_type: opts.input.legal_entity_type,
          average_selling_price: opts.input.average_selling_price,
        },
        where: {
          id: opts.ctx.user.id,
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
