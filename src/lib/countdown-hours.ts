import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

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
