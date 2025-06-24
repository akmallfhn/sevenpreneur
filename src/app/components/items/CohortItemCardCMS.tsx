"use client";
import Image from "next/image";
import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical, MoveRight } from "lucide-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import Link from "next/link";

dayjs.extend(localizedFormat);

interface CohortItemCardCMSProps {
  cohortId: number;
  cohortName: string;
  cohortImage: string;
  cohortStartDate: string;
  cohortEndDate: string;
}

export default function CohortItemCardCMS({
  cohortId,
  cohortName,
  cohortImage,
  cohortStartDate,
  cohortEndDate,
}: CohortItemCardCMSProps) {
  // --- Generate schedule status
  const dateNow = dayjs();
  let scheduleStatus = "Live Now";
  if (dateNow.isBefore(dayjs(cohortStartDate))) {
    scheduleStatus = "Upcoming Schedule";
  } else if (dateNow.isAfter(dayjs(cohortEndDate))) {
    scheduleStatus = "Completed";
  }

  return (
    <Link href={`/cohorts/${cohortId}`}>
      <div className="based flex flex-col max-w-[252px] bg-white shadow-md rounded-md overflow-hidden">
        {/* --- Thumbnail */}
        <div className="image-thumbnail relative aspect-thumbnail overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={cohortImage}
            alt="thumbnail"
            width={500}
            height={500}
          />
          {/* <div className="absolute top-2 left-2">
            <StatusLabelCMS labelName={scheduleStatus} variants="ACTIVE" />
          </div> */}
          <div className="absolute top-2 right-2">
            <AppButton variant="ghost" size="small">
              <EllipsisVertical className="size-4" />
            </AppButton>
          </div>
        </div>
        {/* --- Metadata */}
        <div className="metadata relative flex flex-col p-3 gap-2 h-[132px]">
          <h3 className="cohort-title text-base font-bodycopy font-bold line-clamp-2">
            {cohortName}
          </h3>
          <div className="cohort-participant flex gap-2 items-center text-alternative">
            <FontAwesomeIcon icon={faUser} className="size-3" />
            <p className="font-bodycopy font-medium text-sm">
              1,934 students joined
            </p>
          </div>
          <div className="cohort-timeline flex gap-2 items-center text-alternative">
            <FontAwesomeIcon icon={faCalendar} className="size-3" />
            <div className="flex font-bodycopy font-medium text-sm items-center gap-1">
              <span>{dayjs(cohortStartDate).format("ll")}</span> -{" "}
              <span>{dayjs(cohortEndDate).format("ll")}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
