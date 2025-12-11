"use client";
import { getDateTimeRange } from "@/lib/date-time-manipulation";
import { trpc } from "@/trpc/client";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { EllipsisVertical, PenTool, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import EditCohortFormCMS from "../forms/EditCohortFormCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";

dayjs.extend(localizedFormat);

interface CohortItemCardCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
  cohortName: string;
  cohortImage: string;
  cohortStartDate: string;
  cohortEndDate: string;
  onDeleteSuccess?: () => void;
}

export default function CohortItemCardCMS({
  sessionToken,
  sessionUserRole,
  cohortId,
  cohortName,
  cohortImage,
  cohortStartDate,
  cohortEndDate,
  onDeleteSuccess,
}: CohortItemCardCMSProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [editCohort, setEditCohort] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const allowedRolesUpdateCohort = [0, 2];
  const allowedRolesDeleteCohort = [0, 2];
  const isAllowedUpdateCohort =
    allowedRolesUpdateCohort.includes(sessionUserRole);
  const isAllowedDeleteCohort =
    allowedRolesDeleteCohort.includes(sessionUserRole);

  // Get time range
  const { dateString } = getDateTimeRange({
    startDate: cohortStartDate,
    endDate: cohortEndDate,
  });

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
      <div className="cohort-wrapper relative flex w-full h-full">
        <Link
          href={`/cohorts/${cohortId}`}
          className="cohort-container flex flex-col w-full p-3 gap-2 bg-white border rounded-lg overflow-hidden transition transform active:scale-95"
        >
          <div className="cohort-image flex w-full aspect-thumbnail rounded-md overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={cohortImage}
              alt="cohort-image"
              width={500}
              height={500}
            />
          </div>
          <div className="cohort-attributes flex flex-col gap-2 h-[92px]">
            <h3 className="cohort-title text-base font-bodycopy font-bold line-clamp-2 xl:text-[17px] 2xl:text-lg">
              {cohortName}
            </h3>
            <div className="cohort-timeline flex gap-1.5 items-center text-alternative">
              <FontAwesomeIcon icon={faCalendar} className="xs" />
              <div className="flex font-bodycopy font-medium text-sm items-center gap-1">
                {dateString}
              </div>
            </div>
          </div>
        </Link>
        {(isAllowedUpdateCohort || isAllowedDeleteCohort) && (
          <div className="cohort-actions absolute top-5 right-5">
            <div
              className="cohort-actions-button flex relative"
              ref={wrapperRef}
            >
              <AppButton
                variant="outline"
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
                {isAllowedUpdateCohort && (
                  <AppDropdownItemList
                    menuIcon={<PenTool className="size-4" />}
                    menuName="Edit Cohort"
                    onClick={() => setEditCohort(true)}
                  />
                )}
                {isAllowedDeleteCohort && (
                  <AppDropdownItemList
                    menuIcon={<Trash2 className="size-4" />}
                    menuName="Delete Cohort"
                    isDestructive
                    onClick={() => setDeleteConfirmation(true)}
                  />
                )}
              </AppDropdown>
            </div>
          </div>
        )}
      </div>

      {/* Edit Cohort */}
      {editCohort && (
        <EditCohortFormCMS
          sessionToken={sessionToken}
          cohortId={cohortId}
          isOpen={editCohort}
          onClose={() => setEditCohort(false)}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${cohortName}? This action cannot be undone.`}
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={deleteConfirmation}
          onClose={() => setDeleteConfirmation(false)}
          onConfirm={() => {
            handleDelete();
            setDeleteConfirmation(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
