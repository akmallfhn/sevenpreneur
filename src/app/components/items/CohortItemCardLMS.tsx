"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);

interface CohortItemCardLMSProps {
  cohortId?: number;
  cohortName?: string;
  cohortImage?: string;
  cohortStartDate?: string;
  cohortEndDate?: string;
}

export default function CohortItemCardLMS({
  cohortId,
  cohortName,
  cohortImage,
  cohortStartDate,
  cohortEndDate,
}: CohortItemCardLMSProps) {
  return (
    <React.Fragment>
      <div className="card-container relative">
        <Link
          href={`/cohorts/${32}`}
          className="flex flex-col w-full bg-white shadow-md rounded-md overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="image-thumbnail flex w-full aspect-thumbnail overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/session-zaki-angga%20(1).webp"
              }
              alt="thumbnail"
              width={500}
              height={500}
            />
          </div>
          {/* Metadata */}
          <div className="metadata relative flex flex-col p-3 gap-2 h-[112px]">
            <h3 className="cohort-title text-base font-bodycopy font-bold line-clamp-2">
              {"Sevenpreneur Business Blueprint Program"}
            </h3>
            <div className="cohort-timeline flex gap-2 items-center text-alternative">
              <FontAwesomeIcon icon={faCalendar} className="size-3" />
              <div className="flex font-bodycopy font-medium text-sm items-center gap-1">
                <span>{dayjs(cohortStartDate).format("ll")}</span> -{" "}
                <span>{dayjs(cohortEndDate).format("ll")}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </React.Fragment>
  );
}
