import { administratorProcedure, createTRPCRouter } from "@/trpc/init";
import { stringIsUUID } from "@/trpc/utils/validation";
import { z } from "zod";

export const deleteRouter = createTRPCRouter({
  user: administratorProcedure
    .input(
      z.object({
        id: stringIsUUID(),
      })
    )
    .mutation(async (opts) => {
      const deletedUser: number = await opts.ctx.prisma
        .$executeRaw`UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ${opts.input.id}::uuid;`;
      if (deletedUser > 1) {
        console.error("delete.user: More-than-one users are deleted at once.");
      }
      return {
        status: 200,
        message: "Success",
      };
    }),
});
