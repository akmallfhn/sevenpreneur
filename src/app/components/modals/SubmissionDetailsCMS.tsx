"use client";
import { getSubmissionTiming } from "@/lib/date-time-manipulation";
import { trpc } from "@/trpc/client";
import { AIModelName } from "@/trpc/routers/ai_tool/util.ai_tool";
import dayjs from "dayjs";
import { Loader2, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import TextAreaCMS from "../fields/TextAreaCMS";
import FileItemLMS from "../items/FileItemLMS";
import SheetLineItemCMS from "../items/SheetLineItemCMS";
import UserItemCMS from "../items/UserItemCMS";
import AppSheet from "./AppSheet";
import { AIResultSubmissionAnalysis } from "@/trpc/routers/ai_tool/prompt.ai_tool";

interface SubmissionDetailsCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  projectDeadline?: string;
  submissionId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionDetailsCMS(props: SubmissionDetailsCMSProps) {
  const utils = trpc.useUtils();

  const updateComment = trpc.update.submission.useMutation();
  const useAISubmission = trpc.use.ai.submissionAnalysis.useMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [intervalMs, setIntervalMs] = useState<number | false>(2000);
  const [submissionAnalysisId, setSubmissionAnalysisId] = useState("");

  const allowedRolesUpdateSubmission = [0, 1, 3];
  const isAllowedUpdateSubmission = allowedRolesUpdateSubmission.includes(
    props.sessionUserRole
  );

  // Return initial data
  const { data, isLoading, isError } = trpc.read.submission.useQuery(
    { id: props.submissionId },
    { enabled: !!props.submissionId }
  );
  const submissionDetails = data?.submission;

  const { isEarly, longMessage } = getSubmissionTiming(
    submissionDetails?.created_at,
    props.projectDeadline
  );

  // Comment State
  const [commentDraft, setCommentDraft] = useState("");

  // Side effect for update state draft comment
  useEffect(() => {
    if (!submissionDetails) return;

    setCommentDraft(submissionDetails.comment ?? "");
  }, [submissionDetails]);

  // Refetch Result AI
  const { data: submissionAnalysisData } =
    trpc.read.ai.submissionAnalysis.useQuery(
      { id: submissionAnalysisId },
      {
        refetchInterval: intervalMs,
        enabled: !!props.sessionToken && !!submissionAnalysisId,
      }
    ) as unknown as {
      data: {
        code: string;
        message: string;
        result: {
          result: AIResultSubmissionAnalysis | null;
          is_done: boolean;
          expired_at: Date | null;
        };
      };
    };
  const isDoneResult = submissionAnalysisData?.result.is_done;

  // Update State New Comment
  useEffect(() => {
    if (!isDoneResult) return;

    const aiComment = submissionAnalysisData?.result.result?.comment;
    if (!aiComment) return;

    setIntervalMs(false);
    setGeneratingAI(false);

    setCommentDraft((prev) =>
      prev?.trim() ? `${prev}\n\n---\n${aiComment}` : aiComment
    );

    toast.success("AI feedback generated.");
  }, [isDoneResult, submissionAnalysisData?.result?.result?.comment]);

  // Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (!props.submissionId) return;

  // Handle Comment Change
  const handleCommentChange = (value: string) => {
    setCommentDraft(value);
  };

  // Handle Analysis by AI
  const handleAISubmission = async () => {
    setGeneratingAI(true);

    try {
      useAISubmission.mutate(
        {
          model: "gpt-5-mini" as AIModelName,
          submission_id: props.submissionId,
        },
        {
          onSuccess: (data) => {
            setSubmissionAnalysisId(data.result_id);
          },
          onError: (err) => {
            toast.error("Failed to generate AI", {
              description: err.message,
            });
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Handle update comment
  const handleUpdateComment = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateComment.mutate(
        {
          // Mandatory fields
          id: props.submissionId,
          document_url: submissionDetails?.document_url,

          // Optional fields
          comment: commentDraft.trim() ? commentDraft.trim() : null,
        },
        {
          onSuccess: () => {
            toast.success("Feedback updated successfully 🎉");
            utils.read.submission.invalidate({ id: props.submissionId });
            utils.list.submissions.invalidate();
            props.onClose();
          },
          onError: (err) => {
            toast.error("Failed to update feedback", {
              description: err.message,
            });
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppSheet
      sheetName="Submission Details"
      sheetDescription={`ID User: ${submissionDetails?.submitter_id}`}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      {isLoading && (
        <div className="flex w-full h-full items-center justify-center text-alternative">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
          No Data
        </div>
      )}
      {!isLoading && !isError && submissionDetails && (
        <div className="container flex flex-col h-full px-6 pb-20 gap-5 overflow-y-auto">
          <div className="submitter-details flex flex-col gap-2 p-3 border border-outline rounded-md">
            <h5 className="font-bodycopy font-bold text-[15px]">
              Submitter Details
            </h5>
            <UserItemCMS
              userName={submissionDetails.submitter.full_name}
              userAvatar={
                submissionDetails.submitter.avatar ||
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
              }
              userEmail={submissionDetails.submitter.email}
            />
          </div>
          <div className="submitter-details flex flex-col gap-2">
            <h5 className="font-bodycopy font-bold text-[15px]">
              Submission Document
            </h5>
            <FileItemLMS
              fileName={`Assignment - ${submissionDetails.submitter.full_name}`}
              fileURL={submissionDetails.document_url || ""}
            />
          </div>
          <SheetLineItemCMS itemName="Submitted at">
            {dayjs(submissionDetails?.created_at).format(
              "ddd, DD MMM YYYY HH:mm"
            )}
          </SheetLineItemCMS>
          <SheetLineItemCMS itemName="Timing Status">
            {isEarly ? (
              longMessage
            ) : (
              <p className="text-destructive">{longMessage}</p>
            )}
          </SheetLineItemCMS>
          <TextAreaCMS
            textAreaId="submission-comment"
            textAreaName="Mentor Feedback"
            textAreaHeight="h-40"
            textAreaPlaceholder="Write feedback for user assignment"
            characterLength={4000}
            value={commentDraft ?? ""}
            onTextAreaChange={handleCommentChange}
          />
          <div className="w-full">
            <AppButton
              size="small"
              variant="primaryLight"
              onClick={handleAISubmission}
              disabled={generatingAI}
            >
              {generatingAI && <Loader2 className="animate-spin size-5" />}
              Get Feedback from AI
              <Sparkles className="size-4" fill="#0165fc" stroke={"0"} />
            </AppButton>
          </div>
        </div>
      )}
      {isAllowedUpdateSubmission && (
        <div className="update-comment sticky bottom-0 w-full p-4 bg-white z-40">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            onClick={handleUpdateComment}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Update Feedback
          </AppButton>
        </div>
      )}
    </AppSheet>
  );
}
