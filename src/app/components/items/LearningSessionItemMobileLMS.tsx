"use client";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { SessionMethod } from "@/lib/app-types";
import Link from "next/link";
import dayjs from "dayjs";

export interface LearningSessionItemMobileLMSProps {
  cohortId: number;
  learningSessionId: number;
  learningSessionName: string;
  learningSessionMethod: SessionMethod;
  learningSessionEducatorName: string;
  learningSessionEducatorAvatar: string;
  learningSessionDate: string;
}

export default function LearningSessionItemMobileLMS(
  props: LearningSessionItemMobileLMSProps
) {
  return (
    <Link
      href={`/cohorts/${props.cohortId}/learnings/${props.learningSessionId}`}
      className="session-box flex w-full bg-white p-3 items-center gap-3 justify-between font-bodycopy rounded-md border border-outline transform transition hover:cursor-pointer active:scale-95 hover:bg-[#EDF0F6]"
    >
      <div className="session-container flex items-center gap-4">
        <div className="session-metadata flex items-center gap-3">
          <div className="session-educator-avatar aspect-square size-9 shrink-0 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={props.learningSessionEducatorAvatar}
              alt={props.learningSessionEducatorName}
              width={600}
              height={600}
            />
          </div>
          <div className="session-title flex flex-col">
            <h2 className="session-title text-[15px] font-bold line-clamp-1">
              {props.learningSessionName}
            </h2>
            <p className="session-educator font-medium text-sm text-[#333333]">
              {dayjs(props.learningSessionDate).format("ddd[,] D MMM YYYY")}
            </p>
          </div>
        </div>
      </div>
      <ChevronRight className="size-6 text-alternative shrink-0" />
    </Link>
  );
}
