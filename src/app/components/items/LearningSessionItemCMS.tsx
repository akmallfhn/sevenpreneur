"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import { ChevronRight, EllipsisVertical, Trash2, Video } from "lucide-react";
import AppButton from "../buttons/AppButton";
import LearningSessionIconLabelCMS, {
  LearningSessionVariant,
} from "../labels/LearningSessionIconLabelCMS";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";

dayjs.extend(localizedFormat);

interface LearningSessionItemCMSProps {
  cohortId: number;
  sessionLearningId: number;
  sessionName: string;
  sessionEducatorName?: string;
  sessionEducatorAvatar?: string | null;
  sessionMethod: string;
  sessionDate: string;
  sessionMeetingURL?: string | null;
  onDeleteSuccess?: () => void;
}

export default function LearningSessionItemCMS({
  cohortId,
  sessionLearningId,
  sessionName,
  sessionEducatorName,
  sessionEducatorAvatar,
  sessionMethod,
  sessionDate,
  sessionMeetingURL,
  onDeleteSuccess,
}: LearningSessionItemCMSProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const externalLinkRef = useRef<HTMLAnchorElement | null>(null);

  // --- Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsActionsOpened((prev) => !prev);
  };

  // --- Close dropdown outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | (MouseEvent & { target: Node })
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsActionsOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Function to delete learning
  const deleteLearning = trpc.delete.learning.useMutation();
  const handleDelete = () => {
    deleteLearning.mutate(
      { id: sessionLearningId },
      {
        onSuccess: () => {
          toast.success("Delete success");
          onDeleteSuccess?.();
        },
        onError: (err) => {
          toast.error("Failed to delete cohort", {
            description: `${err}`,
          });
        },
      }
    );
  };
  return (
    <React.Fragment>
      <div className="session-item flex items-center justify-between bg-white gap-2 p-3 rounded-md">
        <Link
          href={`/cohorts/${cohortId}/learnings/${sessionLearningId}`}
          className="flex w-[calc(87%)] gap-3 items-center"
        >
          <LearningSessionIconLabelCMS
            variants={sessionMethod as LearningSessionVariant}
          />
          <div className="attribute-data flex flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <h3 className="session-name font-bodycopy font-bold line-clamp-1 ">
                {sessionName}
              </h3>
              <div className="flex gap-3 items-center">
                <div className="session-educator flex gap-2 items-center">
                  <div className="avatar size-[29px] rounded-full overflow-hidden">
                    <Image
                      className="object-cover w-full h-full"
                      src={
                        sessionEducatorAvatar ??
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                      }
                      alt="Avatar User"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex flex-col text-[13px] leading-snug font-bodycopy font-medium text-black/50">
                    <p className="educator-name">
                      by{" "}
                      <span className="text-black font-semibold">
                        {sessionEducatorName || "Sevenpreneur Team"}
                      </span>
                    </p>
                    <p className="date-time">
                      {dayjs(sessionDate).format("llll")}
                    </p>
                  </div>
                </div>
                {sessionMethod !== "ONSITE" && sessionMeetingURL && (
                  <AppButton
                    variant="outline"
                    size="small"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      externalLinkRef.current?.click();
                    }}
                  >
                    <Video className="size-4" />
                    Launch meeting
                  </AppButton>
                )}
              </div>
            </div>
          </div>
        </Link>
        {/* Button action */}
        <div className="actions-button flex relative" ref={wrapperRef}>
          <AppButton
            variant="ghost"
            size="small"
            type="button"
            onClick={handleActionsDropdown}
          >
            <EllipsisVertical className="size-4" />
          </AppButton>

          <AppDropdown
            isOpen={isActionsOpened}
            onClose={() => setIsActionsOpened(false)}
          >
            <AppDropdownItemList
              menuIcon={<Trash2 className="size-4" />}
              menuName="Delete"
              isDestructive
              onClick={() => setIsOpenDeleteConfirmation(true)}
            />
          </AppDropdown>
        </div>
      </div>

      {/* --- Redirect link meeting */}
      <a
        href={sessionMeetingURL!}
        ref={externalLinkRef}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden"
      />

      {/* --- Delete Confirmation */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${sessionName}? This action cannot be undone.`}
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={isOpenDeleteConfirmation}
          onClose={() => setIsOpenDeleteConfirmation(false)}
          onConfirm={() => {
            handleDelete();
            setIsOpenDeleteConfirmation(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
