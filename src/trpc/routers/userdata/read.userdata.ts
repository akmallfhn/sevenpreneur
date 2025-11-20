import { STATUS_OK } from "@/lib/status_code";
import { roleBasedProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsUUID } from "@/trpc/utils/validation";
import z from "zod";

export const readUserData = {
  user: roleBasedProcedure(["Administrator", "Educator", "Class Manager"])
    .input(z.object({ id: stringIsUUID() }))
    .query(async (opts) => {
      const theUser = await opts.ctx.prisma.user.findFirst({
        include: {
          phone_country: true,
          role: true,
          industry: true,
        },
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      if (!theUser) {
        throw readFailedNotFound("user");
      }
      return {
        code: STATUS_OK,
        message: "Success",
        user: theUser,
      };
    }),
};
