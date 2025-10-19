"use client";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectItemLMSProps {
  cohortId: number;
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectDeadline: string;
}

export default function ProjectItemLMS({
  cohortId,
  projectId,
  projectName,
  projectDescription,
  projectDeadline,
}: ProjectItemLMSProps) {
  return (
    <Link
      href={`/cohorts/${cohortId}/projects/${projectId}`}
      className="project-box flex items-center justify-between p-4 bg-section-background rounded-lg transform transition hover:bg-[#EDF0F6]"
    >
      <div className="project-container flex items-center gap-3">
        <div className="project-icon size-10 shrink-0 overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/customer-service-icon.svg"
            alt={projectName}
            width={80}
            height={80}
          />
        </div>
        <div className="project-attributes flex flex-col font-bodycopy leading-snug">
          <div className="project-name flex gap-2 items-center">
            <p className="text-[15px] text-black font-semibold line-clamp-1">
              {projectName}
            </p>
            <span className="text-xs text-success-foreground bg-success-background font-bodycopy font-semibold px-2 py-[1px] rounded-full">
              SUBMITTED
            </span>
          </div>
          {/* <p className="project-description text-sm text-alternative font-medium line-clamp-2">
          {projectDescription}
        </p> */}
          <p className="project-deadline text-sm text-danger-foreground font-medium">
            Must be submitted before{" "}
            <span className="font-semibold">
              {dayjs(projectDeadline).format("DD MMM YYYY [at] HH:mm")} WIB
            </span>
          </p>
        </div>
      </div>
      <ChevronRight className="size-7 text-alternative" />
    </Link>
  );
}
