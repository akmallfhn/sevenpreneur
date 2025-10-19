"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { ChevronRight } from "lucide-react";
import { SessionMethod } from "@/lib/app-types";
import Link from "next/link";
import dayjs from "dayjs";

export interface LearningSessionItemLMSProps {
  cohortId: number;
  learningSessionId: number;
  learningSessionName: string;
  learningSessionMethod: SessionMethod;
  learningSessionEducatorName: string;
  learningSessionEducatorAvatar: string;
  learningSessionDate: string;
  learningSessionPlace?: string;
}

export default function LearningSessionItemLMS({
  cohortId,
  learningSessionId,
  learningSessionName,
  learningSessionMethod,
  learningSessionEducatorAvatar,
  learningSessionEducatorName,
  learningSessionDate,
  learningSessionPlace,
}: LearningSessionItemLMSProps) {
  let learningLocation;
  if (learningSessionMethod === "ONLINE") {
    learningLocation = "Online";
  } else if (learningSessionPlace) {
    learningLocation = learningSessionPlace;
  }

  return (
    <Link
      href={`/cohorts/${cohortId}/learnings/${learningSessionId}`}
      className="session-box flex w-full bg-section-background p-3.5 items-center justify-between font-bodycopy rounded-md  transform transition hover:cursor-pointer active:scale-95 hover:bg-[#EDF0F6]"
    >
      <div className="session-container flex items-center gap-4">
        <div className="session-date flex flex-col items-center aspect-square w-14">
          <p className="session-day font-medium text-sm">
            {dayjs(learningSessionDate).format("ddd")}
          </p>
          <p className="session-date font-brand font-semibold text-3xl">
            {dayjs(learningSessionDate).format("D")}
          </p>
        </div>
        <div className="divider w-[1px] self-stretch bg-outline" />
        <div className="session-schedule flex flex-col text-sm gap-1 font-medium text-[#333333] shrink-0">
          <div className="session-time flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-alternative" />
            <p>{dayjs(learningSessionDate).format("HH:mm")}</p>
          </div>
          <div className="session-place flex items-center gap-2">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-alternative"
            />
            <p>{learningLocation}</p>
          </div>
        </div>
        <div className="divider w-[1px] self-stretch bg-outline" />
        <div className="session-metadata flex items-center gap-3">
          <div className="session-educator-avatar aspect-square size-9 shrink-0 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={learningSessionEducatorAvatar}
              alt={learningSessionEducatorName}
              width={600}
              height={600}
            />
          </div>
          <div className="session-title flex flex-col">
            <h2 className="session-title text-[15px] font-bold line-clamp-1">
              {learningSessionName}
            </h2>
            <p className="session-educator font-medium text-sm text-[#333333]">
              {learningSessionEducatorName}
            </p>
          </div>
        </div>
      </div>
      <ChevronRight className="size-7 text-alternative" />
    </Link>
  );
}
