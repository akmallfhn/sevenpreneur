import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyNanoid } from "@/trpc/utils/validation";

export const readWA = {
  conversation: administratorProcedure
    .input(objectHasOnlyNanoid())
    .query(async (opts) => {
      const waConversation = await opts.ctx.prisma.wAConversation.findFirst({
        select: {
          full_name: true,
          phone_number: true,
          lead_status: true,
          winning_rate: true,
          note: true,
          last_read_id: true,
          handler_id: true,
          user: {
            select: {
              full_name: true,
              email: true,
              phone_country: { omit: { id: true } },
              phone_number: true,
              avatar: true,
            },
          },
          handler: {
            select: { full_name: true, avatar: true },
          },
        },
        where: { id: opts.input.id },
      });
      if (!waConversation) {
        throw readFailedNotFound("conversation");
      }

      return {
        code: STATUS_OK,
        message: "Success",
        conversation: waConversation,
      };
    }),
};
