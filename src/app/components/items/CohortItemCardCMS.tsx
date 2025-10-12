"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical, MoveRight, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";

dayjs.extend(localizedFormat);

interface CohortItemCardCMSProps {
  cohortId: number;
  cohortName: string;
  cohortImage: string;
  cohortStartDate: string;
  cohortEndDate: string;
  onDeleteSuccess?: () => void;
}

export default function CohortItemCardCMS({
  cohortId,
  cohortName,
  cohortImage,
  cohortStartDate,
  cohortEndDate,
  onDeleteSuccess,
}: CohortItemCardCMSProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // Function to delete cohort
  const deleteUser = trpc.delete.cohort.useMutation();
  const handleDelete = () => {
    deleteUser.mutate(
      { id: cohortId },
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
      <div className="card-container relative">
        <Link
          href={`/cohorts/${cohortId}`}
          className="flex flex-col w-[252px] bg-white shadow-md rounded-md overflow-hidden"
        >
          {/* --- Thumbnail */}
          <div className="image-thumbnail flex w-full aspect-thumbnail overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={cohortImage}
              alt="thumbnail"
              width={500}
              height={500}
            />
          </div>
          {/* --- Metadata */}
          <div className="metadata relative flex flex-col p-3 gap-2 h-[132px]">
            <h3 className="cohort-title text-base font-bodycopy font-bold line-clamp-2">
              {cohortName}
            </h3>
            <div className="cohort-participant flex gap-2 items-center text-alternative">
              <FontAwesomeIcon icon={faUser} className="size-3" />
              {/* <p className="font-bodycopy font-medium text-sm">
                1,934 students joined
              </p> */}
            </div>
            <div className="cohort-timeline flex gap-2 items-center text-alternative">
              <FontAwesomeIcon icon={faCalendar} className="size-3" />
              <div className="flex font-bodycopy font-medium text-sm items-center gap-1">
                <span>{dayjs(cohortStartDate).format("ll")}</span> -{" "}
                <span>{dayjs(cohortEndDate).format("ll")}</span>
              </div>
            </div>
          </div>
        </Link>
        {/* --- Actions Button */}
        <div className="absolute top-2 right-2">
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
      </div>

      {/* --- Delete Confirmation */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${cohortName}? This action cannot be undone.`}
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
