"use client";
import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import SelectCMS from "../fields/SelectCMS";
import AppSheet from "../modals/AppSheet";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface CreateInvoiceFormCMSProps {
  sessionToken: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvoiceFormCMS({
  sessionToken,
  isOpen,
  onClose,
}: CreateInvoiceFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createInvoicePlaylist = trpc.purchase.playlist.useMutation();
  const createInvoiceCohort = trpc.purchase.cohort.useMutation();
  const utils = trpc.useUtils();

  // --- Beginning State
  const [formData, setFormData] = useState<{
    invoiceUserId: string;
    invoiceUserPhone: string;
    playlistId?: number;
    paymentChannelId?: number;
    paymentDiscount?: string;
  }>({
    invoiceUserId: "",
    invoiceUserPhone: "",
    playlistId: 0,
    paymentChannelId: 0,
    paymentDiscount: "",
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

  // --- Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // -- Required field checking
    if (!formData.invoiceUserPhone) {
      toast.error("Don’t leave the session untitled");
      setIsSubmitting(false);
      return;
    }

    // -- POST to Database
    try {
      createInvoicePlaylist.mutate(
        {
          // Mandatory fields:
          playlist_id: 1,
          payment_channel_id: 1,

          // Optional fields:
          phone_country_id: 1,
          phone_number: formData.invoiceUserPhone.trim()
            ? formData.invoiceUserPhone
            : null,
          discount_code: formData.paymentDiscount?.trim()
            ? formData.paymentDiscount
            : "",
        },
        {
          onSuccess: () => {
            toast.success(
              "Session successfully created and added to the schedule."
            );
            setIsSubmitting(false);
            utils.list.learnings.invalidate();
            onClose();
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
      sheetName="Create Invoice"
      sheetDescription="Generate and share invoices instantly via a unique link."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="relative w-full h-full flex flex-col">
        <div className="form-container flex flex-col h-full px-6 pb-68 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            {/* <InputCMS
              inputId="learning-name"
              inputName="Session Topic"
              inputType="text"
              inputPlaceholder="What’s the topic of this meeting?"
              value={formData.invoiceUserPhone}
              onInputChange={handleInputChange("learningName")}
              required
            />
            <SelectCMS
              selectId="learning-method"
              selectName="Session Method"
              selectPlaceholder="Choose how this session will be delivered"
              value={formData.invoiceUserId}
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
            /> */}
          </div>
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            // disabled={isSubmitting}
          >
            {/* {isSubmitting && <Loader2 className="animate-spin size-4" />} */}
            Create Session
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
