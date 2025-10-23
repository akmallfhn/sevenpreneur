"use client";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectItemLMSProps {
  cohortId: number;
  projectId: number;
  projectName: string;
  projectDeadline: string;
}

export default function ProjectItemLMS({
  cohortId,
  projectId,
  projectName,
  projectDeadline,
}: ProjectItemLMSProps) {
  return (
    <Link
      href={`/cohorts/${cohortId}/projects/${projectId}`}
      className="project-box flex items-center justify-between p-4 bg-section-background rounded-lg transform transition hover:bg-[#EDF0F6]"
    >
      <div className="project-container flex items-center gap-3">
        <div className="project-icon size-12 rounded-md shrink-0 overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/project-icon.svg"
            alt={projectName}
            width={80}
            height={80}
          />
        </div>
        <div className="project-attributes flex flex-col gap-1.5 font-bodycopy leading-snug">
          <p className="text-[15px] text-black font-semibold line-clamp-1">
            {projectName}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-fit text-xs text-[#42359B] bg-[#E0DAFF] font-bodycopy font-semibold px-2 py-0.5 rounded-full">
              SUBMITTED
            </span>
            <p className="project-deadline text-sm text-alternative font-medium">
              Must be submitted before{" "}
              <span className="font-semibold text-danger-foreground">
                {dayjs(projectDeadline).format("DD MMM YYYY [at] HH:mm")} WIB
              </span>
            </p>
          </div>
        </div>
      </div>
      <ChevronRight className="size-7 text-alternative" />
    </Link>
  );
}
