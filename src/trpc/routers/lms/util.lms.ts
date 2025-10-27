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
  return theEnrolledCohort;
}

export async function isEnrolledLearning(
  prisma: PrismaClient,
  user_id: string,
  learning_id: number,
  error_message: string
) {
  const theEnrolledLearning = await prisma.learning.findFirst({
    include: { price: { select: { cohort_id: true } } },
    where: { id: learning_id },
  });
  if (!theEnrolledLearning) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }

  let cohortId = theEnrolledLearning.cohort_id;
  let cohortPriceId: number | undefined = undefined;
  if (
    theEnrolledLearning.price_id !== null &&
    theEnrolledLearning.price !== null
  ) {
    cohortId = theEnrolledLearning.price.cohort_id;
    cohortPriceId = theEnrolledLearning.price_id;
  }

  const theEnrolledCohort = await prisma.userCohort.findFirst({
    where: {
      user_id: user_id,
      cohort_id: cohortId,
      cohort_price_id: cohortPriceId,
    },
  });
  if (!theEnrolledCohort) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
}
