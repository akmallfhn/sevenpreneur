import { STATUS_FORBIDDEN } from "@/lib/status_code";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function isEnrolledCohort(
  prisma: PrismaClient,
  user_id: string,
  cohort_id: number,
  error_message: string
) {
  const theEnrolledCohort = await prisma.userCohort.findFirst({
    where: {
      user_id: user_id,
      cohort_id: cohort_id,
    },
  });
  if (!theEnrolledCohort) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
}
