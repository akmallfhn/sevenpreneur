"use client";
import React, { useEffect, useState } from "react";
import { getFileVariantFromURL } from "@/lib/file-variants";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import FileItemLMS from "../items/FileItemLMS";
import HeaderProjectDetailsLMS from "../navigations/HeaderProjectDetailsLMS";
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
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("NOT_SUBMITTED");
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);

  const now = dayjs();
  const deadline = dayjs(projectDeadline);
  const isOverdue = now.isAfter(deadline);

  // Update submission status
  useEffect(() => {
    setSubmissionStatus(submissionDocumentURL ? "SUBMITTED" : "NOT_SUBMITTED");
  }, [submissionDocumentURL]);

  useEffect(() => {
    const updateDeadlineStatus = () => {
      const now = dayjs();
      const deadline = dayjs(projectDeadline);
      const differentMilisecond = deadline.diff(now);
      const absoluteDiff = Math.abs(differentMilisecond);
      const d = dayjs.duration(absoluteDiff);

      // Time Calculations
      const years = Math.floor(d.asYears());
      const months = Math.floor(d.asMonths() % 12);
      const days = Math.floor(d.asDays() % 30);
      const hours = d.hours();

      const parts = [];
      if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
      if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
      if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
      if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);

      const formatted = parts.join(" ");

      if (differentMilisecond > 0) {
        setDeadlineStatus(`Time remaining ${formatted || "less than an hour"}`);
      } else {
        setDeadlineStatus(`Overdue ${formatted || "less than an hour"}`);
      }
    };

    updateDeadlineStatus();
    const interval = setInterval(updateDeadlineStatus, 60_000);
    return () => clearInterval(interval);
  }, [projectDeadline]);

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
        <HeaderProjectDetailsLMS
          cohortId={cohortId}
          cohortName={cohortName}
          sessionUserName={sessionUserName}
          sessionUserAvatar={sessionUserAvatar}
          sessionUserRole={sessionUserRole}
          headerTitle="Assignment Overview"
          headerDescription="Test your knowledge and skills by completing the assignment below."
        />
        <div className="body-project max-w-[calc(100%-4rem)] w-full flex gap-4 rounded-xl">
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
                  variants={getFileVariantFromURL(projectDocumentURL)}
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
                      variants={getFileVariantFromURL(submissionDocumentURL)}
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
          <aside className="w-full flex flex-col flex-1">
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
                    {deadlineStatus}
                  </p>
                </div>
              </div>
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
