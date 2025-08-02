import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function getRoundedHourFromSeconds(seconds: number): number {
  const dur = dayjs.duration(seconds, "seconds");
  const totalHours = dur.asHours();
  return Math.ceil(totalHours);
}
