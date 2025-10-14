"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/en";
import { getDateTimeRange } from "@/lib/date-time-manipulation";
import { ScheduleStatus } from "@/lib/app-types";

dayjs.extend(localizedFormat);
dayjs.extend(isBetween);

interface CohortItemCardLMSProps {
  cohortId: number;
  cohortName: string;
  cohortImage: string;
  cohortStartDate: string;
  cohortEndDate: string;
}

export default function CohortItemCardLMS({
  cohortId,
  cohortName,
  cohortImage,
  cohortStartDate,
  cohortEndDate,
}: CohortItemCardLMSProps) {
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus | null>(
    null
  );

  const { dateString } = getDateTimeRange({
    startDate: cohortStartDate,
    endDate: cohortEndDate,
  });

  useEffect(() => {
    if (dayjs().isBefore(cohortStartDate)) {
      setScheduleStatus("UPCOMING");
    } else if (dayjs().isBetween(cohortStartDate, cohortEndDate, null, "[]")) {
      setScheduleStatus("ON GOING");
    } else if (dayjs().isAfter(cohortEndDate)) {
      setScheduleStatus("FINISHED");
    }
  }, [cohortStartDate, cohortEndDate]);

  return (
    <React.Fragment>
      <Link
        href={`/cohorts/${cohortId}`}
        className="card-container flex flex-col w-full p-3 gap-2 bg-white border border-outline/40 rounded-lg overflow-hidden transition transform active:scale-95"
      >
        <div className="cohort-image relative flex w-full aspect-thumbnail rounded-md overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={cohortImage}
            alt="cohort-image"
            width={500}
            height={500}
          />
          <p className="cohort-schedule-status absolute flex w-fit px-2 py-0.5 top-2 right-2 bg-[#DAF2F0] text-[#419B91] text-[10px] font-bodycopy font-semibold rounded-full">
            {scheduleStatus}
          </p>
        </div>
        <div className="metadata relative flex flex-col gap-2 h-[112px]">
          <h3 className="cohort-title text-base font-bodycopy font-bold line-clamp-2 xl:text-lg">
            {cohortName}
          </h3>
          <p className="cohort-sessions flex w-fit px-2 py-1 bg-primary-light/50 text-primary text-xs font-bodycopy font-semibold rounded-full">
            10-13 sessions
          </p>
          <div className="cohort-timeline flex gap-1.5 items-center text-alternative">
            <FontAwesomeIcon icon={faCalendar} size="xs" />
            <div className="flex font-bodycopy font-medium text-[13px] items-center gap-1">
              {dateString}
            </div>
          </div>
        </div>
      </Link>
    </React.Fragment>
  );
}
