import { SessionReminderEmail } from "@/components/emails/SessionReminderEmail";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";
import { sendEmail } from "@/lib/mailtrap";
import GetPrismaClient from "@/lib/prisma";
import GetQStashClient from "@/lib/qstash";
import {
  GetLearnings,
  GetNearbyLearnings,
  GetUpcomingLearning,
  LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE,
  UpdateLearningReminderSchedule,
} from "@/trpc/utils/schedule_reminder";
import { render } from "@react-email/render";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { createElement } from "react";

const SEND_REMINDER_MAX_DURATION = 40 * 1000; // 40 seconds

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

type QStashLearningReminder = {
  progress?: Record<number, number>;
};

async function updateScheduleAndReturn(
  prisma: ReturnType<typeof GetPrismaClient>,
  qstash: ReturnType<typeof GetQStashClient>,
  exclusionList?: number[] // learning IDs to be excluded
) {
  const isUpdateScheduleSuccess = await UpdateLearningReminderSchedule(
    prisma,
    qstash,
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

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const startTime = Date.now();

  const reqBody: QStashLearningReminder = await req.json();

  const prisma = GetPrismaClient();
  const qstash = GetQStashClient();

  let currentProgress = {} as Record<number, number>;
  let selectedLearnings = [] as Awaited<ReturnType<typeof GetLearnings>>;
  if (reqBody.progress) {
    currentProgress = reqBody.progress;
    selectedLearnings = await GetLearnings(
      prisma,
      Object.keys(reqBody.progress).map((entry) => Number(entry))
    );
  } else {
    const upcomingLearning = await GetUpcomingLearning(
      prisma,
      LEARNING_REMINDER_SCHEDULE_MINUS_MINUTE - 5
    );
    if (!upcomingLearning) {
      return await updateScheduleAndReturn(prisma, qstash);
    }

    selectedLearnings = await GetNearbyLearnings(
      prisma,
      upcomingLearning.meeting_date
    );

    for (const learning of selectedLearnings) {
      currentProgress[learning.id] = -1; // None (before index 0)
    }
  }

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
      orderBy: [{ user: { created_at: "asc" } }, { user: { id: "asc" } }],
    });

    // +1 to get the next index
    for (let i = currentProgress[learning.id] + 1; i < memberList.length; i++) {
      const member = memberList[i];

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

      currentProgress[learning.id] = i;

      // Queue another batch if already running for more than max duration
      const duration = Date.now() - startTime;
      if (duration >= SEND_REMINDER_MAX_DURATION) {
        await qstash.publishJSON({
          url: "https://api.sevenpreneur.com/qstash/schedule-learning",
          body: {
            progress: currentProgress,
          },
        });

        return Response.json({
          received: true,
        });
      }
    }
  }

  return await updateScheduleAndReturn(
    prisma,
    qstash,
    selectedLearnings.map((entry) => entry.id)
  );
});
