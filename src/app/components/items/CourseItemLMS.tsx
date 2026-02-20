"use client";
import {
  formatDurationFromSeconds,
  getDateTimeRange,
} from "@/lib/date-time-manipulation";
import { faCalendar, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

interface CourseItemLMSProps {
  courseId: number;
  courseName: string;
  courseCategory: "COHORT" | "PLAYLIST";
  courseSlugCategory: string;
  courseImage: string;
  courseItems: number;
  cohortStartDate: string | null;
  cohortEndDate: string | null;
  playlistDuration: number | null;
}

export default function CourseItemLMS(props: CourseItemLMSProps) {
  const { dateString } = getDateTimeRange({
    startDate: props.cohortStartDate || "",
    endDate: props.cohortEndDate || "",
  });

  return (
    <Link
      href={`/${props.courseSlugCategory}/${props.courseId}`}
      className="course-container flex flex-col w-full rounded-lg overflow-hidden transition transform active:scale-95"
    >
      <div className="course-image relative flex w-full aspect-video overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={props.courseImage}
          alt={props.courseImage}
          width={600}
          height={600}
        />
        <div className="overlay absolute inset-0 bg-gradient-to-t from-10% from-surface-black to-80% to-surface-black/0 z-10" />
        {props.courseCategory === "PLAYLIST" && (
          <FontAwesomeIcon
            className="play-button absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 aspect-square p-4 bg-white/10 backdrop-blur-xs border border-white/[0.08] rounded-full z-20"
            icon={faPlay}
            size="xl"
            color="#FFFFFF"
          />
        )}
        <div className="course-category absolute flex top-3 right-3 w-fit px-2 py-1 items-center gap-1 bg-success-background text-success-foreground text-xs font-bodycopy font-semibold rounded-full z-20">
          {props.courseCategory === "COHORT" ? "Bootcamp" : "Video Series"}
        </div>
      </div>
      <div className="metadata relative flex flex-col gap-2 h-[112px] bg-surface-black px-4">
        <div className="flex flex-col gap-2">
          <h3 className="course-name text-white font-bodycopy font-bold leading-snug line-clamp-2 lg:text-base xl:text-lg">
            {props.courseName}
          </h3>
          <div className="course-attributes flex gap-2">
            <p className="course-category flex w-fit px-2.5 py-1 bg-white/15 text-word-black text-xs font-bodycopy font-semibold rounded-full">
              {props.courseItems}{" "}
              {props.courseCategory === "COHORT" ? "Sessions" : "Episodes"}
            </p>
            {props.courseCategory === "COHORT" && (
              <div className="cohort-date flex w-fit items-center gap-1 px-2.5 py-1 bg-white/15 text-word-black text-xs font-bodycopy font-semibold rounded-full">
                <FontAwesomeIcon icon={faCalendar} size="sm" />
                <p>{dateString}</p>
              </div>
            )}
            {props.courseCategory === "PLAYLIST" &&
              !!props.playlistDuration && (
                <div className="playlist-duration flex w-fit items-center gap-1 px-2.5 py-1 bg-white/15 text-word-black text-xs font-bodycopy font-semibold rounded-full">
                  <FontAwesomeIcon icon={faPlay} size="sm" />
                  <p>{formatDurationFromSeconds(props.playlistDuration)}</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </Link>
  );
}
