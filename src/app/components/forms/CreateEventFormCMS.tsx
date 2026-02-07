"use client";
import { Switch } from "@/components/ui/switch";
import { SessionMethod, StatusType } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import UploadImageEventCMS from "../fields/UploadImageEventCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppSheet from "../modals/AppSheet";
import PriceTierStepperCMS, {
  PriceTier,
} from "../steppers/PriceTierStepperCMS";
import SelectCMS from "../fields/SelectCMS";

interface CreateEventFormCMSProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventFormCMS(props: CreateEventFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createEvent = trpc.create.event.useMutation();
  const utils = trpc.useUtils();

  // Beginning State
  const [formData, setFormData] = useState<{
    eventName: string;
    eventImage: string;
    eventDescription: string;
    eventMethod: SessionMethod | null;
    eventStartDate: string;
    eventEndDate: string;
    eventLocationName: string;
    eventLocationURL: string;
    eventMeetingURL: string;
    eventStatus: StatusType;
    eventPriceTiers: PriceTier[];
  }>({
    eventName: "",
    eventImage: "",
    eventDescription: "",
    eventMethod: null,
    eventStartDate: "",
    eventEndDate: "",
    eventLocationName: "",
    eventLocationURL: "",
    eventMeetingURL: "",
    eventStatus: "ACTIVE",
    eventPriceTiers: [
      {
        name: "",
        amount: "",
      },
    ],
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
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const handleImageForm = (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      eventImage: url ?? "",
    }));
  };

  // Reset fields based on learning method change
  useEffect(() => {
    if (formData.eventMethod === "ONSITE") {
      setFormData((prev) => ({
        ...prev,
        eventMeetingURL: "",
      }));
    }
    if (formData.eventMethod === "ONLINE") {
      setFormData((prev) => ({
        ...prev,
        eventLocationName: "",
        eventLocationURL: "",
      }));
    }
    if (!formData.eventMethod) {
      setFormData((prev) => ({
        ...prev,
        eventMeetingURL: "",
        eventLocationName: "",
        eventLocationURL: "",
      }));
    }
  }, [formData.eventMethod]);

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const invalidTier = formData.eventPriceTiers.some(
      (tier) => !tier.name.trim() || !tier.amount.trim(),
    );

    // Required field checking
    if (!formData.eventName) {
      toast.error("Don't leave your event nameless");
      setIsSubmitting(false);
      return;
    }
    if (!formData.eventDescription) {
      toast.error("Tell us what this event is all about");
      setIsSubmitting(false);
      return;
    }
    if (!formData.eventMethod) {
      toast.error("Please select session method");
      setIsSubmitting(false);
      return;
    }
    if (!formData.eventImage) {
      toast.error("Please upload a thumbnail to represent this event");
      setIsSubmitting(false);
      return;
    }
    if (!formData.eventStartDate) {
      toast.error("Please select a start date");
      setIsSubmitting(false);
      return;
    }
    if (!formData.eventEndDate) {
      toast.error("Set an end date to complete the timeline");
      setIsSubmitting(false);
      return;
    }
    if (dayjs(formData.eventStartDate).isAfter(dayjs(formData.eventEndDate))) {
      toast.error("Start date can't be after the end date");
      setIsSubmitting(false);
      return;
    }
    if (formData.eventMethod === "HYBRID") {
      if (!formData.eventLocationName) {
        toast.error("Oops! A proper venue name helps everyone find it.");
        setIsSubmitting(false);
        return;
      }
      if (!formData.eventLocationURL) {
        toast.error(
          "Missing location link. A GMaps URL makes navigation easier.",
        );
        setIsSubmitting(false);
        return;
      }
      if (!formData.eventMeetingURL) {
        toast.error(
          "A session link is required for online or hybrid meetings.",
        );
        setIsSubmitting(false);
        return;
      }
    } else if (formData.eventMethod === "ONSITE") {
      if (!formData.eventLocationName) {
        toast.error("Oops! A proper venue name helps everyone find it.");
        setIsSubmitting(false);
        return;
      }
      if (!formData.eventLocationURL) {
        toast.error(
          "Missing location link. A GMaps URL makes navigation easier.",
        );
        setIsSubmitting(false);
        return;
      }
    } else if (formData.eventMethod === "ONLINE") {
      if (!formData.eventMeetingURL) {
        toast.error(
          "A session link is required for online or hybrid meetings.",
        );
        setIsSubmitting(false);
        return;
      }
    }
    if (formData.eventPriceTiers.length === 0 || invalidTier) {
      toast.error("A event with no price? Sounds generous");
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      createEvent.mutate(
        {
          name: formData.eventName.trim(),
          description: formData.eventDescription.trim(),
          status: formData.eventStatus,
          image: formData.eventImage,
          method: formData.eventMethod,
          start_date: new Date(formData.eventStartDate).toISOString(),
          end_date: new Date(formData.eventEndDate).toISOString(),
          event_prices: formData.eventPriceTiers.map((tier: PriceTier) => ({
            name: tier.name.trim(),
            amount: Number(tier.amount),
            status: "ACTIVE",
          })),

          // Optional field
          location_name: formData.eventLocationName.trim()
            ? formData.eventLocationName.trim()
            : null,
          location_url: formData.eventLocationURL.trim()
            ? formData.eventLocationURL.trim()
            : null,
          meeting_url: formData.eventMeetingURL.trim()
            ? formData.eventMeetingURL.trim()
            : null,
        },
        {
          onSuccess: () => {
            toast.success("All set! Your event is now live");
            setIsSubmitting(false);
            utils.list.events.invalidate();
            props.onClose();
          },
          onError: (err) => {
            toast.error("Failed to create event", {
              description: err.message,
            });
          },
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppSheet
      sheetName="Create Event"
      sheetDescription=""
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col px-6 pb-96 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <UploadImageEventCMS
              value={formData.eventImage}
              onUpload={handleImageForm}
            />
            <InputCMS
              inputId="event-name"
              inputName="Event Name"
              inputType="text"
              inputPlaceholder="Name your event"
              value={formData.eventName}
              onInputChange={handleInputChange("eventName")}
              required
            />
            <TextAreaCMS
              textAreaId="event-description"
              textAreaName="Event Overview"
              textAreaPlaceholder="Tell us about this event"
              textAreaHeight="h-32"
              value={formData.eventDescription}
              onTextAreaChange={handleInputChange("eventDescription")}
              required
            />
            <div className="event-status flex flex-col gap-1">
              <label
                htmlFor={"event-status"}
                className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
              >
                Status <span className="text-red-700">*</span>
              </label>
              <div className="switch-button flex pl-1 gap-2">
                <Switch
                  className="data-[state=checked]:bg-cms-primary"
                  checked={formData.eventStatus === "ACTIVE"}
                  onCheckedChange={(checked) =>
                    handleInputChange("eventStatus")(
                      checked ? "ACTIVE" : "INACTIVE",
                    )
                  }
                />
                {formData.eventStatus && (
                  <StatusLabelCMS variants={formData.eventStatus} />
                )}
              </div>
            </div>
            <InputCMS
              inputId="event-start-date"
              inputName="Event Starts"
              inputType="datetime-local"
              value={formData.eventStartDate}
              onInputChange={handleInputChange("eventStartDate")}
              required
            />
            <InputCMS
              inputId="event-end-date"
              inputName="Event Ends"
              inputType="datetime-local"
              value={formData.eventEndDate}
              onInputChange={handleInputChange("eventEndDate")}
              required
            />
          </div>
          <SelectCMS
            selectId="event-method"
            selectName="Session Method"
            selectPlaceholder="Choose how this session will be delivered"
            value={formData.eventMethod}
            onChange={handleInputChange("eventMethod")}
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
          {formData.eventMethod &&
            ["ONLINE", "HYBRID"].includes(formData.eventMethod) && (
              <InputCMS
                inputId="event-meeting-url"
                inputName="Meeting Link"
                inputType="url"
                inputPlaceholder="e.g. https://meet.google.com/vjd-wovj-xfe"
                value={formData.eventMeetingURL}
                onInputChange={handleInputChange("eventMeetingURL")}
                characterLength={300}
                required
              />
            )}
          {formData.eventMethod &&
            ["ONSITE", "HYBRID"].includes(formData.eventMethod) && (
              <>
                <InputCMS
                  inputId="event-location-name"
                  inputName="Venue Name"
                  inputType="text"
                  inputPlaceholder="e.g. The Ritz-Carlton Jakarta"
                  value={formData.eventLocationName}
                  onInputChange={handleInputChange("eventLocationName")}
                  required
                />
                <InputCMS
                  inputId="event-location-url"
                  inputName="Google Maps Link"
                  inputType="url"
                  inputPlaceholder="e.g. https://maps.app.goo.gl/3UxudP"
                  value={formData.eventLocationURL}
                  onInputChange={handleInputChange("eventLocationURL")}
                  required
                />
              </>
            )}
          <PriceTierStepperCMS
            tiers={formData.eventPriceTiers}
            setTiers={(tiers) =>
              setFormData({ ...formData, eventPriceTiers: tiers })
            }
          />
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-40">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Create Event
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
