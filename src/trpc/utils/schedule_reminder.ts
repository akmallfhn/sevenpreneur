import GetPrismaClient from "@/lib/prisma";
import GetQStashClient from "@/lib/qstash";
import { StatusEnum } from "@prisma/client";

const LEARNING_REMINDER_SCHEDULE_ID = "sch_learning_reminder";

const SCHEDULE_MINIMUM_MINUTE_FROM_NOW = 2;

export const LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE = 30;

export async function GetUpcomingLearning(
  prisma: ReturnType<typeof GetPrismaClient>,
  minusMinutes: number, // minutes before meeting date
  exclusionList?: number[] // learning IDs to be excluded
) {
  const minusXMinutes = new Date();
  minusXMinutes.setMinutes(minusXMinutes.getMinutes() + minusMinutes);

  const upcomingLearning = await prisma.learning.findFirst({
    select: {
      id: true,
      meeting_date: true,
    },
    where: {
      id: { notIn: exclusionList },
      meeting_date: { gt: minusXMinutes },
      status: StatusEnum.ACTIVE,
    },
    orderBy: [{ meeting_date: "asc" }, { id: "asc" }],
  });
  if (!upcomingLearning) {
    return null;
  }

  return upcomingLearning;
}

export async function GetLearnings(
  prisma: ReturnType<typeof GetPrismaClient>,
  idList: number[]
) {
  const learningList = await prisma.learning.findMany({
    select: {
      id: true,
      cohort_id: true,
      name: true,
      meeting_date: true,
      method: true,
      meeting_url: true,
      location_name: true,
      location_url: true,
      cohort: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    where: {
      id: { in: idList },
    },
    orderBy: [{ meeting_date: "asc" }, { id: "asc" }],
  });

  return learningList;
}

export async function GetNearbyLearnings(
  prisma: ReturnType<typeof GetPrismaClient>,
  meetingDate: Date
) {
  const searchDate = new Date(meetingDate.getTime());
  searchDate.setMinutes(
    searchDate.getMinutes() + SCHEDULE_MINIMUM_MINUTE_FROM_NOW
  );

  const upcomingLearningList = await prisma.learning.findMany({
    select: { id: true },
    where: {
      meeting_date: {
        gte: meetingDate,
        lte: searchDate,
      },
      status: StatusEnum.ACTIVE,
    },
    orderBy: [{ meeting_date: "asc" }, { id: "asc" }],
  });

  const upcomingLearningIDs = upcomingLearningList.map((entry) => entry.id);

  const upcomingLearnings = await GetLearnings(prisma, upcomingLearningIDs);

  return upcomingLearnings;
}

export async function UpdateLearningReminderSchedule(
  prisma: ReturnType<typeof GetPrismaClient>,
  qstash: ReturnType<typeof GetQStashClient>,
  exclusionList?: number[] // learning IDs to be excluded
) {
  const upcomingLearning = await GetUpcomingLearning(
    prisma,
    LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE,
    exclusionList
  );
  if (!upcomingLearning) {
    // Delete schedule if there is no upcoming learning.
    await qstash.schedules.delete(LEARNING_REMINDER_SCHEDULE_ID);
    return true;
  }

  const minimumTime = new Date();
  minimumTime.setMinutes(
    minimumTime.getMinutes() + SCHEDULE_MINIMUM_MINUTE_FROM_NOW
  );

  const meetingDate = upcomingLearning.meeting_date;
  const scheduledTime = new Date(meetingDate.getTime());
  scheduledTime.setMinutes(
    meetingDate.getMinutes() - LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE
  );

  // Minimum time to schedule a reminder to avoid "in a year" schedule
  scheduledTime.setTime(
    Math.max(minimumTime.getTime(), scheduledTime.getTime())
  );

  const cronString = [
    scheduledTime.getUTCMinutes(),
    scheduledTime.getUTCHours(),
    scheduledTime.getUTCDate(),
    scheduledTime.getUTCMonth() + 1, // to be in [1, 12] range
    "*",
  ].join(" ");

  const newSchedule = await qstash.schedules.create({
    scheduleId: LEARNING_REMINDER_SCHEDULE_ID,
    cron: cronString,
    destination: "https://api.sevenpreneur.com/qstash/schedule-learning",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (newSchedule.scheduleId !== LEARNING_REMINDER_SCHEDULE_ID) {
    return false;
  }

  return true;
}
