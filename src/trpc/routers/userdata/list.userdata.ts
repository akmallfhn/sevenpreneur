import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { roleBasedProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsPosInt,
  numberIsRoleID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import z from "zod";

export const listUserData = {
  users: roleBasedProcedure([
    "Administrator",
    "Super Admin",
    "Educator",
    "Class Manager",
  ])
    .input(
      z.object({
        role_id: numberIsRoleID().optional(),
        page: numberIsPosInt().optional(),
        page_size: numberIsPosInt().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        role_id: opts.input.role_id,
        OR: undefined as Optional<
          [
            { full_name: { contains: string; mode: "insensitive" } },
            { email: { contains: string; mode: "insensitive" } },
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

      const roleOrder: Record<string, number> = {
        "Super Admin": 1,
        Administrator: 2,
        Marketer: 3,
        "Class Manager": 4,
        Educator: 5,
        "General User": 6,
      };

      const allMatchingUsers = await opts.ctx.prisma.user.findMany({
        include: { role: true },
        where: whereClause,
      });

      allMatchingUsers.sort((a, b) => {
        const ra = roleOrder[a.role.name] ?? 99;
        const rb = roleOrder[b.role.name] ?? 99;
        if (ra !== rb) return ra - rb;
        return a.full_name.localeCompare(b.full_name);
      });

      const skip = paging.prisma.skip ?? 0;
      const take = paging.prisma.take;
      const userList =
        take === undefined
          ? allMatchingUsers
          : allMatchingUsers.slice(skip, skip + take);
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
