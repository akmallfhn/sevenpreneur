"use client";
import { Progress } from "@/components/ui/progress";

export default function AttendanceProgressBarLMS() {
  const totalSessions = 13;
  const attendedSessions = 2;
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
