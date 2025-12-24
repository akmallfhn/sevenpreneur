"use client";
import { trpc } from "@/trpc/client";
import { Loader2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import UploadFilesCMS from "../fields/UploadFilesCMS";
import AttendanceItemAccordionLMS from "../items/AttendanceItemAccordionLMS";
import FileItemLMS from "../items/FileItemLMS";
import UserItemCMS from "../items/UserItemCMS";
import AppSheet from "../modals/AppSheet";
import SubmissionItemAccordionLMS from "../items/SubmissionItemAccordionLMS";

interface EditCohortMemberFormCMSProps {
  sessionToken: string;
  sessionUserId: string;
  sessionUserRole: number;
  userId: string;
  cohortId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCohortMemberFormCMS(
  props: EditCohortMemberFormCMSProps
) {
  const utils = trpc.useUtils();
  const updateCohortMember = trpc.update.cohortMember.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificateURL, setCertificateURL] = useState("");

  const allowedRolesUpdateCertificate = [0, 2];
  const isAllowedUpdateCertificate = allowedRolesUpdateCertificate.includes(
    props.sessionUserRole
  );

  // Return initial data
  const { data, isLoading, isError } = trpc.read.cohortMember.useQuery(
    { user_id: props.userId, cohort_id: props.cohortId },
    { enabled: !!props.sessionToken }
  );
  const memberDetails = data?.cohortMember;

  useEffect(() => {
    if (memberDetails?.certificate_url) {
      setCertificateURL(memberDetails.certificate_url);
    }
  }, [memberDetails?.certificate_url]);

  const handleCertificateChange = (value: string | null) => {
    setCertificateURL(value ?? "");
  };

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

  if (!props.userId) return;

  const handleUpdateCertificate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateCohortMember.mutate(
        {
          // Mandatory fields
          user_id: props.userId,
          cohort_id: props.cohortId,

          // Optional fields
          certificate_url: certificateURL ? certificateURL : null,
        },
        {
          onSuccess: () => {
            toast.success("Certificate updated successfully");
            utils.list.cohortMembers.invalidate();
            utils.read.cohortMember.invalidate();
            props.onClose();
          },
          onError: (err) => {
            toast.error("Failed to update certificate", {
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
      sheetName="Performance Details"
      sheetDescription={`ID User: ${props.userId}`}
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
      {!isLoading && !isError && memberDetails && (
        <div className="container flex flex-col h-full px-6 pb-20 gap-5 overflow-y-auto">
          <div className="user-details flex flex-col gap-2 p-3 border border-outline rounded-md">
            <h5 className="font-bodycopy font-bold text-[15px]">
              User Details
            </h5>
            <UserItemCMS
              userId={memberDetails.id}
              userName={memberDetails.full_name}
              userAvatar={
                memberDetails.avatar ||
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
              }
              userEmail={memberDetails.email}
              userPhoneNumber={memberDetails.phone_number || ""}
            />
          </div>
          <div className="attendances flex flex-col gap-2.5">
            <h3 className="font-bold font-bodycopy">Attendances</h3>
            {memberDetails.attendances.map((post) => (
              <AttendanceItemAccordionLMS
                key={post.learning_name}
                learningSessionName={post.learning_name}
                attendanceStatus={post.status}
                attendanceCheckInAt={post.check_in_at || ""}
                attendanceCheckOutAt={post.check_out_at || ""}
              />
            ))}
          </div>
          <div className="projects flex flex-col gap-2.5">
            <h3 className="font-bold font-bodycopy">Task & Assignment</h3>
            {memberDetails.projects.map((post) => (
              <SubmissionItemAccordionLMS
                key={post.name}
                projectName={post.name}
                submissionStatus={post.has_submitted}
                submittedAt={post.submitted_at ?? ""}
              />
            ))}
          </div>
          {certificateURL ? (
            <div className="certificate flex flex-col gap-2 p-3 border border-outline rounded-md">
              <h3 className="font-bold font-bodycopy">Certificate</h3>
              <div className="certificate-file relative w-full text-[15px]">
                <FileItemLMS
                  fileName="Completion Certificate"
                  fileURL={certificateURL}
                />
                <div className="absolute -top-2 -right-2">
                  <AppButton
                    variant="semiDestructive"
                    size="smallIconRounded"
                    onClick={() => setCertificateURL("")}
                  >
                    <X className="size-4" />
                  </AppButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="upload-certificate flex flex-col gap-2 pt-4">
              <h3 className="font-bold font-bodycopy">Upload Certificate</h3>
              <UploadFilesCMS
                value={certificateURL}
                onUpload={handleCertificateChange}
              />
            </div>
          )}
        </div>
      )}
      {isAllowedUpdateCertificate && (
        <div className="update-certificate sticky bottom-0 w-full p-4 bg-white border-t border-outline z-40">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            onClick={handleUpdateCertificate}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Save Changes
          </AppButton>
        </div>
      )}
    </AppSheet>
  );
}
