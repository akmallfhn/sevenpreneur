import { sendEmail } from "@/lib/mailtrap";
import GetPrismaClient from "@/lib/prisma";
import GetQStashClient from "@/lib/qstash";
import {
  GetUpcomingLearning,
  LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE,
  UpdateLearningReminderSchedule,
} from "@/trpc/utils/schedule_reminder";
import { NextRequest, NextResponse } from "next/server";

type QStashLearningRemider = {
  learning_id?: number;
};

export async function POST(req: NextRequest) {
  const reqBody: QStashLearningRemider = await req.json();
  const prisma = GetPrismaClient();

  const upcomingLearning = await GetUpcomingLearning(
    prisma,
    LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE + 10
  );
  if (!upcomingLearning) {
    return new NextResponse("OK", {
      status: 200,
    });
  }

  if (upcomingLearning.id !== (reqBody.learning_id || 0)) {
    const isUpdateScheduleSuccess = await UpdateLearningReminderSchedule(
      prisma,
      GetQStashClient()
    );
    if (!isUpdateScheduleSuccess) {
      console.error(
        "qstash.schedule-learning: Failed to update learning reminder schedule."
      );
    }

    return new NextResponse("OK", {
      status: 200,
    });
  }

  const selectedLearning = await prisma.learning.findFirst({
    select: {
      cohort_id: true,
      name: true,
      meeting_date: true,
    },
    where: { id: reqBody.learning_id },
  });
  if (!selectedLearning) {
    console.error(
      `qstash.schedule-learning: The learning with the given ID (${reqBody.learning_id}) is not found.`
    );

    return new NextResponse("OK", {
      status: 200,
    });
  }

  const memberList = await prisma.userCohort.findMany({
    select: {
      user: {
        select: {
          full_name: true,
          email: true,
        },
      },
    },
    where: {
      cohort_id: selectedLearning.cohort_id,
    },
  });

  for (const member of memberList) {
    await sendEmail({
      mailRecipients: [member.user.email],
      mailSubject: `Learning Reminder: ${selectedLearning.name}`,
      mailBody:
        `Hi, ${member.user.full_name},\n\n` +
        "We sent you this email to remind you about the upcoming learning session:\n" +
        `Name: ${selectedLearning.name}\n` +
        `Date: ${selectedLearning.meeting_date}\n\n` +
        "More details are posted on Agora LMS.\n\n" +
        "Intensity gets you started; Consistency keeps you growing. 🚀\n\n" +
        "Cheers,\n" +
        "Sevenpreneur Team",
    });
  }

  return new NextResponse("OK", {
    status: 200,
  });
}
