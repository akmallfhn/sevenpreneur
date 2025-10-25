"use client";
import React, { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import FileItemLMS from "../items/FileItemLMS";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import SubmissionStatusLabelLMS from "../labels/SubmissionStatusLabelLMS";
import { SubmissionStatus } from "@/lib/app-types";
import AppButton from "../buttons/AppButton";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import CreateSubmissionFormLMS from "../forms/CreateSubmissionFormLMS";
import { DeleteSubmission } from "@/lib/actions";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditSubmissionFormLMS, {
  InitialData,
} from "../forms/EditSubmissionFormLMS";
import HeaderCohortEntityLMS from "../navigations/HeaderCohortEntityLMS";
import Image from "next/image";

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface ProjectDetailsLMS extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  sessionUserRole: number;
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectDocumentURL: string | null;
  projectDeadline: string;
  submissionId: number | null;
  submissionDocumentURL: string | null;
  submissionComment: string | null;
  submissionCreatedAt: string | null;
  submissionUpdatedAt: string | null;
  initialData: InitialData;
}

export default function ProjectDetailsLMS({
  cohortId,
  cohortName,
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  projectId,
  projectName,
  projectDescription,
  projectDocumentURL,
  projectDeadline,
  submissionId,
  submissionDocumentURL,
  submissionComment,
  submissionCreatedAt,
  submissionUpdatedAt,
  initialData,
}: ProjectDetailsLMS) {
  const router = useRouter();
  const [deadlineStatus, setDeadlineStatus] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("NOT_SUBMITTED");
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);

  const now = dayjs();
  const deadlineAt = dayjs(projectDeadline);
  const submittedAt = dayjs(submissionCreatedAt);
  const isOverdue = now.isAfter(deadlineAt);

  // Update Submission status
  useEffect(() => {
    setSubmissionStatus(submissionDocumentURL ? "SUBMITTED" : "NOT_SUBMITTED");
  }, [submissionDocumentURL]);

  // Update Deadline status
  useEffect(() => {
    const differentMilisecond = deadlineAt.diff(now);
    const isRemaining = differentMilisecond > 0;
    const absoluteDiff = Math.abs(differentMilisecond);
    const d = dayjs.duration(absoluteDiff);

    // Time Calculations
    const days = Math.floor(d.asDays());
    const hours = d.hours();
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);

    const formatted = parts.join(" ");

    if (isRemaining) {
      setDeadlineStatus(`${formatted || "less than an hour"} remaining`);
    } else {
      setDeadlineStatus(`Overdue ${formatted || "less than an hour"}`);
    }
  }, [deadlineAt, now]);

  // Update Submission Time
  useEffect(() => {
    if (!submissionCreatedAt) return;

    const differentMilisecond = submittedAt.diff(deadlineAt);
    const isEarly = differentMilisecond < 0;
    const absoluteDiff = Math.abs(differentMilisecond);
    const d = dayjs.duration(absoluteDiff);

    // Time Calculations
    const days = Math.floor(d.asDays());
    const hours = d.hours();
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);

    const formatted = parts.join(" ");

    if (isEarly) {
      setSubmittedTime(
        `Assignment was submitted ${formatted || "less than an hour"} early`
      );
    } else {
      setSubmittedTime(
        `Assignment was submitted ${formatted || "less than an hour"} late`
      );
    }
  }, [submissionCreatedAt, submittedAt, deadlineAt]);

  const handleDelete = async () => {
    if (!submissionId) return;
    try {
      const deleteSubmission = await DeleteSubmission({ submissionId });
      if (deleteSubmission.code === "NO_CONTENT") {
        toast.success("Submission Deleted", {
          description: "Your submission has been successfully removed.",
        });
        router.refresh();
      } else {
        toast.error("Failed to Delete", {
          description: "We couldn’t delete your submission. Please try again.",
        });
      }
    } catch (error) {
      console.error("Delete Submission Error:", error);
      toast.error("Something Went Wrong", {
        description:
          "An unexpected error occurred while deleting your submission.",
      });
    }
  };

  return (
    <React.Fragment>
      <div className="root-page hidden flex-col pl-64 w-full h-full gap-4 items-center pb-8 lg:flex">
        <HeaderCohortEntityLMS
          cohortId={cohortId}
          cohortName={cohortName}
          sessionUserName={sessionUserName}
          sessionUserAvatar={sessionUserAvatar}
          sessionUserRole={sessionUserRole}
          headerTitle="Assignment Overview"
          headerDescription="Test your knowledge and skills by completing the assignment below."
        />
        <div className="body-project max-w-[calc(100%-4rem)] w-full flex gap-4">
          <main className="w-full flex flex-col flex-2 gap-4">
            <div className="project-attributes flex flex-col w-full gap-3 p-4 bg-white border rounded-lg">
              <h2 className="project-name font-bodycopy font-bold text-2xl">
                {projectName}
              </h2>
              <div className="project-description flex flex-col gap-1">
                <p className="font-bold font-bodycopy text-[15px]">
                  Assignment Brief
                </p>
                <p className="font-bodycopy text-[15px]">
                  {projectDescription}
                </p>
              </div>
              {projectDocumentURL && (
                <FileItemLMS
                  fileName="Guideline Document"
                  fileURL={projectDocumentURL}
                />
              )}
            </div>

            <div className="flex flex-col w-full bg-white p-4 gap-3 border rounded-xl">
              <div className="flex flex-col">
                <h2 className="font-bold font-bodycopy">Submission</h2>
                <p className="text-alternative text-sm font-medium font-bodycopy">
                  Upload your finalized task file to complete your submission.
                  Once submitted, your document will be reviewed as part of the
                  assessment process.
                </p>
              </div>
              {/* Create Form */}
              {!submissionDocumentURL && (
                <CreateSubmissionFormLMS projectId={projectId} />
              )}

              {/* Details Submission */}
              {submissionDocumentURL && !isOpenEditForm && (
                <div className="project flex flex-col w-full gap-3">
                  <div className="project-document flex flex-col gap-2">
                    <p className="font-bold font-bodycopy text-[15px]">
                      Submitted File
                    </p>
                    <FileItemLMS
                      fileName="Project Document"
                      fileURL={submissionDocumentURL}
                    />
                  </div>
                  {!isOverdue && !isOpenEditForm && (
                    <div className="submit flex w-full justify-end items-center gap-3">
                      <AppButton
                        size="medium"
                        variant="destructive"
                        onClick={() => setIsOpenDeleteConfirmation(true)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </AppButton>
                      <AppButton
                        size="medium"
                        variant="outline"
                        onClick={() => setIsOpenEditForm(true)}
                      >
                        <Pencil className="size-4" />
                        Change
                      </AppButton>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Form */}
              {isOpenEditForm && (
                <EditSubmissionFormLMS
                  initialData={initialData}
                  onClose={() => setIsOpenEditForm(false)}
                />
              )}
            </div>
          </main>
          <aside className="aside-contents w-full flex flex-col flex-1 gap-4">
            <div className="submission-attributes flex flex-col w-full p-4 bg-white border gap-3 rounded-lg">
              <div className="submission-status flex gap-1">
                <div
                  className={`flex size-2.5 m-1.5 justify-center items-center rounded-full bg-[#D99E00]`}
                />
                <div className="flex flex-col gap-2">
                  <p className="font-bold font-bodycopy text-[15px]">Status</p>
                  <SubmissionStatusLabelLMS variant={submissionStatus} />
                </div>
              </div>
              <div className="submission-deadline-at flex gap-2">
                <div
                  className={`flex size-2.5 m-1.5 justify-center items-center rounded-full bg-secondary`}
                />
                <div className="flex flex-col">
                  <p className="font-bold font-bodycopy text-[15px]">
                    Due Date
                  </p>
                  <p className="font-medium font-bodycopy text-sm">
                    {dayjs(projectDeadline).format("DD MMM YYYY [at] HH:mm")}
                  </p>
                </div>
              </div>
              <div className="submission-created-at flex gap-2">
                <div
                  className={`flex size-2.5 m-1.5 justify-center items-center rounded-full bg-[#499E95]`}
                />
                <div className="flex flex-col">
                  <p className="font-bold font-bodycopy text-[15px]">
                    Submitted at
                  </p>
                  <p className="font-medium font-bodycopy text-sm">
                    {submissionCreatedAt
                      ? dayjs(submissionCreatedAt).format(
                          "DD MMM YYYY [at] HH:mm"
                        )
                      : "-"}
                  </p>
                  <p className="font-medium font-bodycopy text-sm">
                    {submissionDocumentURL ? submittedTime : deadlineStatus}
                  </p>
                </div>
              </div>
            </div>
            <div className="submission-comment flex flex-col w-full p-4 bg-white border gap-3 rounded-lg">
              <h3 className="section-name font-bodycopy font-bold text-[15px]">
                Feedback from us
              </h3>
              {submissionComment ? (
                <div className="comment-container flex flex-col-reverse gap-2">
                  <div className="comment-author flex items-center gap-2">
                    <div className="comment-author-image w-6 aspect-square rounded-full overflow-hidden">
                      <Image
                        className="object-cover w-full h-full"
                        src={
                          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square.svg"
                        }
                        alt="Comment Author"
                        width={200}
                        height={200}
                      />
                    </div>
                    <p className="font-semibold font-bodycopy text-sm">
                      Sevenpreneur Team
                    </p>
                  </div>
                  <p className="text-[#333333]/90 font-medium font-bodycopy text-sm whitespace-pre-line">
                    {submissionComment}
                  </p>
                </div>
              ) : (
                <p className="text-[#333333]/90 font-medium font-bodycopy text-sm whitespace-pre-line">
                  Feedback will show up here once it’s ready!
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Delete Submission */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete your submission? This action cannot be undone.`}
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={isOpenDeleteConfirmation}
          onClose={() => setIsOpenDeleteConfirmation(false)}
          onConfirm={() => {
            handleDelete();
            setIsOpenDeleteConfirmation(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
