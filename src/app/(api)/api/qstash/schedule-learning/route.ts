import { SessionReminderEmail } from "@/components/emails/SessionReminderEmail";
import { sendEmail } from "@/lib/mailtrap";
import GetPrismaClient from "@/lib/prisma";
import GetQStashClient from "@/lib/qstash";
import {
  GetNearbyLearnings,
  GetUpcomingLearning,
  LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE,
  UpdateLearningReminderSchedule,
} from "@/trpc/utils/schedule_reminder";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";
import { render } from "@react-email/render";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { createElement } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

async function updateScheduleAndReturn(
  prisma: ReturnType<typeof GetPrismaClient>,
  exclusionList?: number[] // learning IDs to be excluded
) {
  const isUpdateScheduleSuccess = await UpdateLearningReminderSchedule(
    prisma,
    GetQStashClient(),
    exclusionList
  );
  if (!isUpdateScheduleSuccess) {
    console.error(
      "qstash.schedule-learning: Failed to update learning reminder schedule."
    );
  }

  return Response.json({
    received: true, // Tell QStash that the result has been received successfully
  });
}

export const POST = verifySignatureAppRouter(async () => {
  const prisma = GetPrismaClient();

  const upcomingLearning = await GetUpcomingLearning(
    prisma,
    LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE - 5
  );
  if (!upcomingLearning) {
    return await updateScheduleAndReturn(prisma);
  }

  const selectedLearnings = await GetNearbyLearnings(
    prisma,
    upcomingLearning.meeting_date
  );

  for (const learning of selectedLearnings) {
    const sessionDate = dayjs(learning.meeting_date)
      .tz("Asia/Jakarta")
      .format("dddd, D MMMM YYYY - HH:mm [WIB]");

    const conferenceName = learning.meeting_url
      ? getConferenceAttributes(
          getConferenceVariantFromURL(learning.meeting_url)
        ).conferenceName
      : "Online";

    let sessionPlace = conferenceName;
    if (learning.method === "ONSITE") {
      sessionPlace = learning.location_name ?? "Onsite";
    } else if (learning.method === "HYBRID") {
      sessionPlace = `${learning.location_name ?? "Onsite"} (Hybrid via ${conferenceName})`;
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
        cohort_id: learning.cohort_id,
      },
    });

    for (const member of memberList) {
      const firstName = member.user.full_name.split(" ")[0];

      const html = await render(
        createElement(SessionReminderEmail, {
          firstName,
          cohortName: learning.cohort.name,
          cohortImage: learning.cohort.image,
          sessionName: learning.name,
          sessionPlace,
          sessionDate,
          joinUrl:
            learning.method === "ONSITE"
              ? (learning.location_url ?? undefined)
              : (learning.meeting_url ?? undefined),
        })
      );

      await sendEmail({
        mailRecipients: [member.user.email],
        mailSubject: `Mulai Sebentar Lagi! ${learning.name} by MIFX`,
        mailHtml: html,
      });
    }
  }

  return await updateScheduleAndReturn(
    prisma,
    selectedLearnings.map((entry) => entry.id)
  );
});
