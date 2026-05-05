"use client";
import { trpc } from "@/trpc/client";
import { PieChart } from "@mui/x-charts";
import dayjs from "dayjs";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface PerformanceSnapshotCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function PerformanceSnapshotCMS({
  sessionToken,
  cohortId,
}: PerformanceSnapshotCMSProps) {
  const { data: membersData, isLoading: isLoadingMembers } =
    trpc.list.cohortMembers.useQuery(
      { cohort_id: cohortId },
      { enabled: !!sessionToken }
    );

  const { data: learningsData, isLoading: isLoadingLearnings } =
    trpc.list.learnings.useQuery(
      { cohort_id: cohortId },
      { enabled: !!sessionToken }
    );

  const isLoading = isLoadingMembers || isLoadingLearnings;

  const now = dayjs();
  const pastSessionsCount = (learningsData?.list ?? []).filter((l) =>
    dayjs(l.meeting_date).isBefore(now)
  ).length;

  const enrolledStudents = (membersData?.list ?? []).filter(
    (m) => m.role_id === 3
  );
  const totalStudents = enrolledStudents.length;

  const performanceBands = enrolledStudents.reduce(
    (acc, s) => {
      const rate =
        pastSessionsCount > 0
          ? s.attended_learning_count / pastSessionsCount
          : 0;
      if (rate >= 1.0) acc.excellent++;
      else if (rate >= 0.8) acc.good++;
      else if (rate >= 0.6) acc.average++;
      else acc.poor++;
      return acc;
    },
    { excellent: 0, good: 0, average: 0, poor: 0 }
  );

  return (
    <SectionContainerCMS title="Performance Snapshot">
      {isLoading ? (
        <AppLoadingComponents />
      ) : pastSessionsCount > 0 && totalStudents > 0 ? (
        <>
          <div className="bg-card-inside-bg rounded-lg overflow-hidden">
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: performanceBands.excellent,
                      label: "Excellent",
                      color: "#22c55e",
                    },
                    {
                      id: 1,
                      value: performanceBands.good,
                      label: "Good",
                      color: "#60a5fa",
                    },
                    {
                      id: 2,
                      value: performanceBands.average,
                      label: "Average",
                      color: "#fbbf24",
                    },
                    {
                      id: 3,
                      value: performanceBands.poor,
                      label: "Poor",
                      color: "#f87171",
                    },
                  ].filter((d) => d.value > 0),
                  innerRadius: 42,
                  outerRadius: 68,
                  paddingAngle: 2,
                  cornerRadius: 3,
                },
              ]}
              height={160}
              slots={{ legend: () => null }}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              sx={{
                "& .MuiPieArc-root": {
                  stroke: "var(--color-card-inside-bg)",
                  strokeWidth: 2,
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            {[
              {
                label: "Excellent (100%)",
                value: performanceBands.excellent,
                color: "bg-green-500",
              },
              {
                label: "Good (≥80%)",
                value: performanceBands.good,
                color: "bg-blue-400",
              },
              {
                label: "Average (≥60%)",
                value: performanceBands.average,
                color: "bg-amber-400",
              },
              {
                label: "Poor (<60%)",
                value: performanceBands.poor,
                color: "bg-red-400",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${color}`} />
                  <p className="text-xs font-bodycopy text-emphasis">{label}</p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bodycopy font-bold">{value}</p>
                  {totalStudents > 0 && (
                    <p className="text-[10px] text-emphasis font-bodycopy">
                      ({Math.round((value / totalStudents) * 100)}%)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xs text-emphasis font-bodycopy text-center py-3">
          No sessions have run yet
        </p>
      )}
    </SectionContainerCMS>
  );
}
