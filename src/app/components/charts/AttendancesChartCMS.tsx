"use client";
import { trpc } from "@/trpc/client";
import { LineChart } from "@mui/x-charts";
import AppButton from "../buttons/AppButton";
import { Eye } from "lucide-react";
import Link from "next/link";

interface AttendancesChartCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function AttendancesChartCMS(props: AttendancesChartCMSProps) {
  const allowedRolesDetailsMembers = [0, 1, 2];
  const isAllowedDetailsMembers = allowedRolesDetailsMembers.includes(
    props.sessionUserRole
  );
  const { data: attendanceCount } = trpc.list.attendance_counts.useQuery(
    {
      cohort_id: props.cohortId,
    },
    { enabled: !!props.sessionToken }
  );

  const attendanceList = attendanceCount?.list ?? [];

  return (
    <div className="attendance flex flex-col gap-3 p-3 bg-section-background rounded-md">
      <div className="section-name flex justify-between items-center">
        <h2 className="label-name font-brand font-bold">
          Participants Attendance
        </h2>
        {isAllowedDetailsMembers && (
          <Link href={`/cohorts/${props.cohortId}/members`}>
            <AppButton variant="outline" size="small">
              <Eye className="size-4" />
              Check Details
            </AppButton>
          </Link>
        )}
      </div>
      <div className="attendance-charts bg-white w-full rounded-md overflow-hidden">
        <LineChart
          width={600}
          height={300}
          xAxis={[
            {
              data: attendanceList.map((_, index) => index + 1),
              valueFormatter: (value: number) => `Session ${value}`,
            },
          ]}
          series={[
            {
              label: "Check-In Count",
              data: attendanceList.map((item) => item.check_in_count),
            },
            {
              label: "Check-Out Count",
              data: attendanceList.map((item) => item.check_out_count),
            },
            {
              label: "No Attendance Count",
              data: attendanceList.map((item) => item.has_no_attendance),
            },
          ]}
        />
      </div>
    </div>
  );
}
