"use client";
import dayjs, { tz } from "dayjs";
import { CalendarFold } from "lucide-react";
import AppButton from "../buttons/AppButton";
import { LearningSessionList } from "../tabs/CohortDetailsTabsLMS";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface NearestScheduleCardLMSProps {
  learningList: LearningSessionList[];
}

export default function NearestScheduleCardLMS({
  learningList,
}: NearestScheduleCardLMSProps) {
  const activeLearnings = learningList.filter(
    (learning) => learning.status === "ACTIVE"
  );

  if (activeLearnings.length === 0) {
    return;
  }

  const now = dayjs().tz("Asia/Jakarta");

  const upcomingSchedule = activeLearnings
    .filter((learning) =>
      dayjs(learning.meeting_date).add(2, "hour").isAfter(now)
    )
    .sort(
      (a, b) =>
        dayjs(a.meeting_date).valueOf() - dayjs(b.meeting_date).valueOf()
    );

  const nearestSchedule = upcomingSchedule[0] || null;

  return (
    <div className="nearest-schedule-box relative flex flex-col w-full bg-coal-black p-4 gap-6 border rounded-lg">
      {nearestSchedule ? (
        <div className="nearest-schedule-container flex flex-col gap-2">
          <p className="section-title font-bodycopy text-white/50 text-[15px]">
            Next learning topic
          </p>
          <h2 className="learning-name font-brand text-xl font-bold text-white">
            {nearestSchedule.name}
          </h2>
          <div className="learning-date flex gap-2 items-center text-white/70">
            <div className="border border-white/70 p-1 rounded-sm">
              <CalendarFold className="size-4" />
            </div>
            <p className="flex font-bodycopy font-medium text-[15px]">
              {dayjs(nearestSchedule.meeting_date).format(
                "ddd[,] DD MMM YYYY [-] HH:mm"
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="nearest-schedule-container flex flex-col gap-2">
          <p className="section-title font-bodycopy text-alternative text-[15px]">
            Congratulations🎉
          </p>
          <h2 className="learning-name font-brand text-xl font-bold text-white">
            Program Fully Completed
          </h2>
          <p className="flex font-bodycopy font-medium text-[15px] text-alternative">
            Your Commitment Made It Happen.
          </p>
        </div>
      )}

      {nearestSchedule ? (
        <a
          href={
            nearestSchedule.method !== "ONSITE"
              ? nearestSchedule.meeting_url ?? undefined
              : nearestSchedule.location_url ?? undefined
          }
          className="flex w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AppButton className="w-full">Launch Meeting</AppButton>
        </a>
      ) : (
        <AppButton>Rate the experience🌟</AppButton>
      )}
    </div>
  );
}
