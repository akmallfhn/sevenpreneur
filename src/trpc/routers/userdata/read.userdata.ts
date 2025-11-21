import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsUUID } from "@/trpc/utils/validation";
import z from "zod";

export const readUserData = {
  user: loggedInProcedure
    .input(z.object({ id: stringIsUUID().optional() }))
    .query(async (opts) => {
      let selectedUserId = opts.input.id || opts.ctx.user.id;
      if (opts.ctx.user.role.name === "General User") {
        selectedUserId = opts.ctx.user.id;
      }
      const theUser = await opts.ctx.prisma.user.findFirst({
        include: {
          phone_country: true,
          role: true,
          industry: true,
        },
        where: {
          id: selectedUserId,
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
