"use client";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import LearningSessionItemCMS from "../items/LearningSessionItemCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface LearningListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
  onClickAdd?: () => void;
}

export default function LearningListCMS({
  sessionToken,
  sessionUserRole,
  cohortId,
  onClickAdd,
}: LearningListCMSProps) {
  const utils = trpc.useUtils();
  const { resolvedTheme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const isAllowedCreate = [0, 2].includes(sessionUserRole);

  const { data, isLoading } = trpc.list.learnings.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  const allLearnings = [...(data?.list ?? [])].sort((a, b) =>
    dayjs(a.meeting_date).diff(dayjs(b.meeting_date))
  );
  const sessionsToShow = showAll ? allLearnings : allLearnings.slice(0, 3);

  return (
    <SectionContainerCMS
      title="Learning Sessions"
      headerAction={
        isAllowedCreate && onClickAdd ? (
          <AppButton
            variant={resolvedTheme === "dark" ? "dark" : "light"}
            size="small"
            onClick={onClickAdd}
          >
            <Plus className="size-3.5" />
            Add Session
          </AppButton>
        ) : undefined
      }
    >
      {isLoading ? (
        <AppLoadingComponents />
      ) : allLearnings.length > 0 ? (
        <div className="flex flex-col gap-2">
          {sessionsToShow.map((post) => (
            <LearningSessionItemCMS
              key={post.id}
              sessionToken={sessionToken}
              sessionUserRole={sessionUserRole}
              cohortId={cohortId}
              learningSessionId={post.id}
              learningSessionName={post.name}
              learningSessionEducatorName={
                post.speaker?.full_name || "Sevenpreneur Educator"
              }
              learningSessionEducatorAvatar={
                post.speaker?.avatar ||
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
              }
              learningSessionDate={post.meeting_date}
              attendanceCount={post.check_in_count}
              noAttendanceCount={post.has_no_attendance}
              onDeleteSuccess={() => utils.list.learnings.invalidate()}
            />
          ))}

          {allLearnings.length > 3 && (
            <button
              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm font-bodycopy font-medium text-emphasis hover:text-foreground hover:bg-card-inside-bg rounded-lg transition"
              onClick={() => setShowAll((p) => !p)}
            >
              {showAll ? (
                <>
                  <ChevronUp className="size-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" />
                  Show all {allLearnings.length} sessions
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-center text-emphasis font-bodycopy py-4">
          No sessions yet
        </p>
      )}
    </SectionContainerCMS>
  );
}
