"use client";
import Image from "next/image";
import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusLabelCMS from "./StatusLabelCMS";
import AppButton from "./AppButton";
import { EllipsisVertical } from "lucide-react";

export default function CohortItemCardCMS() {
  return (
    <div className="based flex flex-col max-w-[252px] bg-white border border-outline rounded-md overflow-hidden">
      {/* --- Thumbnail */}
      <div className="image-thumbnail relative aspect-thumbnail overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={
            "https://static.wixstatic.com/media/02a5b1_75a55654d4b445da8c4500b84f0cb7a2~mv2.webp"
          }
          alt="thumbnail"
          width={500}
          height={500}
        />
        <div className="absolute top-2 left-2">
          <StatusLabelCMS labelName="ON SCHEDULE" variants="ACTIVE" />
        </div>
      </div>
      {/* --- Metadata */}
      <div className="metadata relative flex flex-col p-3 gap-2">
        <h3 className="cohort-title text-base font-bodycopy font-bold line-clamp-2">
          Kelas Memancing Ikan Pada Hari Jumat Sabtu Minggu Negara
        </h3>
        <div className="cohort-participant flex gap-2 items-center text-alternative">
          <FontAwesomeIcon icon={faUser} className="size-3" />
          <p className="font-bodycopy font-medium text-sm">
            1,934 people joined
          </p>
        </div>
        <div className="cohort-timeline flex gap-2 items-center text-alternative">
          <FontAwesomeIcon icon={faCalendar} className="size-3  " />
          <p className="font-bodycopy font-medium text-sm">
            15 Jun - 16 Jun 2025
          </p>
        </div>
        <div className="absolute bottom-1 right-0">
          <AppButton variant="ghost" size="small">
            <EllipsisVertical className="size-4" />
          </AppButton>
        </div>
      </div>
    </div>
  );
}
