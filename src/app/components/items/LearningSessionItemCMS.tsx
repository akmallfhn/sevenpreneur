"use client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import { toCamelCase } from "@/lib/camel-case";
import { ChevronRight, Video } from "lucide-react";
import AppButton from "../buttons/AppButton";
import LearningSessionIconLabelCMS, {
  learningSessionVariant,
} from "../labels/LearningSessionIconLabelCMS";

dayjs.extend(localizedFormat);

interface LearningSessionItemCMSProps {
  cohortId: number;
  sessionLearningId: number;
  sessionName: string;
  sessionEducatorName?: string;
  sessionEducatorAvatar?: string | null;
  sessionMethod: string;
  sessionDate: string;
  sessionMeetingURL?: string | null;
}

export default function LearningSessionItemCMS({
  cohortId,
  sessionLearningId,
  sessionName,
  sessionEducatorName,
  sessionEducatorAvatar,
  sessionMethod,
  sessionDate,
  sessionMeetingURL,
}: LearningSessionItemCMSProps) {
  return (
    <Link href={`/cohorts/${cohortId}/learnings/${sessionLearningId}`}>
      <div className="session-item flex items-center justify-between bg-white gap-2 p-3 rounded-md">
        <div className="flex w-[calc(87%)] gap-3 items-center">
          <LearningSessionIconLabelCMS
            variants={sessionMethod as learningSessionVariant}
          />
          <div className="attribute-data flex flex-col gap-2.5">
            <div className="flex flex-col gap-0.5">
              <h3 className="session-name font-bodycopy font-bold line-clamp-1 ">
                {sessionName}
              </h3>
              <div className="flex gap-3 items-center">
                <div className="session-educator flex gap-2 items-center">
                  <div className="avatar size-[29px] rounded-full overflow-hidden">
                    <Image
                      className="object-cover w-full h-full"
                      src={
                        sessionEducatorAvatar ??
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                      }
                      alt="Avatar User"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex flex-col text-[13px] leading-snug font-bodycopy font-medium text-black/50">
                    <p className="educator-name">
                      by{" "}
                      <span className="text-black font-semibold">
                        {sessionEducatorName || "Sevenpreneur Team"}
                      </span>
                    </p>
                    <p className="date-time">
                      {dayjs(sessionDate).format("llll")}
                    </p>
                  </div>
                </div>
                {sessionMethod !== "ONSITE" && sessionMeetingURL && (
                  <a
                    href={sessionMeetingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AppButton variant="outline" size="small" type="button">
                      <Video className="size-4" />
                      Launch meeting
                    </AppButton>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <ChevronRight className="size-6 text-alternative" />
      </div>
    </Link>
  );
}
