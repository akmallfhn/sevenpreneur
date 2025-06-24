"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical } from "lucide-react";

interface FileItemCMSProps {
  fileIcon: string;
  fileType: string;
}

export default function FileItemCMS({ fileIcon, fileType }: FileItemCMSProps) {
  return (
    <div className="module-item flex items-center justify-between bg-white gap-2 p-1 rounded-md">
      <div className="flex items-center w-[calc(87%)]">
        <div className="icon aspect-square flex size-14 p-3 items-center">
          <Image src={fileIcon} alt="File" width={200} height={200} />
        </div>
        <div className="attribute-data flex flex-col">
          <h3 className="font-bodycopy font-semibold line-clamp-1">
            Cara Membaca Apakah Pebisnis Fraud atau Tidak Setelah Data Berbicara
            Kopling
          </h3>
          <p className="font-brand font-medium text-alternative text-sm">
            {fileType}
          </p>
        </div>
      </div>
      <AppButton variant="ghost" size="small">
        <EllipsisVertical className="size-4" />
      </AppButton>
    </div>
  );
}
