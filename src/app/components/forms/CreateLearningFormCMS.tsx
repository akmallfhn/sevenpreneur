"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SelectCMS from "../fields/SelectCMS";
import { SessionMethod, StatusType } from "@/lib/app-types";
import { Switch } from "@/components/ui/switch";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";

interface CreateLearningFormCMSProps {
  sessionToken: string;
  cohortId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateLearningFormCMS(
  props: CreateLearningFormCMSProps
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createLearning = trpc.create.learning.useMutation();
  const utils = trpc.useUtils();

  const {
    data: educatorUserList,
    isLoading,
    isError,
  } = trpc.list.users.useQuery(
    { role_id: 1 },
    { enabled: !!props.sessionToken }
  );

  // Beginning State
  const [formData, setFormData] = useState<{
    learningName: string;
    learningDescription: string;
    learningDate: string;
    learningMethod: string;
    learningURL: string;
    learningLocation: string;
    learningLocationURL: string;
    learningSpeaker: string;
    learningStatus: StatusType;
    learningCheckIn: boolean;
    learningCheckOut: boolean;
    learningCheckOutCode: string;
    learningFeedbackURL: string;
  }>({
    learningName: "",
    learningDescription: "",
    learningDate: "",
    learningMethod: "",
    learningURL: "",
    learningLocation: "",
    learningLocationURL: "",
    learningSpeaker: "",
    learningStatus: "ACTIVE",
    learningCheckIn: false,
    learningCheckOut: false,
    learningCheckOutCode: "",
    learningFeedbackURL: "",
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

  // Reset fields based on learning method change
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

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required field checking
    if (!formData.learningName) {
      toast.error("Don’t leave the session untitled");
      setIsSubmitting(false);
      return;
    }
    if (!formData.learningDescription) {
      toast.error("A brief description helps set expectations, don't skip it.");
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

    // POST to Database
    try {
      createLearning.mutate(
        {
          // Mandatory fields:
          cohort_id: props.cohortId,
          name: formData.learningName.trim(),
          status: formData.learningStatus,
          description: formData.learningDescription.trim(),
          meeting_date: new Date(formData.learningDate).toISOString(),
          method: formData.learningMethod as SessionMethod,

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
          check_in: formData.learningCheckIn,
          check_out: formData.learningCheckOut,
          check_out_code: formData.learningCheckOutCode.trim()
            ? formData.learningCheckOutCode.trim()
            : null,
          feedback_form: formData.learningFeedbackURL.trim()
            ? formData.learningFeedbackURL.trim()
            : null,
        },
        {
          onSuccess: () => {
            toast.success(
              "Session successfully created and added to the schedule."
            );
            setIsSubmitting(false);
            utils.list.learnings.invalidate();
            props.onClose();
          },
          onError: (err) => {
            toast.error("Something went wrong while creating the session ", {
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
      sheetName="Create Learning Session"
      sheetDescription="Plan your next cohort session with a clear schedule, place, and topic."
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      {isLoading && (
        <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}

      {educatorUserList && !isLoading && !isError && (
        <form
          className="relative w-full h-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
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
                characterLength={4000}
                value={formData.learningDescription}
                onTextAreaChange={handleInputChange("learningDescription")}
                required
              />
              <div className="learning-status flex flex-col gap-1">
                <label
                  htmlFor={"learning-status"}
                  className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                >
                  Status <span className="text-red-700">*</span>
                </label>
                <div className="switch-button flex pl-1 gap-2">
                  <Switch
                    className="data-[state=checked]:bg-cms-primary"
                    checked={formData.learningStatus === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      handleInputChange("learningStatus")(
                        checked ? "ACTIVE" : "INACTIVE"
                      )
                    }
                  />
                  {formData.learningStatus && (
                    <StatusLabelCMS variants={formData.learningStatus} />
                  )}
                </div>
              </div>
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
                  educatorUserList.list.map((post) => ({
                    label: post.full_name,
                    image:
                      post.avatar ||
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png",
                    value: post.id,
                  })) || []
                }
              />
              <div className="attendance-settings flex flex-col gap-4 p-4 bg-section-background/50 border border-outline rounded-md">
                <h5 className="font-bodycopy font-bold text-sm">
                  Attendance Settings
                </h5>
                <div className="check-in flex flex-col gap-1">
                  <label
                    htmlFor={"learning-check-in"}
                    className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                  >
                    Check-In Enabled
                  </label>
                  <div className="switch-button flex items-center pl-1 gap-2">
                    <Switch
                      className="data-[state=checked]:bg-cms-primary"
                      checked={formData.learningCheckIn}
                      onCheckedChange={(checked) =>
                        handleInputChange("learningCheckIn")(
                          checked ? true : false
                        )
                      }
                    />
                    <div className="font-bodycopy text-[15px] font-medium text-[#333333]">
                      {formData.learningCheckIn ? (
                        <BooleanLabelCMS label="OPEN" value={true} />
                      ) : (
                        <BooleanLabelCMS label="CLOSE" value={false} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="check-out flex flex-col gap-1">
                  <label
                    htmlFor={"learning-check-out"}
                    className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                  >
                    Check-Out Enabled
                  </label>
                  <div className="switch-button flex items-center pl-1 gap-2">
                    <Switch
                      className="data-[state=checked]:bg-cms-primary"
                      checked={formData.learningCheckOut}
                      onCheckedChange={(checked) =>
                        handleInputChange("learningCheckOut")(
                          checked ? true : false
                        )
                      }
                    />
                    <div className="font-bodycopy text-[15px] font-medium text-[#333333]">
                      {formData.learningCheckOut ? (
                        <BooleanLabelCMS label="OPEN" value={true} />
                      ) : (
                        <BooleanLabelCMS label="CLOSE" value={false} />
                      )}
                    </div>
                  </div>
                </div>
                <InputCMS
                  inputId="learning-check-out-code"
                  inputName="Check Out Code"
                  inputType="text"
                  inputPlaceholder="e.g. WEAREFOUNDER"
                  value={formData.learningCheckOutCode}
                  onInputChange={handleInputChange("learningCheckOutCode")}
                />
                <InputCMS
                  inputId="learning-feedback-url"
                  inputName="Feedback Form"
                  inputType="url"
                  inputPlaceholder="e.g. https://forms.gle/XtGCMjh3GbwQ65Ss6"
                  value={formData.learningFeedbackURL}
                  onInputChange={handleInputChange("learningFeedbackURL")}
                />
              </div>
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
              Create Session
            </AppButton>
          </div>
        </form>
      )}
    </AppSheet>
  );
}
