import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { roleBasedProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsPositive,
  numberIsRoleID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import z from "zod";

export const listUserData = {
  users: roleBasedProcedure(["Administrator", "Educator", "Class Manager"])
    .input(
      z.object({
        role_id: numberIsRoleID().optional(),
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        role_id: opts.input.role_id,
        OR: undefined as Optional<
          [
            { full_name: { contains: string; mode: "insensitive" } },
            { email: { contains: string; mode: "insensitive" } }
          ]
        >,
        deleted_at: null,
      };

      if (opts.input.keyword !== undefined) {
        whereClause.OR = [
          {
            full_name: {
              contains: opts.input.keyword,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: opts.input.keyword,
              mode: "insensitive",
            },
          },
        ];
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.user.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const userList = await opts.ctx.prisma.user.findMany({
        include: { role: true },
        orderBy: [{ role_id: "asc" }, { full_name: "asc" }],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = userList.map((entry) => {
        return {
          id: entry.id,
          full_name: entry.full_name,
          email: entry.email,
          avatar: entry.avatar,
          role_id: entry.role_id,
          role_name: entry.role.name,
          status: entry.status,
          created_at: entry.created_at,
          last_login: entry.last_login,
        };
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        keyword: opts.input.keyword,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),
};
