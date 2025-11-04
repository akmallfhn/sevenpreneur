"use client";
import { Progress } from "@/components/ui/progress";
import { LearningSessionList } from "../tabs/CohortDetailsTabsLMS";
import dayjs from "dayjs";

interface AttendanceProgressBarLMSProps {
  learningList: LearningSessionList[];
}

export default function AttendanceProgressBarLMS({
  learningList,
}: AttendanceProgressBarLMSProps) {
  if (learningList.length === 0) {
    return;
  }

  const totalSessions = learningList.length;
  const attendedSessions = learningList.filter((learning) =>
    dayjs(learning.meeting_date).isBefore(dayjs(), "day")
  ).length;
  const attendedRate = Math.round((attendedSessions / totalSessions) * 100);

  return (
    <div className="attendance-progress flex flex-col w-full bg-white p-4 gap-3 border rounded-lg">
      <p className="section-name font-bold font-bodycopy">Attendance</p>
      <div className="progress-indikator flex flex-col w-full gap-2">
        <div className="progress-number flex w-full items-center justify-between font-bodycopy text-sm">
          <p className="font-bold">{`${attendedRate}%`}</p>
          <p className="text-[#333333]/60">{`${attendedSessions} of ${totalSessions} sessions`}</p>
        </div>
        <Progress value={attendedRate} />
      </div>
    </div>
  );
}
