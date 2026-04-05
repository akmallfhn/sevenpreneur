"use client";
import { Progress } from "@/components/ui/progress";

interface AttendanceProgressBarLMSProps {
  attendanceCount: number;
  learningCount: number;
}

export default function AttendanceProgressBarLMS(
  props: AttendanceProgressBarLMSProps
) {
  const attendedRate = Math.round(
    (props.attendanceCount / props.learningCount) * 100
  );

  if (props.learningCount === 0) {
    return;
  }

  return (
    <div className="attendance-progress flex flex-col w-full bg-white p-4 gap-3 border rounded-lg">
      <p className="section-name font-bold font-bodycopy">Attendance</p>
      <div className="progress-indikator flex flex-col w-full gap-2">
        <div className="progress-number flex w-full items-center justify-between font-bodycopy text-sm">
          <p className="font-bold">{`${attendedRate}%`}</p>
          <p className="text-[#333333]/60">{`${props.attendanceCount} of ${props.learningCount} sessions`}</p>
        </div>
        <Progress value={attendedRate} />
      </div>
    </div>
  );
}
