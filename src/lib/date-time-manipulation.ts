import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";

dayjs.locale("id");
dayjs.extend(duration);
dayjs.extend(relativeTime);

export function getDurationFromSeconds(seconds: number): string {
  const dur = dayjs.duration(seconds, "seconds");
  const hours = dur.hours().toString().padStart(2, "0");
  const minutes = dur.minutes().toString().padStart(2, "0");
  const secs = dur.seconds().toString().padStart(2, "0");

  if (dur.asHours() >= 1) {
    return `${hours}:${minutes}:${secs}`;
  } else {
    return `${minutes}:${secs}`;
  }
}

export function useCountdownHours(
  targetDateTime: string | dayjs.Dayjs
): string {
  const [countdown, setCountdown] = useState("00:00:00");

  useEffect(() => {
    const calculate = () => {
      const now = dayjs();
      const target = dayjs(targetDateTime);
      const diff = target.diff(now);

      if (diff <= 0) return "00:00:00";

      const dur = dayjs.duration(diff);
      const totalHours = Math.floor(dur.asHours());
      const minutes = dur.minutes();
      const seconds = dur.seconds();

      const hh = String(totalHours).padStart(2, "0");
      const mm = String(minutes).padStart(2, "0");
      const ss = String(seconds).padStart(2, "0");

      return `${hh}:${mm}:${ss}`;
    };

    setCountdown(calculate());
    const interval = setInterval(() => {
      setCountdown(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime]);

  return countdown;
}

export function getRoundedHourFromSeconds(seconds: number): number {
  const dur = dayjs.duration(seconds, "seconds");
  const totalHours = dur.asHours();
  return Math.ceil(totalHours);
}

interface FormatEventDateTimeProps {
  startDate: string;
  endDate: string;
}
export function getDateTimeRange({
  startDate,
  endDate,
}: FormatEventDateTimeProps) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  let dateString = "";

  if (start.isSame(end, "day")) {
    // 13 Sep 2025
    dateString = start.format("D MMM YYYY");
  } else if (start.isSame(end, "month")) {
    // 13 - 14 Sep 2025
    dateString = `${start.format("D")} - ${end.format("D MMM YYYY")}`;
  } else if (start.isSame(end, "year")) {
    // 13 Mei - 14 Sep 2025
    dateString = `${start.format("D MMM")} - ${end.format("D MMM YYYY")}`;
  } else {
    // 13 Dec 2025 - 1 Jan 2026
    dateString = `${start.format("D MMM YYYY")} - ${end.format("D MMM YYYY")}`;
  }

  // Time selalu "19.00 - 13.00" berdasarkan start & end
  const timeString = `${start.format("HH.mm")} - ${end.format("HH.mm")}`;

  return { dateString, timeString };
}

export function getSubmissionTiming(
  submittedDate?: string,
  deadlineDate?: string
) {
  const submittedAt = dayjs(submittedDate);
  const deadlineAt = dayjs(deadlineDate);

  if (!submittedDate || !deadlineDate) {
    return { isEarly: false, formatted: "", shortMessage: "Invalid date" };
  }

  const differentMilisecond = submittedAt.diff(dayjs(deadlineAt));
  const isEarly = differentMilisecond < 0;
  const absoluteDiff = Math.abs(differentMilisecond);
  const d = dayjs.duration(absoluteDiff);

  // Time Calculations
  const days = Math.floor(d.asDays());
  const hours = d.hours();
  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);

  const timeFormatted = parts.join(" ");
  const timeDuration = timeFormatted || "less than an hour";
  const shortMessage = `${timeDuration} ${isEarly ? "early" : "late"}`;
  const longMessage = `Assignment was submitted ${timeDuration} ${
    isEarly ? "early" : "late"
  }`;

  return {
    isEarly,
    shortMessage,
    longMessage,
  };
}
