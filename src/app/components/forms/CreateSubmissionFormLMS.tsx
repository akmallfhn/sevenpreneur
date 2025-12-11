"use client";
import { CreateSubmission } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import UploadSubmissionLMS from "../fields/UploadSubmissionLMS";

interface CreateSubmissionFormLMSProps {
  projectId: number;
}

export default function CreateSubmissionFormLMS({
  projectId,
}: CreateSubmissionFormLMSProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMode, setSubmitMode] = useState<"attach" | "url" | null>(null);

  // Beginning State
  const [formData, setFormData] = useState<{
    submissionURL: string;
  }>({
    submissionURL: "",
  });

  // Reset submission URL every time upload method is changed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      submissionURL: "",
    }));
  }, []);

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

    if (!formData.submissionURL.trim()) {
      toast.error("Submission Link Required", {
        description: "Please provide a valid URL before submitting your task.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const createSubmission = await CreateSubmission({
        projectId,
        submissionDocumentUrl: formData.submissionURL,
      });

      if (createSubmission.code === "CREATED") {
        toast.success("Successfully Submitted", {
          description: "Got It! We’ve Received Your Submission.",
        });
        setFormData({ submissionURL: "" });
        setSubmitMode(null);
        router.refresh();
      } else {
        toast.error("Submission Failed", {
          description:
            createSubmission?.message ||
            "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Submission Failed", {
        description: "Unable to submit your task at the moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="create-submission-form flex flex-col w-full gap-6"
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
      <div className="submit flex w-full justify-end">
        <AppButton size="medium" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin size-4" />}
          Submit
        </AppButton>
      </div>
    </form>
  );
}
