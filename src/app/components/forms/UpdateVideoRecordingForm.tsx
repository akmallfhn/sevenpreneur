"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UpdateVideoRecordingFormCMSProps {
  learningId: number;
  initialData: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateVideoRecordingFormCMS({
  learningId,
  initialData,
  isOpen,
  onClose,
}: UpdateVideoRecordingFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editLearning = trpc.update.learning.useMutation();
  const utils = trpc.useUtils();

  // Beginning State
  const [formData, setFormData] = useState<{
    learningRecordingURL: string;
  }>({
    learningRecordingURL: initialData.recording_url || "",
  });

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
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation URL
    if (!formData.learningRecordingURL.startsWith("https://youtu.be/")) {
      toast.error(
        "Unsupported link format. The recording must be hosted on YouTube"
      );
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      editLearning.mutate(
        {
          // Mandatory fields:
          id: learningId,

          // Optional fields:
          recording_url: formData.learningRecordingURL.trim()
            ? formData.learningRecordingURL
            : null,
        },
        {
          onSuccess: () => {
            toast.success("Video Recording updated successfully");
            setIsSubmitting(false);
            utils.read.learning.invalidate();
            onClose();
          },
          onError: (err) => {
            toast.error(
              "Something went wrong. Please double-check the link and try again.",
              {
                description: err.message,
              }
            );
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
      sheetName="Update Video Recording"
      sheetDescription="Add or update the session’s video recording to ensure learners can revisit the content anytime."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <InputCMS
              inputId="learning-recording-url"
              inputName="Link to Video Recording"
              inputType="url"
              inputPlaceholder="e.g. https://youtu.be/_ordOyNg548?si=BhK3OdSuAewbD0fl"
              value={formData.learningRecordingURL}
              onInputChange={handleInputChange("learningRecordingURL")}
              required
            />
          </div>
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-40">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Update Video Recording
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
