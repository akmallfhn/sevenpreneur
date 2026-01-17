"use client";
import { Switch } from "@/components/ui/switch";
import { StatusType } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppSheet from "../modals/AppSheet";
import UploadImageMobileInterstitialCMS from "../fields/UploadImageMobileInterstitialCMS";
import UploadImageDesktopInterstitialCMS from "../fields/UploadImageDesktopInterstitialCMS";

interface EditInterstitialAdsFormCMS {
  sessionToken: string;
  interstitialId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditInterstitialAdsFormCMS(
  props: EditInterstitialAdsFormCMS
) {
  const editInterstitial = trpc.update.ad.interstitial.useMutation();
  const utils = trpc.useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = trpc.read.ad.interstitial.useQuery(
    { id: props.interstitialId },
    { enabled: !!props.sessionToken }
  );
  const initialData = data?.interstitial;

  // Beginning State
  const [formData, setFormData] = useState<{
    interstitialTitle: string;
    interstitialImageMobile: string;
    interstitialImageDesktop: string;
    interstitialCallToAction: string;
    interstitialTargetUrl: string;
    interstitialStartDate: string;
    interstitialEndDate: string;
    interstitialStatus: StatusType | null;
  }>({
    interstitialTitle: initialData?.title.trim() ? initialData.title : "",
    interstitialImageMobile: initialData?.image_mobile
      ? initialData.image_mobile
      : "",
    interstitialImageDesktop: initialData?.image_desktop
      ? initialData.image_desktop
      : "",
    interstitialCallToAction: initialData?.call_to_action?.trim()
      ? initialData.call_to_action.trim()
      : "",
    interstitialTargetUrl: initialData?.target_url.trim()
      ? initialData.target_url
      : "",
    interstitialStartDate: initialData?.start_date
      ? dayjs(initialData.start_date).format("YYYY-MM-DDTHH:mm")
      : "",
    interstitialEndDate: initialData?.end_date
      ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
      : "",
    interstitialStatus: initialData?.status ?? null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        interstitialTitle: initialData.title.trim() ? initialData.title : "",
        interstitialImageMobile: initialData.image_mobile
          ? initialData.image_mobile
          : "",
        interstitialImageDesktop: initialData.image_desktop
          ? initialData.image_desktop
          : "",
        interstitialCallToAction: initialData.call_to_action?.trim()
          ? initialData.call_to_action.trim()
          : "",
        interstitialTargetUrl: initialData.target_url.trim()
          ? initialData.target_url
          : "",
        interstitialStartDate: initialData.start_date
          ? dayjs(initialData.start_date).format("YYYY-MM-DDTHH:mm")
          : "",
        interstitialEndDate: initialData.end_date
          ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
          : "",
        interstitialStatus: initialData.status ?? null,
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
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const handleImageForm =
    (field: "interstitialImageMobile" | "interstitialImageDesktop") =>
    (url: string | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: url ?? "",
      }));
    };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required field checking
    if (!formData.interstitialTitle) {
      toast.error("Oops, title can’t be empty");
      setIsSubmitting(false);
      return;
    }
    if (!formData.interstitialImageMobile) {
      toast.error("No mobile image found. Upload an image to continue.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.interstitialImageDesktop) {
      toast.error("No desktop image found. Upload an image to continue.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.interstitialCallToAction) {
      toast.error("Add call-to-action label to complete this setup.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.interstitialTargetUrl) {
      toast.error("Where should we send them? Drop the link");
      setIsSubmitting(false);
      return;
    }
    if (!formData.interstitialStartDate) {
      toast.error("Pick a start date to kick things off");
      setIsSubmitting(false);
      return;
    }
    if (!formData.interstitialEndDate) {
      toast.error("Define the expiry date.");
      setIsSubmitting(false);
      return;
    }
    if (
      dayjs(formData.interstitialEndDate).isBefore(
        dayjs(formData.interstitialStartDate)
      )
    ) {
      toast.error("Oops! End date must come after the start date");
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      editInterstitial.mutate(
        {
          // Mandatory fields:
          id: props.interstitialId,
          title: formData.interstitialTitle.trim(),
          image_mobile: formData.interstitialImageMobile,
          image_desktop: formData.interstitialImageDesktop,
          call_to_action: formData.interstitialCallToAction.trim(),
          target_url: formData.interstitialTargetUrl.trim(),
          status: formData.interstitialStatus as StatusType,
          start_date: new Date(formData.interstitialStartDate).toISOString(),
          end_date: new Date(formData.interstitialEndDate).toISOString(),
        },
        {
          onSuccess: () => {
            toast.success("Interstitial ads successfully updated");
            setIsSubmitting(false);
            utils.read.ad.interstitial.invalidate();
            props.onClose();
          },
          onError: (error) => {
            toast.error(
              "Something went wrong while updating interstitial ads",
              {
                description: error.message,
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
      sheetName="Edit Interstitial Ads"
      sheetDescription="Modify interstitial ad assets, CTA, and display settings."
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      {isLoading && (
        <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}

      {initialData && !isLoading && !isError && (
        <form
          className="relative w-full h-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
            {initialData && (
              <div className="group-input flex flex-col gap-4">
                <InputCMS
                  inputId="interstitial-title"
                  inputName="Title"
                  inputType="text"
                  inputPlaceholder="e.g. Flash Sale SBBP Batch 8"
                  value={formData.interstitialTitle}
                  onInputChange={handleInputChange("interstitialTitle")}
                  required
                />
                <div className="flex flex-col w-full gap-1">
                  <label
                    htmlFor="interstitial-image"
                    className="label-input flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                  >
                    Key Visuals
                    <span className="label-required text-destructive">*</span>
                  </label>
                  <div className="interstitial-images flex flex-col w-full gap-4">
                    <UploadImageDesktopInterstitialCMS
                      value={formData.interstitialImageDesktop}
                      onUpload={handleImageForm("interstitialImageDesktop")}
                    />
                    <UploadImageMobileInterstitialCMS
                      value={formData.interstitialImageMobile}
                      onUpload={handleImageForm("interstitialImageMobile")}
                    />
                  </div>
                </div>
                <InputCMS
                  inputId="interstitial-call-to-action"
                  inputName="Call To Action Label"
                  inputType="text"
                  inputPlaceholder="e.g. Buy Now!"
                  value={formData.interstitialCallToAction}
                  onInputChange={handleInputChange("interstitialCallToAction")}
                  required
                />
                <InputCMS
                  inputId="interstitial-target-url"
                  inputName="Target URL"
                  inputType="url"
                  inputPlaceholder="https://sevenpreneur.com/cohorts"
                  value={formData.interstitialTargetUrl}
                  onInputChange={handleInputChange("interstitialTargetUrl")}
                  required
                />
                <InputCMS
                  inputId="interstitial-start-date"
                  inputName="Available from"
                  inputType="datetime-local"
                  value={formData.interstitialStartDate}
                  onInputChange={handleInputChange("interstitialStartDate")}
                  required
                />
                <InputCMS
                  inputId="interstitial-end-date"
                  inputName="Valid until"
                  inputType="datetime-local"
                  value={formData.interstitialEndDate}
                  onInputChange={handleInputChange("interstitialEndDate")}
                  required
                />
                <div className="interstitial-status flex flex-col gap-1">
                  <label
                    htmlFor="interstitial-status"
                    className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                  >
                    Status <span className="text-red-700">*</span>
                  </label>
                  <div className="switch-button flex pl-1 gap-2">
                    <Switch
                      className="data-[state=checked]:bg-cms-primary"
                      checked={formData.interstitialStatus === "ACTIVE"}
                      onCheckedChange={(checked) =>
                        handleInputChange("interstitialStatus")(
                          checked ? "ACTIVE" : "INACTIVE"
                        )
                      }
                    />
                    {formData.interstitialStatus && (
                      <StatusLabelCMS variants={formData.interstitialStatus} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="sticky bottom-0 w-full p-4 bg-white z-40">
            <AppButton
              className="w-full"
              variant="cmsPrimary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin size-4" />}
              Update Interstitial Ads
            </AppButton>
          </div>
        </form>
      )}
    </AppSheet>
  );
}
