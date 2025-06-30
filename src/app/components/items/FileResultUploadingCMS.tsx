"use client";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type uploadFileVariant = "PDF" | "UNKNOWN";

const variantStyles: Record<
  uploadFileVariant,
  {
    fileIcon: string;
    fileType: string;
  }
> = {
  PDF: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//pdf-icon.webp",
    fileType: "PDF",
  },
  UNKNOWN: {
    fileIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//unknown-icon%20(1).webp",
    fileType: "UNKNOWN FORMAT",
  },
};

interface FileResultUploadingCMSProps {
  fileName: string;
  fileURL: string;
  variants: uploadFileVariant;
  isUploading?: boolean;
  uploadProgress?: number;
}

export default function FileResultUploadingCMS({
  fileName,
  fileURL,
  variants,
  isUploading,
  uploadProgress,
}: FileResultUploadingCMSProps) {
  // --- Variant declarations
  const { fileIcon, fileType } = variantStyles[variants];

  return (
    <React.Fragment>
      <div className="module-item flex items-center justify-between bg-white border border-outline gap-2 p-1 rounded-md">
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

            {isUploading ? (
              <Progress value={uploadProgress} />
            ) : (
              <p className="font-bodycopy font-medium text-alternative text-sm">
                Completed
              </p>
            )}
          </div>
        </Link>
      </div>
    </React.Fragment>
  );
}
