"use client";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppInput from "../fields/AppInput";

interface CreateWhatsappAlertFormCMSProps {
  sessionToken: string;
  convId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWhatsappAlertFormCMS(
  props: CreateWhatsappAlertFormCMSProps
) {
  const utils = trpc.useUtils();
  const createWAAlert = trpc.create.wa.alert.useMutation();

  // Form data
  const [formData, setFormData] = useState<{
    scheduledAt: string;
  }>({
    scheduledAt: "",
  });

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Block scroll on background
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

  const handleSubmit = async () => {
    if (!formData.scheduledAt) {
      toast.error("Please pick a scheduled time first");
      return;
    }

    createWAAlert.mutate(
      {
        conv_id: props.convId,
        scheduled_at: dayjs(formData.scheduledAt).format(),
      },
      {
        onSuccess: () => {
          toast.success("Alert reminder scheduled");
          utils.read.wa.conversation.invalidate({ id: props.convId });
          props.onClose();
        },
        onError: () => {
          toast.error("Failed to set alert reminder");
        },
      }
    );
  };

  if (!props.isOpen) return null;

  return (
    <div
      className="modal-root fixed inset-0 flex w-full h-full items-end justify-center bg-black/65 z-[999]"
      onClick={props.onClose}
    >
      <div
        className="modal-container fixed flex bg-white max-w-[calc(100%-2rem)] p-6 w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md dark:bg-surface-black sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full gap-5">
          <h2 className="font-bodycopy font-bold text-lg">
            Set alert reminder
          </h2>
          <div className="flex flex-col gap-4">
            <AppInput variant="CMS"
              inputId="scheduled-at"
              inputType="datetime-local"
              value={formData.scheduledAt}
              onInputChange={handleInputChange("scheduledAt")}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <AppButton variant="light" onClick={props.onClose}>
              Cancel
            </AppButton>
            <AppButton
              onClick={handleSubmit}
              disabled={createWAAlert.isPending}
            >
              {createWAAlert.isPending && (
                <Loader2 className="animate-spin size-4" />
              )}
              Set Alert
            </AppButton>
          </div>
        </div>
        <div
          className="absolute flex top-4 right-4 hover:cursor-pointer"
          onClick={props.onClose}
        >
          <X className="size-6" />
        </div>
      </div>
    </div>
  );
}
