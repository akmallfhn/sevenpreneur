"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import { EllipsisVertical, Pen, PenLine, Trash2, Video } from "lucide-react";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import EditLearningFormCMS from "../forms/EditLearningFormCMS";

dayjs.extend(localizedFormat);

interface LearningSessionItemCMSProps {
  cohortId: number;
  learningSessionId: number;
  learningSessionName: string;
  learningSessionEducatorName: string;
  learningSessionEducatorAvatar: string;
  learningSessionMethod: string;
  learningSessionDate: string;
  learningSessionPlace?: string;
  onDeleteSuccess?: () => void;
}

export default function LearningSessionItemCMS({
  cohortId,
  learningSessionId,
  learningSessionName,
  learningSessionEducatorName,
  learningSessionEducatorAvatar,
  learningSessionMethod,
  learningSessionDate,
  learningSessionPlace,
  onDeleteSuccess,
}: LearningSessionItemCMSProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [editLearning, setEditLearning] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  let learningLocation;
  if (learningSessionMethod === "ONLINE") {
    learningLocation = "Online";
  } else if (learningSessionPlace) {
    learningLocation = learningSessionPlace;
  }

  // Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsActionsOpened((prev) => !prev);
  };

  // Close dropdown outside
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

  // Delete learning
  const deleteLearning = trpc.delete.learning.useMutation();
  const handleDelete = () => {
    deleteLearning.mutate(
      { id: learningSessionId },
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
      <div className="session-item flex items-center justify-between bg-white gap-2 rounded-md hover:cursor-pointer hover:bg-[#F2F4FA]">
        <Link
          href={`/cohorts/${cohortId}/learnings/${learningSessionId}`}
          className="session-box flex w-full p-3.5 max-w-[calc(90%)] items-center font-bodycopy"
        >
          <div className="session-container flex items-center gap-4">
            <div className="session-date flex flex-col w-14 items-center aspect-square shrink-0">
              <p className="session-day font-medium text-sm">
                {dayjs(learningSessionDate).format("ddd")}
              </p>
              <p className="session-date font-brand font-semibold text-3xl">
                {dayjs(learningSessionDate).format("D")}
              </p>
            </div>
            <div className="divider w-[1px] self-stretch bg-outline" />
            <div className="session-schedule flex flex-col w-30 text-sm gap-1 font-medium text-[#333333] shrink-0">
              <div className="session-time flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-alternative" />
                <p>{dayjs(learningSessionDate).format("HH:mm")}</p>
              </div>
              <div className="session-place flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-alternative shrink-0"
                />
                <p className="line-clamp-1">{learningLocation}</p>
              </div>
            </div>
            <div className="divider w-[1px] self-stretch bg-outline" />
            <div className="session-metadata flex items-center gap-3">
              <div className="session-educator-avatar aspect-square size-9 shrink-0 rounded-full overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={learningSessionEducatorAvatar}
                  alt={learningSessionEducatorName}
                  width={600}
                  height={600}
                />
              </div>
              <div className="session-title flex flex-col">
                <h2 className="session-title text-[15px] font-bold line-clamp-1">
                  {learningSessionName}
                </h2>
                <p className="session-educator font-medium text-sm text-[#333333]">
                  {learningSessionEducatorName}
                </p>
              </div>
            </div>
          </div>
        </Link>
        {/* Button action */}
        <div className="actions-button flex relative p-1" ref={wrapperRef}>
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
            {/* <AppDropdownItemList
              menuIcon={<PenLine className="size-4" />}
              menuName="Edit session"
              onClick={() => setEditLearning(true)}
            /> */}
            <AppDropdownItemList
              menuIcon={<Trash2 className="size-4" />}
              menuName="Delete session"
              isDestructive
              onClick={() => setIsOpenDeleteConfirmation(true)}
            />
          </AppDropdown>
        </div>
      </div>

      {/* Edit Learning */}
      {/* {editLearning && (
        <EditLearningFormCMS
          sessionToken={sessionToken}
          learningId={learningSessionId}
          initialData={learningDetailsData?.learning}
          isOpen={editLearning}
          onClose={() => setEditLearning(false)}
        />
      )} */}

      {/* Delete Learning*/}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${learningSessionName}? This action cannot be undone.`}
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
