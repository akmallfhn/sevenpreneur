"use client";
import React, { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import { Gauge } from "@mui/x-charts/Gauge";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import Link from "next/link";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import EditProjectFormCMS from "../forms/EditProjectFormCMS";

dayjs.extend(localizedFormat);

interface ProjectItemCMSProps {
  cohortId: number;
  projectId: number;
  projectName: string;
  lastSubmission: string;
  submissionPercentage: number;
  onDeleteSuccess?: () => void;
}

export default function ProjectItemCMS({
  cohortId,
  projectId,
  projectName,
  lastSubmission,
  submissionPercentage,
  onDeleteSuccess,
}: ProjectItemCMSProps) {
  // State
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [editProject, setEditProject] = useState(false);
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

  // --- Function to delete project
  const deleteProject = trpc.delete.project.useMutation();
  const handleDelete = () => {
    deleteProject.mutate(
      { id: projectId },
      {
        onSuccess: () => {
          toast.success(`Project ${projectName} has been successfully removed`);
          onDeleteSuccess?.();
        },
        onError: (error) => {
          toast.error(`Failed to delete the ${projectName}`, {
            description: `${error}`,
          });
        },
      }
    );
  };
  return (
    <React.Fragment>
      <div className="project-item flex items-center justify-between bg-white gap-2 p-1 rounded-md">
        <Link href={`/cohorts/${cohortId}/projects/${projectId}/submissions`}>
          <div className="flex items-center w-[calc(87%)]">
            <div className="icon relative aspect-square flex size-20 p-3 items-center">
              <Gauge width={200} height={200} value={submissionPercentage} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-black bg-white font-bodycopy">
                  {submissionPercentage}%
                </span>
              </div>
            </div>
            <div className="attribute-data flex flex-col">
              <h3 className="font-bodycopy font-semibold text-black text-[15px] line-clamp-1">
                {projectName}
              </h3>
              <p className="font-bodycopy font-medium text-alternative text-[13px]">
                Last submission:{" "}
                {dayjs(lastSubmission).format("D MMM YYYY HH.mm")}
              </p>
            </div>
          </div>
        </Link>
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
            alignDesktop="right"
            onClose={() => setIsActionsOpened(false)}
          >
            <AppDropdownItemList
              menuIcon={<Pencil className="size-4" />}
              menuName="Edit"
              onClick={() => setEditProject(true)}
            />
            <AppDropdownItemList
              menuIcon={<Trash2 className="size-4" />}
              menuName="Delete"
              isDestructive
              onClick={() => setIsOpenDeleteConfirmation(true)}
            />
          </AppDropdown>
        </div>
      </div>

      {/* Open Edit Form */}
      {editProject && (
        <EditProjectFormCMS
          projectId={projectId}
          isOpen={editProject}
          onClose={() => setEditProject(false)}
        />
      )}

      {/* Delete Confirmation */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${projectName}? This action cannot be undone.`}
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
