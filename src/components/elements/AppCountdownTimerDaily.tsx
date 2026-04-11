"use client";
import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface AppCountdownTimerDailyProps {
  targetDateTime: string;
}

export default function AppCountdownTimerDaily(
  props: AppCountdownTimerDailyProps
) {
  const calculateCountdown = (targetDateTime: string) => {
    const now = dayjs();
    const finalTargetDate = dayjs(targetDateTime);

    if (now.isAfter(finalTargetDate)) {
      return { hours: "00", minutes: "00", seconds: "00" };
    }

    const endOfDay = now.endOf("day");
    const diff = endOfDay.diff(now);
    const dur = dayjs.duration(diff);

    return {
      hours: String(Math.floor(dur.asHours())).padStart(2, "0"),
      minutes: String(dur.minutes()).padStart(2, "0"),
      seconds: String(dur.seconds()).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(() =>
    calculateCountdown(props.targetDateTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateCountdown(props.targetDateTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [props.targetDateTime]);

  const countdownData = [
    { value: timeLeft.hours, dimensions: "hours" },
    { value: timeLeft.minutes, dimensions: "minutes" },
    { value: timeLeft.seconds, dimensions: "seconds" },
  ];

  return (
    <div className={`countdown flex text-white items-center gap-1.5`}>
      {countdownData.map((post, index) => (
        <React.Fragment key={index}>
          <div
            className={`countdown-container flex flex-col items-center gap-1`}
          >
            <p
              className={`countdown-value flex items-center justify-center aspect-square font-brand font-bold bg-secondary text-base rounded-[3px] p-0.5`}
            >
              {post.value}
            </p>
          </div>
          {index < countdownData.length - 1 && (
            <p
              className={`countdown-separator font-bodycopy font-bold text-white "text-sm"`}
            >
              :
            </p>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
