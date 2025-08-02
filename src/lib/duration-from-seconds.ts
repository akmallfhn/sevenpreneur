import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function durationFromSeconds(seconds: number): string {
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
