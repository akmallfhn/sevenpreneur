"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical } from "lucide-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import Stack from "@mui/material/Stack";
import { Gauge } from "@mui/x-charts/Gauge";

dayjs.extend(localizedFormat);

interface ProjectItemCMSProps {
  projectName: string;
  lastSubmission: string;
}

export default function ProjectItemCMS({
  projectName,
  lastSubmission,
}: ProjectItemCMSProps) {
  return (
    <div className="module-item flex items-center justify-between bg-white gap-2 p-1 rounded-md">
      <div className="flex items-center w-[calc(87%)]">
        <div className="icon relative aspect-square flex size-20 p-3 items-center">
          <Gauge width={200} height={200} value={(30 / 48) * 100} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-black bg-white font-bodycopy">
              {((70 / 100) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="attribute-data flex flex-col">
          <h3 className="font-bodycopy font-semibold text-black text-[15px] line-clamp-1">
            {projectName}
          </h3>
          <p className="font-bodycopy font-medium text-alternative text-[13px]">
            Last submission: {dayjs(lastSubmission).format("D MMM YYYY HH.mm")}
          </p>
        </div>
      </div>
      <AppButton variant="ghost" size="small">
        <EllipsisVertical className="size-4" />
      </AppButton>
    </div>
  );
}
