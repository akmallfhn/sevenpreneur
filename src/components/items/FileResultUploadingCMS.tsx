"use client";
import { Progress } from "@/components/ui/progress";
import { FileVariant } from "@/lib/app-types";
import { getFileIconAndType } from "@/lib/file-variants";
import Image from "next/image";
import React from "react";

interface FileResultUploadingCMSProps {
  fileName: string;
  fileURL: string;
  variants: FileVariant;
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
  const { fileIcon } = getFileIconAndType(variants);

  return (
    <React.Fragment>
      <div className="file-container flex items-center justify-between bg-white border border-outline gap-2 p-1 rounded-md">
        <a
          href={fileURL}
          className="flex items-center w-[calc(87%)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="file-icon aspect-square flex size-14 p-3 items-center">
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
            {isUploading ? (
              <div className="w-full py-1.5">
                <Progress value={uploadProgress} />
              </div>
            ) : (
              <p className="file-upload-status font-bodycopy font-medium text-alternative text-sm">
                Completed
              </p>
            )}
          </div>
        </a>
      </div>
    </React.Fragment>
  );
}
