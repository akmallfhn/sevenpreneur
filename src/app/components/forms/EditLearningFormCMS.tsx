"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import SelectCMS from "../fields/SelectCMS";
import { LearningSessionVariant } from "../labels/LearningSessionIconLabelCMS";

interface EditLearningFormCMSProps {
  sessionToken: string;
  learningId: number;
  initialData: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditLearningFormCMS({
  sessionToken,
  learningId,
  initialData,
  isOpen,
  onClose,
}: EditLearningFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editLearning = trpc.update.learning.useMutation();
  const utils = trpc.useUtils();

  const {
    data: educatorUserList,
    isLoading,
    isError,
  } = trpc.list.users.useQuery({ role_id: 1 }, { enabled: !!sessionToken });

  // --- Beginning State
  const [formData, setFormData] = useState<{
    learningName: string;
    learningDescription: string;
    learningDate: string;
    learningMethod: string;
    learningURL: string;
    learningLocation: string;
    learningLocationURL: string;
    learningSpeaker: string;
  }>({
    learningName: initialData.name || "",
    learningDescription: initialData.description || "",
    learningDate: initialData.meeting_date
      ? dayjs(initialData.meeting_date).format("YYYY-MM-DDTHH:mm")
      : "",
    learningMethod: initialData.method
      ? (initialData.method as LearningSessionVariant)
      : "",
    learningURL: initialData.meeting_url ? initialData.meeting_url : "",
    learningLocation: initialData.location_name
      ? initialData.location_name
      : "",
    learningLocationURL: initialData.location_url
      ? initialData.location_url
      : "",
    learningSpeaker: initialData.speaker_id ? initialData.speaker_id : "",
  });

  // --- Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // --- Handle data changes
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // --- Reset fields based on learning method change
  useEffect(() => {
    if (formData.learningMethod === "ONSITE") {
      setFormData((prev) => ({
        ...prev,
        learningURL: "",
      }));
    }
    if (formData.learningMethod === "ONLINE") {
      setFormData((prev) => ({
        ...prev,
        learningLocation: "",
        learningLocationURL: "",
      }));
    }
    if (formData.learningMethod === "") {
      setFormData((prev) => ({
        ...prev,
        learningURL: "",
        learningLocation: "",
        learningLocationURL: "",
      }));
    }
  }, [formData.learningMethod]);

  // --- Data State Rendering
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

  // --- Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // -- Required field checking
    if (!formData.learningName) {
      toast.error("Don’t leave the session untitled");
      setIsSubmitting(false);
      return;
    }
    if (!formData.learningDescription) {
      toast.error(
        "A brief description helps set expectations — don't skip it."
      );
      setIsSubmitting(false);
      return;
    }
    if (!formData.learningDate) {
      toast.error("Pick a meeting date to schedule this session properly.");
      setIsSubmitting(false);
      return;
    }
    if (formData.learningMethod === "") {
      toast.error("Select how this session will be delivered");
      setIsSubmitting(false);
      return;
    }
    if (formData.learningMethod === "HYBRID") {
      if (!formData.learningLocation) {
        toast.error("Oops! A proper venue name helps everyone find it.");
        setIsSubmitting(false);
        return;
      }
      if (!formData.learningLocationURL) {
        toast.error(
          "Missing location link. A GMaps URL makes navigation easier."
        );
        setIsSubmitting(false);
        return;
      }
      if (!formData.learningURL) {
        toast.error(
          "A session link is required for online or hybrid meetings."
        );
        setIsSubmitting(false);
        return;
      }
    } else if (formData.learningMethod === "ONSITE") {
      if (!formData.learningLocation) {
        toast.error("Oops! A proper venue name helps everyone find it.");
        setIsSubmitting(false);
        return;
      }
      if (!formData.learningLocationURL) {
        toast.error(
          "Missing location link. A GMaps URL makes navigation easier."
        );
        setIsSubmitting(false);
        return;
      }
    } else if (formData.learningMethod === "ONLINE") {
      if (!formData.learningURL) {
        toast.error(
          "A session link is required for online or hybrid meetings."
        );
        setIsSubmitting(false);
        return;
      }
    }

    // -- POST to Database
    try {
      editLearning.mutate(
        {
          // Mandatory fields:
          id: learningId,
          name: formData.learningName.trim(),
          status: "ACTIVE",
          description: formData.learningDescription.trim(),
          meeting_date: new Date(formData.learningDate).toISOString(),
          method: formData.learningMethod as LearningSessionVariant,

          // Optional fields:
          meeting_url: formData.learningURL.trim()
            ? formData.learningURL
            : null,
          location_name: formData.learningLocation.trim()
            ? formData.learningLocation
            : null,
          location_url: formData.learningLocationURL.trim()
            ? formData.learningLocationURL
            : null,
          speaker_id: formData.learningSpeaker.trim()
            ? formData.learningSpeaker
            : null,
        },
        {
          onSuccess: () => {
            toast.success("Learning session updated successfully");
            setIsSubmitting(false);
            utils.read.learning.invalidate();
            utils.list.learnings.invalidate();
            onClose();
          },
          onError: (err) => {
            toast.error("Update failed", {
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
      sheetName="Edit Learning Session"
      sheetDescription="Update and refine your learning session. Adjust the schedule, location, or topic to reflect the latest changes."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-68 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <InputCMS
              inputId="learning-name"
              inputName="Session Topic"
              inputType="text"
              inputPlaceholder="What’s the topic of this meeting?"
              value={formData.learningName}
              onInputChange={handleInputChange("learningName")}
              required
            />
            <TextAreaCMS
              textAreaId="learning-description"
              textAreaName="Session Description"
              textAreaPlaceholder="Give a short overview of what will be covered."
              textAreaHeight="h-32"
              value={formData.learningDescription}
              onInputChange={handleInputChange("learningDescription")}
              required
            />
            <InputCMS
              inputId="learning-date"
              inputName="Session Schedule"
              inputType="datetime-local"
              value={formData.learningDate}
              onInputChange={handleInputChange("learningDate")}
              required
            />
            <SelectCMS
              selectId="learning-method"
              selectName="Session Method"
              selectPlaceholder="Choose how this session will be delivered"
              value={formData.learningMethod}
              onChange={handleInputChange("learningMethod")}
              required
              options={[
                {
                  label: "Online",
                  value: "ONLINE",
                },
                {
                  label: "On Site",
                  value: "ONSITE",
                },
                {
                  label: "Hybrid",
                  value: "HYBRID",
                },
              ]}
            />
            {["ONLINE", "HYBRID"].includes(formData.learningMethod) && (
              <InputCMS
                inputId="learning-url"
                inputName="Meeting Link"
                inputType="url"
                inputPlaceholder="e.g. https://meet.google.com/vjd-wovj-xfe"
                value={formData.learningURL}
                onInputChange={handleInputChange("learningURL")}
                characterLength={300}
                required
              />
            )}
            {["ONSITE", "HYBRID"].includes(formData.learningMethod) && (
              <>
                <InputCMS
                  inputId="learning-location"
                  inputName="Venue Name"
                  inputType="text"
                  inputPlaceholder="e.g. The Ritz-Carlton Jakarta"
                  value={formData.learningLocation}
                  onInputChange={handleInputChange("learningLocation")}
                  required
                />
                <InputCMS
                  inputId="learning-location-url"
                  inputName="Google Maps Link"
                  inputType="url"
                  inputPlaceholder="e.g. https://maps.app.goo.gl/3UxudP"
                  value={formData.learningLocationURL}
                  onInputChange={handleInputChange("learningLocationURL")}
                  required
                />
              </>
            )}
            <SelectCMS
              selectId="learning-speaker"
              selectName="Assigned Educator"
              selectPlaceholder="Select person to leading this session"
              value={formData.learningSpeaker}
              onChange={handleInputChange("learningSpeaker")}
              options={
                educatorUserList?.list.map((post) => ({
                  label: post.full_name,
                  value: post.id,
                })) || []
              }
            />
          </div>
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Save Changes
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
