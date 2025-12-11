import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure, publicProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";

export const readEvent = {
  event: publicProcedure.input(objectHasOnlyID()).query(async (opts) => {
    let whereClause = {
      id: opts.input.id,
      status: undefined as StatusEnum | undefined,
      deleted_at: null,
    };
    if (!opts.ctx.user) {
      whereClause = {
        ...whereClause,
        status: StatusEnum.ACTIVE,
      };
    }
    const theEvent = await opts.ctx.prisma.event.findFirst({
      include: {
        event_prices: true,
      },
      where: whereClause,
    });
    if (!theEvent) {
      throw readFailedNotFound("event");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      event: theEvent,
    };
  }),

  eventPrice: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const theEventPrice = await opts.ctx.prisma.eventPrice.findFirst({
      where: {
        id: opts.input.id,
        // deleted_at: null,
      },
    });
    if (!theEventPrice) {
      throw readFailedNotFound("event price");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      cohortPrice: theEventPrice,
    };
  }),
};
