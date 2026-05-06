import { SessionReminderEmail } from "@/components/emails/SessionReminderEmail";
import { sendEmail } from "@/lib/mailtrap";
import GetPrismaClient from "@/lib/prisma";
import GetQStashClient from "@/lib/qstash";
import {
  GetUpcomingLearning,
  LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE,
  UpdateLearningReminderSchedule,
} from "@/trpc/utils/schedule_reminder";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";
import { render } from "@react-email/render";
import dayjs from "dayjs";
import "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

type QStashLearningRemider = {
  learning_id?: number;
};

async function updateScheduleAndReturn(
  prisma: ReturnType<typeof GetPrismaClient>
) {
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

export async function POST(req: NextRequest) {
  const reqBody: QStashLearningRemider = await req.json();
  const prisma = GetPrismaClient();

  const upcomingLearning = await GetUpcomingLearning(
    prisma,
    LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE - 10
  );
  if (!upcomingLearning) {
    return await updateScheduleAndReturn(prisma);
  }

  if (upcomingLearning.id !== (reqBody.learning_id || 0)) {
    return await updateScheduleAndReturn(prisma);
  }

  const selectedLearning = await prisma.learning.findFirst({
    select: {
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
    where: { id: reqBody.learning_id },
  });
  if (!selectedLearning) {
    console.error(
      `qstash.schedule-learning: The learning with the given ID (${reqBody.learning_id}) is not found.`
    );

    return await updateScheduleAndReturn(prisma);
  }

  const sessionDate = dayjs(selectedLearning.meeting_date)
    .tz("Asia/Jakarta")
    .format("dddd, D MMMM YYYY - HH:mm [WIB]");

  const conferenceName = selectedLearning.meeting_url
    ? getConferenceAttributes(
        getConferenceVariantFromURL(selectedLearning.meeting_url)
      ).conferenceName
    : "Online";

  let sessionPlace = conferenceName;
  if (selectedLearning.method === "ONSITE") {
    sessionPlace = selectedLearning.location_name ?? "Onsite";
  } else if (selectedLearning.method === "HYBRID") {
    sessionPlace = `${selectedLearning.location_name ?? "Onsite"} (Hybrid via ${conferenceName})`;
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
    const firstName = member.user.full_name.split(" ")[0];

    const html = await render(
      createElement(SessionReminderEmail, {
        firstName,
        cohortName: selectedLearning.cohort.name,
        cohortImage: selectedLearning.cohort.image,
        sessionName: selectedLearning.name,
        sessionPlace,
        sessionDate,
        joinUrl:
          selectedLearning.method === "ONSITE"
            ? (selectedLearning.location_url ?? undefined)
            : (selectedLearning.meeting_url ?? undefined),
      })
    );

    await sendEmail({
      mailRecipients: [member.user.email],
      mailSubject: `Mulai Sebentar Lagi! ${selectedLearning.name} by MIFX`,
      mailHtml: html,
    });
  }

  return await updateScheduleAndReturn(prisma);
}
