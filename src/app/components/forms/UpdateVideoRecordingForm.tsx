"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UpdateVideoRecordingFormCMSProps {
  sessionToken: string;
  learningId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateVideoRecordingFormCMS({
  sessionToken,
  learningId,
  isOpen,
  onClose,
}: UpdateVideoRecordingFormCMSProps) {
  const utils = trpc.useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editLearning = trpc.update.learning.useMutation();

  const {
    data: learningDetailsData,
    isLoading,
    isError,
  } = trpc.read.learning.useQuery(
    { id: learningId },
    { enabled: !!sessionToken }
  );
  const initialData = learningDetailsData?.learning;

  // Beginning State
  const [formData, setFormData] = useState<{
    learningRecordingYoutube: string;
    learningRecordingCloudflare: string;
  }>({
    learningRecordingYoutube: initialData?.recording_url || "",
    learningRecordingCloudflare: initialData?.external_video_id || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        learningRecordingYoutube: initialData.recording_url || "",
        learningRecordingCloudflare: initialData.external_video_id || "",
      });
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

    if (
      formData.learningRecordingYoutube.trim() &&
      !formData.learningRecordingYoutube.startsWith("https://youtu.be/")
    ) {
      toast.error(
        "Unsupported link format. The recording must be hosted on YouTube"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      editLearning.mutate(
        {
          id: learningId,
          recording_url: formData.learningRecordingYoutube.trim() || null,
          external_video_id:
            formData.learningRecordingCloudflare.trim() || null,
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
      {isLoading && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}

      {!isLoading && !isError && initialData && (
        <form
          className="relative w-full h-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
            <div className="group-input flex flex-col gap-4">
              <InputCMS
                inputId="learning-recording-youtube"
                inputName="Add Recording from Youtube"
                inputType="url"
                inputPlaceholder="e.g. https://youtu.be/_ordOyNg548?si=BhK3OdSuAewbD0fl"
                value={formData.learningRecordingYoutube}
                onInputChange={handleInputChange("learningRecordingYoutube")}
              />
              <InputCMS
                inputId="learning-recording-cloudflare"
                inputName="Add Recording from Cloudflare"
                inputType="text"
                inputPlaceholder="e.g. d929af5a12b4d3fbe74215e9678b1b58"
                value={formData.learningRecordingCloudflare}
                onInputChange={handleInputChange("learningRecordingCloudflare")}
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
      )}
    </AppSheet>
  );
}
