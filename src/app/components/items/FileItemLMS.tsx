"use client";
import { FileVariant } from "@/lib/app-types";
import { getFileIconAndType } from "@/lib/file-variants";
import Image from "next/image";
import Link from "next/link";

interface FileItemLMSProps {
  fileName: string;
  fileURL: string;
  variants: FileVariant;
}

export default function FileItemLMS({
  fileName,
  fileURL,
  variants,
}: FileItemLMSProps) {
  const { fileIcon, fileType } = getFileIconAndType(variants);
  return (
    <Link
      href={fileURL}
      className="file-container flex w-full h-fit items-center gap-2 p-2 bg-section-background rounded-md transform transition hover:bg-[#EDF0F6]"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="file-icon aspect-square flex size-14 p-1 items-center shrink-0">
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
  );
}
