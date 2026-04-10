"use client";
import { LeadStatus } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import { CloudSync, Loader, PenBox, TextAlignStart } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import TextAreaCMS from "../fields/TextAreaCMS";
import LeadStatusLabelCMS from "../labels/LeadStatusLabelCMS";
import { Slider } from "../ui/slider";

interface WhatsappLeadDetailsCMSProps {
  conversationId: string;
  leadId: string | null;
  leadName: string;
  leadAvatar: string | null;
  leadPhoneNumber: string;
  leadEmail: string | null;
  leadStatus: LeadStatus;
  leadWinningRate: number;
}

export default function WhatsappLeadDetailsCMS(
  props: WhatsappLeadDetailsCMSProps
) {
  const updateConversation = trpc.update.wa.conversation.useMutation();

  // State for winning rate
  const [winningRate, setWinningRate] = useState(props.leadWinningRate);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch
  const handleWinningRateChange = (value: number[]) => {
    const newRate = value[0];
    setWinningRate(newRate);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateConversation.mutate({
        id: props.conversationId,
        winning_rate: newRate,
      });
    }, 600);
  };

  const initialName = props.leadName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="lead-informations flex flex-col w-full gap-4 p-3 py-5 overflow-y-auto">
      <div className="lead-identity flex flex-col items-center gap-2">
        <div className="lead-avatar size-24 rounded-full overflow-hidden">
          {props.leadAvatar ? (
            <Image
              src={props.leadAvatar}
              alt={props.leadName}
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
            {props.leadName}
          </p>
          <p className="lead-phone-number text-sm text-[#333333]/70 font-semibold font-bodycopy leading-snug line-clamp-1">
            {props.leadPhoneNumber}
          </p>
          {props.leadEmail && (
            <p className="lead-email text-sm text-[#333333]/70 font-semibold font-bodycopy leading-snug line-clamp-1">
              {props.leadEmail}
            </p>
          )}
        </div>
        {!props.leadId && (
          <AppButton size="smallRounded" variant="primarySoft">
            <CloudSync className="size-4" />
            Sync to Database
          </AppButton>
        )}
      </div>
      <div className="lead-details flex flex-col gap-2 p-3 bg-section-background/50  border border-outline rounded-md">
        <div className="flex w-full justify-between items-center leading-snug">
          <h5 className="font-bodycopy text-[15px] font-bold">Lead Details</h5>
          <AppButton className="text-tertiary" size="small" variant="ghost">
            <PenBox className="size-3.5" />
            Edit
          </AppButton>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center">
            <p className="label w-32 text-sm text-alternative font-bodycopy font-medium">
              Handled by
            </p>
            <div className="flex w-full">
              <div className="input flex w-fit items-center gap-2 bg-white py-1 px-2 rounded-full border border-outline">
                <div className="size-5 rounded-full overflow-hidden">
                  <Image
                    src={"https://i.pravatar.cc/150?img=1"}
                    alt="user"
                    width={500}
                    height={500}
                  />
                </div>
                <p className="text-sm text-[#333333] font-bodycopy font-semibold">
                  Devin Suhartono
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center">
            <p className="label w-32 text-sm text-alternative font-bodycopy font-medium">
              Status
            </p>
            <div className="input w-full">
              <LeadStatusLabelCMS variants={props.leadStatus} />
            </div>
          </div>
        </div>
      </div>
      <div className="lead-progress flex flex-col gap-2 p-3 bg-section-background/50  border border-outline rounded-md">
        <div className="flex items-center gap-2">
          <Loader className="size-4 text-alternative" />
          <h5 className="font-bodycopy text-[15px] font-bold">Winning Rate</h5>
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
          <TextAlignStart className="size-4 text-alternative" />
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
  );
}
