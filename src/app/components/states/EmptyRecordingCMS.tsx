"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { Plus } from "lucide-react";

interface EmptyRecordingCMSProps {
  actionClick: () => void;
  isAllowedUpdateRecording: boolean;
}

export default function EmptyRecordingCMS({
  actionClick,
  isAllowedUpdateRecording,
}: EmptyRecordingCMSProps) {
  return (
    <div className="state-box flex flex-col w-full p-6 items-center lg:px-0 lg:pt-0 lg:justify-center">
      <div className="state-container flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-illustration flex max-w-36 overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//video-recording-null.webp"
            }
            alt="empty-cms"
            width={500}
            height={400}
          />
        </div>
        <div className="state-captions flex flex-col gap-1 items-center">
          <h2 className="state-title flex font-bold font-bodycopy text-center tracking-tight text-xl text-neutral-black">
            This session currently has no recording
          </h2>
          <p className="state-description font-bodycopy text-center font-medium text-alternative text-[15px]">
            You can upload one to complete the archive.
          </p>
        </div>
        {isAllowedUpdateRecording && (
          <AppButton variant="cmsPrimary" size="medium" onClick={actionClick}>
            <Plus className="size-4" />
            Add Video Recording
          </AppButton>
        )}
      </div>
    </div>
  );
}
