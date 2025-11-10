"use client";
import { Loader2 } from "lucide-react";
import AppSheet from "./AppSheet";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import UserItemCMS from "../items/UserItemCMS";
import SheetLineItemCMS from "../items/SheetLineItemCMS";
import { getSubmissionTiming } from "@/lib/date-time-manipulation";
import FileItemLMS from "../items/FileItemLMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface SubmissionDetailsCMSProps {
  projectDeadline?: string;
  submissionId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionDetailsCMS({
  projectDeadline,
  submissionId,
  isOpen,
  onClose,
}: SubmissionDetailsCMSProps) {
  const utils = trpc.useUtils();
  const updateComment = trpc.update.submission.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Return initial data
  const { data, isLoading, isError } = trpc.read.submission.useQuery(
    { id: submissionId },
    { enabled: !!submissionId }
  );
  const submissionDetails = data?.submission;

  const { isEarly, longMessage } = getSubmissionTiming(
    submissionDetails?.created_at,
    projectDeadline
  );

  const [comment, setComment] = useState(submissionDetails?.comment);

  // Iterate initial data (so it doesn't get lost)
  useEffect(() => {
    if (submissionDetails) {
      setComment(submissionDetails.comment ?? "");
    }
  }, [submissionDetails]);

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

  if (!submissionId) return;

  // Handle Comment Change
  const handleCommentChange = (value: string) => {
    setComment(value);
  };

  // Handle update comment
  const handleUpdateComment = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!comment?.trim()) {
      toast.error("Oops! Something's missing.", {
        description: "Please write your feedback before submitting.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      updateComment.mutate(
        {
          // Mandatory fields:
          id: submissionId,
          document_url: submissionDetails?.document_url,
          comment: comment.trim(),
        },
        {
          onSuccess: () => {
            toast.success("Feedback updated successfully 🎉");
            utils.read.submission.invalidate({ id: submissionId });
            utils.list.submissions.invalidate();
            onClose();
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
      isOpen={isOpen}
      onClose={onClose}
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
            value={comment ?? ""}
            onTextAreaChange={handleCommentChange}
          />
        </div>
      )}
      <div className="cancel-invoice sticky bottom-0 w-full p-4 bg-white z-40">
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
    </AppSheet>
  );
}
