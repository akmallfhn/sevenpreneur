"use client";
import { trpc } from "@/trpc/client";
import {
  BellPlus,
  Loader,
  Loader2,
  PenBox,
  TextAlignStart,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import TextAreaCMS from "../fields/TextAreaCMS";
import CreateWhatsappAlertFormCMS from "../forms/CreateWhatsappAlertFormCMS";
import EditLeadStatusFormCMS from "../forms/EditLeadStatusFormCMS";
import LeadStatusLabelCMS from "../labels/LeadStatusLabelCMS";
import { Slider } from "../ui/slider";
import AppLoadingComponents from "../states/AppLoadingComponents";
import AppErrorComponents from "../states/AppErrorComponents";

interface WhatsappLeadDetailsCMSProps {
  sessionToken: string;
  convId: string;
}

export default function WhatsappLeadDetailsCMS(
  props: WhatsappLeadDetailsCMSProps
) {
  const utils = trpc.useUtils();
  const updateConversation = trpc.update.wa.conversation.useMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingUnassign, setIsLoadingUnassign] = useState(false);
  const [createAlert, setCreateAlert] = useState(false);

  // Fetch tRPC Data
  const { data, isLoading, isError } = trpc.read.wa.conversation.useQuery(
    { id: props.convId },
    { enabled: !!props.sessionToken && !!props.convId }
  );
  const leadDetails = data?.conversation;

  // State for winning rate
  const [winningRate, setWinningRate] = useState(
    leadDetails?.winning_rate ?? 0
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setWinningRate(leadDetails?.winning_rate ?? 0);
  }, [leadDetails?.winning_rate, props.convId]);

  // Unassign handler
  const handleUnassigned = () => {
    setIsLoadingUnassign(true);

    try {
      updateConversation.mutate(
        { id: props.convId, handler_id: null },
        {
          onSuccess: () =>
            utils.read.wa.conversation.invalidate({ id: props.convId }),
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingUnassign(false);
    }
  };

  // Update winning rate change
  const handleWinningRateChange = (value: number[]) => {
    const newRate = value[0];
    setWinningRate(newRate);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateConversation.mutate(
        { id: props.convId, winning_rate: newRate },
        {
          onSuccess: () =>
            utils.read.wa.conversation.invalidate({ id: props.convId }),
        }
      );
    }, 600);
  };

  const leadName =
    leadDetails?.user?.full_name || leadDetails?.full_name || "-";

  const initialName = leadName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <React.Fragment>
      <div className="flex w-full h-full">
        {isLoading && <AppLoadingComponents />}
        {isError && <AppErrorComponents />}

        {leadDetails && !isLoading && !isError && (
          <div className="lead-informations flex flex-col w-full gap-4 p-3 py-5 overflow-y-auto">
            <div className="tool flex w-full items-center justify-end gap-2">
              <AppButton
                variant="light"
                size="icon"
                onClick={() => setCreateAlert(true)}
              >
                <BellPlus className="size-4.5" />
              </AppButton>
            </div>
            <div className="lead-identity flex flex-col items-center gap-2">
              <div className="lead-avatar size-24 rounded-full overflow-hidden">
                {leadDetails.user?.avatar ? (
                  <Image
                    src={leadDetails.user.avatar}
                    alt={leadName}
                    width={500}
                    height={500}
                  />
                ) : (
                  <div className="flex w-full h-full items-center justify-center bg-secondary-soft-background text-secondary-soft-foreground">
                    <p className="font-bodycopy font-medium text-3xl">
                      {initialName}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="lead-name text-lg text-center font-bold font-bodycopy leading-snug line-clamp-2">
                  {leadName}
                </p>
                <p className="lead-phone-number text-sm text-emphasis font-semibold font-bodycopy leading-snug line-clamp-1">
                  {leadDetails.user?.phone_number || leadDetails.phone_number}
                </p>
                {leadDetails.user?.email && (
                  <p className="lead-email text-sm text-emphasis font-semibold font-bodycopy leading-snug line-clamp-1">
                    {leadDetails.user.email}
                  </p>
                )}
              </div>
            </div>
            <div className="lead-details flex flex-col gap-2 p-3 bg-section-background/50  border border-outline rounded-md">
              <div className="flex w-full justify-between items-center leading-snug">
                <h5 className="font-bodycopy text-[15px] font-bold">
                  Lead Details
                </h5>
                <AppButton
                  className="text-tertiary"
                  size="small"
                  variant="ghost"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <PenBox className="size-3.5" />
                  Edit
                </AppButton>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex w-full items-center">
                  <p className="label w-32 text-sm text-emphasis font-bodycopy font-medium">
                    Handled by
                  </p>
                  <div className="flex w-full">
                    {leadDetails.handler_id ? (
                      <div className="input flex w-fit items-center gap-2 bg-white py-1 px-2 rounded-full border border-outline">
                        <div className="size-5 rounded-full shrink-0 overflow-hidden">
                          <Image
                            className="object-cover w-full h-full"
                            src={
                              leadDetails.handler?.avatar ||
                              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                            }
                            alt="user"
                            width={500}
                            height={500}
                          />
                        </div>
                        <p className="text-sm text-[#333333] font-bodycopy font-semibold line-clamp-1">
                          {leadDetails.handler?.full_name}
                        </p>
                        <AppButton
                          className="shrink-0"
                          variant="destructiveSoft"
                          size="smallIconRounded"
                          onClick={handleUnassigned}
                          disabled={isLoadingUnassign}
                        >
                          {isLoadingUnassign ? (
                            <Loader2 className="animate-spin size-4" />
                          ) : (
                            <X className="size-4" />
                          )}
                        </AppButton>
                      </div>
                    ) : (
                      <p className="py-1 px-2 text-sm bg-secondary-soft-background text-secondary-soft-foreground font-bodycopy font-semibold rounded-full">
                        Unassigned
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex w-full items-center">
                  <p className="label w-32 text-sm text-emphasis font-bodycopy font-medium">
                    Status
                  </p>
                  <div className="input w-full">
                    <LeadStatusLabelCMS
                      variants={leadDetails?.lead_status ?? "COLD"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="lead-progress flex flex-col gap-2 p-3 bg-section-background/50  border border-outline rounded-md">
              <div className="flex items-center gap-2">
                <Loader className="size-4 text-emphasis" />
                <h5 className="font-bodycopy text-[15px] font-bold">
                  Winning Rate
                </h5>
              </div>
              <div className="flex w-full items-center gap-2">
                <Slider
                  value={[winningRate]}
                  max={100}
                  step={5}
                  onValueChange={handleWinningRateChange}
                />
                <div className="input w-fit text-sm text-[#333333] font-bodycopy font-medium">
                  {winningRate}%
                </div>
              </div>
            </div>
            <div className="notes flex flex-col gap-2 p-3 bg-section-background/50 border border-outline rounded-md">
              <div className="flex items-center gap-2">
                <TextAlignStart className="size-4 text-emphasis" />
                <h5 className="font-bodycopy text-[15px] font-bold">Notes</h5>
              </div>
              <TextAreaCMS
                textAreaId="chat-notes"
                textAreaPlaceholder="Take notes for important things"
                textAreaHeight="h-32"
                value={""}
                // onTextAreaChange={handleInputChange("cohortDescription")}
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Create alert */}
      {createAlert && (
        <CreateWhatsappAlertFormCMS
          sessionToken={props.sessionToken}
          convId={props.convId}
          isOpen={createAlert}
          onClose={() => setCreateAlert(false)}
        />
      )}

      {/* Edit status lead */}
      <EditLeadStatusFormCMS
        sessionToken={props.sessionToken}
        convId={props.convId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </React.Fragment>
  );
}
