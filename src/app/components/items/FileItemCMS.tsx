"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical, Settings2, Trash2 } from "lucide-react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import EditModuleFormCMS from "../forms/EditModuleFormCMS";
import EditMaterialFormCMS from "../forms/EditMaterialFormCMS";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import { FileVariant } from "@/lib/app-types";
import { getFileIconAndType, getFileVariantFromURL } from "@/lib/file-variants";

interface FileItemCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId?: number;
  learningId?: number;
  fileId: number;
  fileName: string;
  fileURL: string;
  onDeleteSuccess?: () => void;
}

export default function FileItemCMS({
  sessionToken,
  sessionUserRole,
  cohortId,
  learningId,
  fileId,
  fileName,
  fileURL,
  onDeleteSuccess,
}: FileItemCMSProps) {
  const variant = getFileVariantFromURL(fileURL);
  const { fileIcon, fileType } = getFileIconAndType(variant);
  const [editFile, setEditFile] = useState(false);
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isLearningDetailsPage = pathname.includes("/learnings/");

  const allowedRolesUpdateFile = [0, 2];
  const allowedRolesDeleteFile = [0, 2];
  const isAllowedUpdateFile = allowedRolesUpdateFile.includes(sessionUserRole);
  const isAllowedDeleteFile = allowedRolesDeleteFile.includes(sessionUserRole);

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

  // Function to delete module
  const deleteModule = trpc.delete.module.useMutation();
  const deleteMaterial = trpc.delete.material.useMutation();
  const handleDelete = () => {
    if (isLearningDetailsPage) {
      deleteMaterial.mutate(
        { id: fileId },
        {
          onSuccess: () => {
            toast.success("Learning material has been successfully removed");
            onDeleteSuccess?.();
          },
          onError: (error) => {
            toast.error("Failed to delete the learning material.", {
              description: `${error}`,
            });
          },
        }
      );
    } else {
      deleteModule.mutate(
        { id: fileId },
        {
          onSuccess: () => {
            toast.success("File has been successfully deleted");
            onDeleteSuccess?.();
          },
          onError: (err) => {
            toast.error("Unable to delete this file.", {
              description: `${err}`,
            });
          },
        }
      );
    }
  };

  return (
    <React.Fragment>
      <div className="file-container flex items-center justify-between bg-white gap-2 p-1 rounded-md">
        <Link
          href={fileURL}
          className="flex items-center w-[calc(87%)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="file-icon aspect-square flex size-14 p-1 items-center">
            <Image
              className="object-cover w-full h-full"
              src={fileIcon}
              alt="File"
              width={200}
              height={200}
            />
          </div>
          <div className="file-attribute flex flex-col">
            <h3 className="file-name font-bodycopy font-semibold text-black text-[15px] line-clamp-1">
              {fileName}
            </h3>
            <p className="file-type font-bodycopy font-medium text-alternative text-sm">
              {fileType}
            </p>
          </div>
        </Link>
        {(isAllowedUpdateFile || isAllowedDeleteFile) && (
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
              alignMobile="right"
              alignDesktop="right"
            >
              {isAllowedUpdateFile && (
                <AppDropdownItemList
                  menuIcon={<Settings2 className="size-4" />}
                  menuName="Edit File"
                  onClick={() => setEditFile(true)}
                />
              )}
              {isAllowedDeleteFile && (
                <AppDropdownItemList
                  menuIcon={<Trash2 className="size-4" />}
                  menuName="Delete"
                  isDestructive
                  onClick={() => setIsOpenDeleteConfirmation(true)}
                />
              )}
            </AppDropdown>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${fileName}? This action cannot be undone.`}
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

      {/* Edit File */}
      {editFile &&
        (isLearningDetailsPage ? (
          <EditMaterialFormCMS
            sessionToken={sessionToken}
            learningId={learningId!}
            materialId={fileId}
            isOpen={editFile}
            onClose={() => setEditFile(false)}
          />
        ) : (
          <EditModuleFormCMS
            sessionToken={sessionToken}
            cohortId={cohortId!}
            moduleId={fileId}
            isOpen={editFile}
            onClose={() => setEditFile(false)}
          />
        ))}
    </React.Fragment>
  );
}
