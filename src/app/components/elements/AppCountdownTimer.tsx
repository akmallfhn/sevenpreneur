"use client";
import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface AppCountdownTimerProps {
  targetDateTime: string;
  isIncludeDimension?: boolean;
}

export default function AppCountdownTimer({
  targetDateTime,
  isIncludeDimension = false,
}: AppCountdownTimerProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    setHasMounted(true);
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

  if (!hasMounted) return null;

  const countdownData = [
    { value: timeLeft.days, dimensions: "days" },
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
            {/* {isIncludeDimension && variant !== "extra_small" && (
              <p className="font-bodycopy text-sm lg:text-sm">
                {post.dimensions}
              </p>
            )} */}
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
