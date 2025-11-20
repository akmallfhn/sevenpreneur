import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { stringNotBlank } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const listLookup = {
  roles: loggedInProcedure.query(async (opts) => {
    const roleList = await opts.ctx.prisma.role.findMany({
      orderBy: [{ id: "asc" }],
    });
    const returnedList = roleList.map((entry) => {
      return {
        id: entry.id,
        name: entry.name,
      };
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: returnedList,
    };
  }),

  industries: loggedInProcedure.query(async (opts) => {
    const industryList = await opts.ctx.prisma.industry.findMany({
      orderBy: [{ industry_name: "asc" }, { id: "asc" }],
    });
    const returnedList = industryList.map((entry) => {
      return {
        id: entry.id,
        name: entry.industry_name,
      };
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: returnedList,
    };
  }),

  phoneCountryCodes: loggedInProcedure.query(async (opts) => {
    const codeList = await opts.ctx.prisma.phoneCountryCode.findMany();
    const returnedList = codeList.map((entry) => {
      return {
        id: entry.id,
        country_name: entry.country_name,
        phone_code: entry.phone_code,
        emoji: entry.emoji,
      };
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: returnedList,
    };
  }),

  paymentChannels: loggedInProcedure
    .input(z.object({ method: stringNotBlank().optional() }).optional())
    .query(async (opts) => {
      const channelList = await opts.ctx.prisma.paymentChannel.findMany({
        where: {
          method: opts.input?.method,
          status: StatusEnum.ACTIVE,
        },
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: channelList,
      };
    }),
};
