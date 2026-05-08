import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsUUID } from "@/trpc/utils/validation";
import z from "zod";

export const readBari = {
  assessment: loggedInProcedure
    .input(z.object({ id: stringIsUUID() }))
    .query(async (opts) => {
      const isAdmin = opts.ctx.user.role.name === "Administrator";

      const theAssessment = await opts.ctx.prisma.bariAssessment.findFirst({
        where: {
          id: opts.input.id,
          user_id: isAdmin ? undefined : opts.ctx.user.id,
        },
        include: {
          user: {
            select: { id: true, full_name: true, email: true, avatar: true },
          },
          industry: { select: { id: true, industry_name: true } },
          answers: {
            select: {
              id: true,
              question_code: true,
              option_codes: true,
              likert_value: true,
              text_answer: true,
              created_at: true,
            },
            orderBy: [{ created_at: "asc" }],
          },
        },
      });

      if (!theAssessment) {
        throw readFailedNotFound("assessment");
      }

      return {
        code: STATUS_OK,
        message: "Success",
        assessment: theAssessment,
      };
    }),
};
