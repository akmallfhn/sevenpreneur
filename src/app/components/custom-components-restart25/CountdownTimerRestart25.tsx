"use client";
import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export type SizeCountdownVariant = "default" | "extra_small";

const variantStyles: Record<
  SizeCountdownVariant,
  {
    countDownColor: string;
    countDownSize: string;
    countDownOutline: string;
  }
> = {
  default: {
    countDownColor: "bg-[#212121] lg:bg-[#4332B1]",
    countDownSize: "w-10 text-[22px] rounded-sm ",
    countDownOutline:
      "p-[1px] bg-gradient-to-r from-0% from-[#979595] via-50% via-[#484848] to-100% to-[#979595] rounded-sm ",
  },
  extra_small: {
    countDownColor: "bg-secondary",
    countDownSize: "w-5 text-xs rounded-[3px]",
    countDownOutline: "rounded-[3px]",
  },
};

interface CountdownTimerRestart25Props {
  targetDateTime: string;
  isIncludeDimension?: boolean;
  variant?: SizeCountdownVariant;
}

export default function CountdownTimerRestart25({
  targetDateTime,
  isIncludeDimension = true,
  variant = "default",
}: CountdownTimerRestart25Props) {
  const { countDownColor, countDownSize, countDownOutline } =
    variantStyles[variant];

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    // Define tanggal di masa depan
    const targetDate = dayjs(targetDateTime);

    // Fungsi untuk hitung waktu tersisa:
    const calculateCountdown = () => {
      const now = dayjs(); // ambil waktu saat ini
      const diff = targetDate.diff(now); // hitung selisih waktu (dalam milidetik)

      // ✅ Kalau sudah lewat dari target, kembalikan semua ke nol
      if (diff <= 0) {
        return {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        };
      }

      const dur = dayjs.duration(diff); // ubah jadi format waktu: hari, jam, menit, detik
      const days = Math.floor(dur.asDays()); // total semua hari
      const hours = dur.hours(); // jam sisa setelah hari dihitung
      const minutes = dur.minutes(); // menit sisa setelah jam dihitung
      const seconds = dur.seconds(); // detik sisa setelah menit dihitung
      return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    };

    const interval = setInterval(() => {
      setTimeLeft(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime]);

  const countdownData = [
    { value: timeLeft.days, dimensions: "days" },
    { value: timeLeft.hours, dimensions: "hours" },
    { value: timeLeft.minutes, dimensions: "minutes" },
    { value: timeLeft.seconds, dimensions: "seconds" },
  ];

  return (
    <div
      className={`flex text-white items-center ${
        variant === "default" ? "gap-2 lg:gap-3" : "gap-[2px]"
      }`}
    >
      {countdownData.map((post, index) => (
        <React.Fragment key={index}>
          <div className={`container flex flex-col items-center gap-1`}>
            <div className={`border-countdown ${countDownOutline}`}>
              <p
                className={`value flex items-center justify-center aspect-square font-brand font-bold ${countDownColor} ${countDownSize}`}
              >
                {post.value}
              </p>
            </div>
            {isIncludeDimension && variant !== "extra_small" && (
              <p className="font-bodycopy text-sm lg:text-sm">
                {post.dimensions}
              </p>
            )}
          </div>
          {index < countdownData.length - 1 && (
            <p
              className={`font-bodycopy font-bold ${
                variant === "default"
                  ? "text-white text-sm lg:text-base"
                  : "text-secondary text-sm"
              }`}
            >
              :
            </p>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
