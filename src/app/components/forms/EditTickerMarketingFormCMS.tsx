"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import { Switch } from "@/components/ui/switch";
import { StatusType } from "@/lib/app-types";
import TextAreaCMS from "../fields/TextAreaCMS";

interface EditTickerMarketingFormCMSProps {
  initialData: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTickerMarketingFormCMS({
  initialData,
  isOpen,
  onClose,
}: EditTickerMarketingFormCMSProps) {
  const editTicker = trpc.update.ticker.useMutation();
  const utils = trpc.useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Beginning State
  const [formData, setFormData] = useState<{
    tickerTitle: string;
    tickerCallout: string;
    tickerTargetUrl: string;
    tickerStartDate: string;
    tickerEndDate: string;
    tickerStatus: StatusType | null;
  }>({
    tickerTitle: initialData?.title.trim() ? initialData.title : "",
    tickerCallout: initialData?.callout.trim() ? initialData.callout : "",
    tickerTargetUrl: initialData.target_url.trim()
      ? initialData.target_url
      : "",
    tickerStartDate: initialData?.start_date
      ? dayjs(initialData.start_date).format("YYYY-MM-DDTHH:mm")
      : "",
    tickerEndDate: initialData?.end_date
      ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
      : "",
    tickerStatus: initialData?.status ?? null,
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

    // Required field checking
    if (!formData.tickerTitle) {
      toast.error("Oops, headline can’t be empty");
      setIsSubmitting(false);
      return;
    }
    if (!formData.tickerTargetUrl) {
      toast.error("Where should we send them? Drop the link");
      setIsSubmitting(false);
      return;
    }
    if (!formData.tickerStartDate) {
      toast.error("Pick a start date to kick things off");
      setIsSubmitting(false);
      return;
    }
    if (!formData.tickerEndDate) {
      toast.error("Define the expiry date.");
      setIsSubmitting(false);
      return;
    }
    if (
      dayjs(formData.tickerEndDate).isBefore(dayjs(formData.tickerStartDate))
    ) {
      toast.error("Oops! End date must come after the start date");
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      editTicker.mutate(
        {
          // Mandatory fields:
          id: 1,
          title: formData.tickerTitle.trim(),
          callout: formData.tickerCallout.trim()
            ? formData.tickerCallout.trim()
            : "",
          status: formData.tickerStatus as StatusType,
          start_date: new Date(formData.tickerStartDate).toISOString(),
          end_date: new Date(formData.tickerEndDate).toISOString(),
        },
        {
          onSuccess: () => {
            toast.success("Ticker Announcement successfully updated");
            setIsSubmitting(false);
            utils.read.ticker.invalidate();
            onClose();
          },
          onError: (error) => {
            toast.error("Something went wrong while updating the ticker", {
              description: error.message,
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
      sheetName="Edit Ticker Announcement"
      sheetDescription="Edit ticker to update quick announcements or live info."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-68 gap-5 overflow-y-auto">
          {initialData && (
            <div className="group-input flex flex-col gap-4">
              <TextAreaCMS
                textAreaId="ticker-title"
                textAreaName="Headline"
                textAreaHeight="h-20"
                textAreaPlaceholder="e.g. Limited Time Offer"
                value={formData.tickerTitle}
                onInputChange={handleInputChange("tickerTitle")}
                required
              />
              <InputCMS
                inputId="ticker-callout"
                inputName="Callout (CTA)"
                inputType="text"
                inputPlaceholder="e.g. Shop Now"
                value={formData.tickerCallout}
                onInputChange={handleInputChange("tickerCallout")}
              />
              <InputCMS
                inputId="ticker-target-url"
                inputName="Target URL"
                inputType="url"
                inputPlaceholder="https://sevenpreneur.com/cohorts"
                value={formData.tickerTargetUrl}
                onInputChange={handleInputChange("tickerTargerUrl")}
                required
              />
              <InputCMS
                inputId="ticker-start-date"
                inputName="Available from"
                inputType="datetime-local"
                value={formData.tickerStartDate}
                onInputChange={handleInputChange("tickerStartDate")}
                required
              />
              <InputCMS
                inputId="ticker-end-date"
                inputName="Valid until"
                inputType="datetime-local"
                value={formData.tickerEndDate}
                onInputChange={handleInputChange("tickerEndDate")}
                required
              />
              <div className="status flex flex-col gap-1">
                <label
                  htmlFor={"ticker-status"}
                  className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                >
                  Status <span className="text-red-700">*</span>
                </label>
                <div className="switch-button flex pl-1 gap-2">
                  <Switch
                    className="data-[state=checked]:bg-cms-primary"
                    checked={formData.tickerStatus === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      handleInputChange("tickerStatus")(
                        checked ? "ACTIVE" : "INACTIVE"
                      )
                    }
                  />
                  {formData.tickerStatus && (
                    <StatusLabelCMS variants={formData.tickerStatus} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Update Ticker
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
