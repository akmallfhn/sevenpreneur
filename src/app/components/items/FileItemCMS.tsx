"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import DropdownMenuCMS from "../elements/DropdownMenuCMS";
import AppAlertDialog from "../modals/AppAlertDialog";
import EditModuleFormCMS from "../forms/EditModuleFormCMS";

export type fileVariant =
  | "DOCX"
  | "XLSX"
  | "PPTX"
  | "PDF"
  | "FILE"
  | "FIGMADESIGN"
  | "FIGJAM"
  | "UNKNOWN";

const variantStyles: Record<
  fileVariant,
  {
    fileIcon: string;
    fileType: string;
  }
> = {
  DOCX: {
    fileIcon:
      "https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png",
    fileType: "DOCX",
  },
  XLSX: {
    fileIcon:
      "https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png",
    fileType: "XLSX",
  },
  PPTX: {
    fileIcon:
      "https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png",
    fileType: "PPTX",
  },
  PDF: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//pdf-icon.webp",
    fileType: "PDF",
  },
  FILE: {
    fileIcon:
      "https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",
    fileType: "DRIVE FILE",
  },
  FIGMADESIGN: {
    fileIcon:
      "https://www.figma.com/community/resource/e892b10a-dc9e-498b-9830-8fc0485ac820/thumbnail",
    fileType: "FIGMA DESIGN",
  },
  FIGJAM: {
    fileIcon:
      "https://www.figma.com/community/resource/e892b10a-dc9e-498b-9830-8fc0485ac820/thumbnail",
    fileType: "FIGMA JAM",
  },
  UNKNOWN: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//unknown-icon%20(1).webp",
    fileType: "UNKNOWN FORMAT",
  },
};

interface FileItemCMSProps {
  sessionToken: string;
  cohortId: number;
  fileId: number;
  fileName: string;
  fileURL: string;
  variants: fileVariant;
  onDeleteSuccess?: () => void;
}

export default function FileItemCMS({
  sessionToken,
  cohortId,
  fileId,
  fileName,
  fileURL,
  variants,
  onDeleteSuccess,
}: FileItemCMSProps) {
  // --- Variant declarations
  const { fileIcon, fileType } = variantStyles[variants];

  // --- State
  const [editFile, setEditFile] = useState(false);
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // --- Function to delete module
  const deleteModule = trpc.delete.module.useMutation();
  const deleteMaterial = trpc.delete.material.useMutation();
  const handleDelete = () => {
    deleteModule.mutate(
      { id: fileId },
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
      <div className="module-item flex items-center justify-between bg-white gap-2 p-1 rounded-md">
        <Link
          href={fileURL}
          className="flex items-center w-[calc(87%)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="icon aspect-square flex size-14 p-3 items-center">
            <Image
              className="object-cover w-full h-full"
              src={fileIcon}
              alt="File"
              width={200}
              height={200}
            />
          </div>
          <div className="attribute-data flex flex-col">
            <h3 className="font-bodycopy font-semibold text-black text-[15px] line-clamp-1">
              {fileName}
            </h3>
            <p className="font-bodycopy font-medium text-alternative text-sm">
              {fileType}
            </p>
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

          <DropdownMenuCMS
            isOpen={isActionsOpened}
            onClose={() => setIsActionsOpened(false)}
          >
            {/* -- Edit */}
            <div
              className="menu-list flex px-6 pl-4 py-2 items-center gap-2 hover:text-cms-primary hover:bg-[#E1EDFF] hover:cursor-pointer"
              onClick={() => setEditFile(true)}
            >
              <Settings2 className="size-4" />
              Edit
            </div>
            <div
              className="menu-list flex px-6 pl-4 py-2 items-center gap-2 text-destructive hover:bg-[#FFCDC9] hover:cursor-pointer"
              onClick={() => setIsOpenDeleteConfirmation(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </div>
          </DropdownMenuCMS>
        </div>
      </div>

      {/* --- Delete Confirmation */}
      {isOpenDeleteConfirmation && (
        <AppAlertDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${fileName}? This action cannot be undone.`}
          isOpen={isOpenDeleteConfirmation}
          onClose={() => setIsOpenDeleteConfirmation(false)}
          onConfirm={() => {
            handleDelete();
            setIsOpenDeleteConfirmation(false);
          }}
        />
      )}

      {editFile && (
        <EditModuleFormCMS
          sessionToken={sessionToken}
          cohortId={cohortId}
          moduleId={fileId}
          isOpen={editFile}
          onClose={() => setEditFile(false)}
        />
      )}
    </React.Fragment>
  );
}
