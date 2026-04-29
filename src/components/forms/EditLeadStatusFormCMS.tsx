"use client";
import { trpc } from "@/trpc/client";
import { WALeadStatus } from "@prisma/client";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppSelect, { OptionType } from "../fields/AppSelect";

interface EditLeadStatusFormCMSProps {
  sessionToken: string;
  convId: string;
  isOpen: boolean;
  onClose: () => void;
}

const leadStatusOptions: OptionType[] = [
  { label: "Cold", value: "COLD" },
  { label: "Warm", value: "WARM" },
  { label: "Hot", value: "HOT" },
];

export default function EditLeadStatusFormCMS(
  props: EditLeadStatusFormCMSProps
) {
  const utils = trpc.useUtils();
  const updateConversation = trpc.update.wa.conversation.useMutation();

  // Fetch current conversation data
  const { data: convData, isLoading: isLoadingConv } =
    trpc.read.wa.conversation.useQuery(
      { id: props.convId },
      { enabled: props.isOpen && !!props.convId && !!props.sessionToken }
    );
  const conversation = convData?.conversation;

  // Fetch administrator list (role_id = 0)
  const { data: userData, isLoading: isLoadingUsers } =
    trpc.list.users.useQuery({ role_id: 0 }, { enabled: props.isOpen });

  const handlerOptions: OptionType[] =
    userData?.list.map((user) => ({
      label: user.full_name,
      value: user.id,
      image:
        user.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png",
    })) ?? [];

  const isLoading = isLoadingConv || isLoadingUsers;

  // Form data
  const [formData, setFormData] = useState<{
    handler_id: string | null;
    lead_status: WALeadStatus | null;
  }>({
    handler_id: conversation?.handler_id ?? null,
    lead_status: (conversation?.lead_status as WALeadStatus) ?? null,
  });

  // Sync formData when conversation data loads or convId changes
  useEffect(() => {
    if (conversation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        handler_id: conversation.handler_id ?? null,
        lead_status: (conversation.lead_status as WALeadStatus) ?? null,
      });
    }
  }, [conversation]);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Block scroll
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

  const handleSubmit = async () => {
    if (!formData.lead_status) {
      toast.error("Please select a lead status first");
      return;
    }

    updateConversation.mutate(
      {
        id: props.convId,
        handler_id: formData.handler_id,
        lead_status: formData.lead_status,
      },
      {
        onSuccess: () => {
          toast.success("Lead updated successfully");
          utils.read.wa.conversation.invalidate({ id: props.convId });
          utils.list.wa.conversations.invalidate();
          props.onClose();
        },
        onError: () => {
          toast.error("Failed to update lead");
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
          <h2 className="font-bodycopy font-bold text-lg">Edit Status Lead</h2>
          {isLoading ? (
            <div className="flex w-full justify-center py-6">
              <Loader2 className="animate-spin size-5 text-emphasis" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AppSelect variant="CMS"
                selectId="handler-select"
                selectName="Handled By"
                selectPlaceholder="Select handler"
                value={formData.handler_id}
                options={handlerOptions}
                onChange={handleInputChange("handler_id")}
              />
              <AppSelect variant="CMS"
                selectId="lead-status-select"
                selectName="Lead Status"
                selectPlaceholder="Select lead status"
                value={formData.lead_status}
                options={leadStatusOptions}
                onChange={handleInputChange("lead_status")}
                required
              />
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <AppButton variant="light" onClick={props.onClose}>
              Cancel
            </AppButton>
            <AppButton
              onClick={handleSubmit}
              disabled={updateConversation.isPending || isLoading}
            >
              {updateConversation.isPending && (
                <Loader2 className="animate-spin size-4" />
              )}
              Save Changes
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
