import GetPrismaClient from "@/lib/prisma";
import GetQStashClient from "@/lib/qstash";

const LEARNING_REMINDER_SCHEDULE_ID = "sch_learning_reminder";

const SCHEDULE_MINIMUM_MINUTE_FROM_NOW = 2;

export const LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE = 30;

export async function GetUpcomingLearning(
  prisma: ReturnType<typeof GetPrismaClient>,
  minusMinutes: number // minutes before meeting date
) {
  const minusXMinutes = new Date();
  minusXMinutes.setMinutes(minusXMinutes.getMinutes() + minusMinutes);

  const upcomingLearning = await prisma.learning.findFirst({
    select: {
      id: true,
      meeting_date: true,
    },
    where: {
      meeting_date: { gt: minusXMinutes },
    },
    orderBy: [{ meeting_date: "asc" }],
  });
  if (!upcomingLearning) {
    return null;
  }

  return upcomingLearning;
}

export async function UpdateLearningReminderSchedule(
  prisma: ReturnType<typeof GetPrismaClient>,
  qstash: ReturnType<typeof GetQStashClient>
) {
  const upcomingLearning = await GetUpcomingLearning(
    prisma,
    LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      learning_id: upcomingLearning.id,
    }),
  });
  if (newSchedule.scheduleId !== LEARNING_REMINDER_SCHEDULE_ID) {
    return false;
  }

  return true;
}
