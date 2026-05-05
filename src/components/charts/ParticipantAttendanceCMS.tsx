"use client";
import { trpc } from "@/trpc/client";
import { BarChart } from "@mui/x-charts";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface ParticipantAttendanceCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function ParticipantAttendanceCMS({
  sessionToken,
  cohortId,
}: ParticipantAttendanceCMSProps) {
  const { data, isLoading } = trpc.list.attendance_counts.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  const chartData = data?.list ?? [];

  return (
    <SectionContainerCMS
      title="Participants Attendance"
      headerAction={
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-bodycopy text-emphasis">
            <span
              className="inline-block size-2 rounded-sm"
              style={{ background: "#0165fc" }}
            />
            Attendance
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bodycopy text-emphasis">
            <span
              className="inline-block size-2 rounded-sm"
              style={{ background: "#e74d79" }}
            />
            No Attendance
          </span>
        </div>
      }
    >
      {isLoading ? (
        <AppLoadingComponents />
      ) : (
        <div className="bg-card-inside-bg rounded-lg overflow-hidden">
          {chartData.length > 0 ? (
            <BarChart
              height={240}
              series={[
                {
                  data: chartData.map((a) => a.check_in_count),
                  label: "Attendance",
                  color: "#0165fc",
                  stack: "total",
                },
                {
                  data: chartData.map((a) => a.has_no_attendance),
                  label: "No Attendance",
                  color: "#e74d79",
                  stack: "total",
                },
              ]}
              xAxis={[
                {
                  data: chartData.map((_, i) => `S${i + 1}`),
                  scaleType: "band",
                  tickLabelStyle: { fontSize: 10 },
                },
              ]}
              yAxis={[{ tickLabelStyle: { fontSize: 10 } }]}
              slots={{ legend: () => null }}
              margin={{ top: 10, right: 16, bottom: 28, left: 36 }}
              sx={{
                "& .MuiChartsAxis-tickLabel": {
                  fill: "var(--color-foreground)",
                },
                "& .MuiChartsAxis-line": { stroke: "var(--color-border)" },
                "& .MuiChartsAxis-tick": { stroke: "var(--color-border)" },
                "& .MuiChartsGrid-line": { stroke: "var(--color-border)" },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-[240px] text-sm text-emphasis font-bodycopy">
              No session data yet
            </div>
          )}
        </div>
      )}
    </SectionContainerCMS>
  );
}
