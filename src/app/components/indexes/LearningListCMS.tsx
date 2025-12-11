"use client";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import CreateLearningFormCMS from "../forms/CreateLearningFormCMS";
import LearningSessionItemCMS from "../items/LearningSessionItemCMS";

interface LearningListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function LearningListCMS({
  cohortId,
  sessionUserRole,
  sessionToken,
}: LearningListCMSProps) {
  const utils = trpc.useUtils();
  const [createLearning, setCreateLearning] = useState(false);

  const allowedRolesCreateLearning = [0, 2];
  const allowedRolesListLearning = [0, 1, 2, 3];
  const isAllowedCreateLearning =
    allowedRolesCreateLearning.includes(sessionUserRole);
  const isAllowedListLearning =
    allowedRolesListLearning.includes(sessionUserRole);

  // Fetch tRPC data
  const {
    data: learningListData,
    isLoading,
    isError,
  } = trpc.list.learnings.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  if (!isAllowedListLearning) return;

  return (
    <React.Fragment>
      <div className="flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">Learning Sessions</h2>
          {isAllowedCreateLearning && (
            <AppButton
              variant="outline"
              size="small"
              onClick={() => setCreateLearning(true)}
            >
              <Plus className="size-4" />
              Add sessions
            </AppButton>
          )}
        </div>
        {isLoading && (
          <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {isError && (
          <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {(learningListData?.list ?? []).length > 0 ? (
              <div className="learning-list flex flex-col gap-3">
                {learningListData?.list
                  .sort((a, b) =>
                    dayjs(a.meeting_date).diff(dayjs(b.meeting_date))
                  )
                  .map((post) => (
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
                      learningSessionMethod={post.method}
                      learningSessionDate={post.meeting_date}
                      learningSessionPlace={
                        post.location_name || "To Be Announced"
                      }
                      onDeleteSuccess={() => utils.list.learnings.invalidate()}
                    />
                  ))}
              </div>
            ) : (
              <p className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
                No Data
              </p>
            )}
          </>
        )}
      </div>

      {/* Create Learning */}
      {createLearning && (
        <CreateLearningFormCMS
          sessionToken={sessionToken}
          cohortId={cohortId}
          isOpen={createLearning}
          onClose={() => setCreateLearning(false)}
        />
      )}
    </React.Fragment>
  );
}
