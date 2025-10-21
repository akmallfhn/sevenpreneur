"use client";
import { FormEvent, useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import UploadSubmissionLMS from "../fields/UploadSubmissionLMS";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EditSubmission } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { getFileVariantFromURL } from "@/lib/file-variants";

export interface InitialData {
  id?: number | undefined;
  document_url?: string | null;
}

interface EditSubmissionFormLMSProps {
  initialData: InitialData;
  onClose: () => void;
}

export default function EditSubmissionFormLMS({
  initialData,
  onClose,
}: EditSubmissionFormLMSProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState<"attach" | "url" | null>(null);

  // Beginning State
  const [formData, setFormData] = useState<{
    submissionURL: string;
  }>({
    submissionURL: initialData.document_url || "",
  });

  useEffect(() => {
    const url = initialData?.document_url ?? "";
    setFormData({ submissionURL: url });

    const fileVariant = getFileVariantFromURL(url);
    if (fileVariant === "PDF") {
      setSubmitMode("attach");
    } else if (url) {
      setSubmitMode("url");
    } else {
      setSubmitMode(null);
    }
  }, [initialData]);

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

  // Handle data changes
  const handleAttachFile = (value: string | null) => {
    const finalValue = value || "";
    setFormData((prev) => ({
      ...prev,
      submissionURL: value || "",
    }));
    if (finalValue.length > 0) {
      setSubmitMode("attach");
    } else {
      setSubmitMode(null);
    }
  };
  const handleInputChange = (value: string | null) => {
    const finalValue = value || "";
    setFormData((prev) => ({
      ...prev,
      submissionURL: value || "",
    }));
    if (finalValue.length > 0) {
      setSubmitMode("url");
    } else {
      setSubmitMode(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!initialData.id) {
      toast.error("Submission Not Found", {
        description:
          "We couldn’t identify this submission. Please try again later.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.submissionURL.trim()) {
      toast.error("Submission Link Required", {
        description: "Please provide a valid URL before submitting your task.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const editSubmission = await EditSubmission({
        submissionId: initialData.id,
        submissionDocumentUrl: formData.submissionURL,
      });

      if (editSubmission.code === "OK") {
        toast.success("Submission Updated", {
          description: "Your changes have been saved successfully.",
        });
        setFormData({ submissionURL: "" });
        onClose();
        router.refresh();
      } else {
        toast.error("Update Failed", {
          description:
            editSubmission?.message ||
            "We couldn’t update your submission. Please check your input and try again.",
        });
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Update Error", {
        description:
          "An unexpected error occurred while updating your submission. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="edit-submission-form flex flex-col w-full gap-6"
      onSubmit={handleSubmit}
    >
      {submitMode !== "url" && (
        <UploadSubmissionLMS
          value={formData.submissionURL}
          onUpload={handleAttachFile}
        />
      )}
      {submitMode === null && (
        <div className="divider flex items-center gap-6">
          <hr className="w-full border-b border-outline" />
          <p className="text-[#333333]/70 text-sm font-bodycopy font-medium">
            OR
          </p>
          <hr className="w-full border-b border-outline " />
        </div>
      )}
      {submitMode !== "attach" && (
        <InputCMS
          inputId="submission-url"
          inputName="Provide Document Link"
          inputType="url"
          inputPlaceholder="Paste the document’s shareable link here"
          value={formData.submissionURL}
          onInputChange={handleInputChange}
          characterLength={1000}
          required
        />
      )}
      <div className="submit flex w-full justify-end items-center gap-3">
        <AppButton size="medium" variant="outline" onClick={onClose}>
          Cancel
        </AppButton>
        <AppButton size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin size-4" />}
          Submit
        </AppButton>
      </div>
    </form>
  );
}
