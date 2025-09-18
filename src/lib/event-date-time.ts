"use client";

import dayjs from "dayjs";
import "dayjs/locale/id"; // biar bulan jadi bahasa Indonesia kalau perlu
dayjs.locale("id");

interface FormatEventDateTimeProps {
  startDate: string;
  endDate: string;
}

export function formatEventDateTime({
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
