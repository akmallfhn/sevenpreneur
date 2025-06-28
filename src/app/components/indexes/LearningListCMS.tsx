"use client";
import React, { useState } from "react";
import { Flag, Loader2, Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import LearningSessionItemCMS from "../items/LearningSessionItemCMS";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import CreateLearningFormCMS from "../forms/CreateLearningFormCMS";

interface LearningListCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function LearningListCMS({
  cohortId,
  sessionToken,
}: LearningListCMSProps) {
  const [createLearning, setCreateLearning] = useState(false);
  // --- Call data from tRPC
  const {
    data: learningListData,
    isLoading: isLoadingLearningList,
    isError: isErrorLearningList,
  } = trpc.list.learnings.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  // --- Extract variable
  const isLoading = isLoadingLearningList;
  const isError = isErrorLearningList;
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">Learnings</h2>
          <AppButton
            variant="outline"
            size="small"
            onClick={() => setCreateLearning(true)}
          >
            <Plus className="size-4" />
            Add sessions
          </AppButton>
        </div>
        {/* --- Null Condition */}
        {(!learningListData?.list || learningListData.list.length === 0) && (
          <div className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}
        {/* --- LIVE NOW */}
        {learningListData?.list.some((post) =>
          dayjs().isSame(dayjs(post.meeting_date), "day")
        ) && (
          <div className="flex flex-col gap-3">
            <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
              LIVE NOW
            </h3>
            <div className="learning-list flex flex-col gap-3">
              {learningListData?.list
                .filter((post) =>
                  dayjs().isSame(dayjs(post.meeting_date), "day")
                )
                .sort((a, b) =>
                  dayjs(a.meeting_date).diff(dayjs(b.meeting_date))
                )
                .map((post, index) => (
                  <LearningSessionItemCMS
                    key={index}
                    cohortId={cohortId}
                    sessionLearningId={post.id}
                    sessionName={post.name}
                    sessionEducatorName={post.speaker?.full_name}
                    sessionEducatorAvatar={post.speaker?.avatar}
                    sessionMethod={post.method}
                    sessionDate={post.meeting_date}
                    sessionMeetingURL={post.meeting_url}
                  />
                ))}
            </div>
          </div>
        )}
        {/* --- UPCOMING */}
        {learningListData?.list.some((post) =>
          dayjs().isBefore(dayjs(post.meeting_date), "day")
        ) && (
          <div className="flex flex-col gap-3">
            <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
              UPCOMING
            </h3>
            <div className="learning-list flex flex-col gap-3">
              {learningListData?.list
                .filter((post) =>
                  dayjs().isBefore(dayjs(post.meeting_date), "day")
                )
                .sort((a, b) =>
                  dayjs(a.meeting_date).diff(dayjs(b.meeting_date))
                )
                .map((post, index) => (
                  <LearningSessionItemCMS
                    key={index}
                    cohortId={cohortId}
                    sessionLearningId={post.id}
                    sessionName={post.name}
                    sessionEducatorName={post.speaker?.full_name}
                    sessionEducatorAvatar={post.speaker?.avatar}
                    sessionMethod={post.method}
                    sessionDate={post.meeting_date}
                    sessionMeetingURL={post.meeting_url}
                  />
                ))}
            </div>
          </div>
        )}
        {/* --- COMPLETED */}
        {learningListData?.list.some((post) =>
          dayjs().isAfter(dayjs(post.meeting_date), "day")
        ) && (
          <div className="flex flex-col gap-3">
            <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
              COMPLETED
            </h3>
            <div className="flex flex-col gap-3">
              {learningListData?.list
                .filter((post) =>
                  dayjs().isAfter(dayjs(post.meeting_date), "day")
                )
                .sort((a, b) =>
                  dayjs(a.meeting_date).diff(dayjs(b.meeting_date))
                )
                .map((post, index) => (
                  <LearningSessionItemCMS
                    key={index}
                    cohortId={cohortId}
                    sessionLearningId={post.id}
                    sessionName={post.name}
                    sessionEducatorName={post.speaker?.full_name}
                    sessionEducatorAvatar={post.speaker?.avatar}
                    sessionMethod={post.method}
                    sessionDate={post.meeting_date}
                    sessionMeetingURL={post.meeting_url}
                  />
                ))}
            </div>
          </div>
        )}
        {/* <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
        Load more
      </p> */}
      </div>

      {/* --- Form Create Learning */}
      {createLearning && (
        <CreateLearningFormCMS
          cohortId={cohortId}
          isOpen={createLearning}
          onClose={() => setCreateLearning(false)}
        />
      )}
    </React.Fragment>
  );
}
