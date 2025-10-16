import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { stringIsUUID } from "@/trpc/utils/validation";
import z from "zod";

export const deleteUserData = {
  user: administratorProcedure
    .input(z.object({ id: stringIsUUID() }))
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedUserCount: number = await opts.ctx.prisma
        .$executeRaw`UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ${opts.input.id}::uuid;`;
      checkDeleteResult(deletedUserCount, "users", "user");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
