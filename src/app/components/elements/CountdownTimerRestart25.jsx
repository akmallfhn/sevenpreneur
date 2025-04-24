"use client"
import React from "react"
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import CountdownValueWrapper from "./CountdownValueWrapper"

dayjs.extend(duration)

export default function CountdownTimerRestart25() {
    const [hasMounted, setHasMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" })

    useEffect(() => {
        setHasMounted(true)
        // Define tanggal di masa depan
        const targetDate = dayjs("2025-07-27T00:00:00")

        // Fungsi untuk hitung waktu tersisa:
        const calculateCountdown = () => {
            const now = dayjs() // ambil waktu saat ini
            const diff = targetDate.diff(now) // hitung selisih waktu (dalam milidetik)
            const dur = dayjs.duration(diff) // ubah jadi format waktu: hari, jam, menit, detik

            const days = Math.floor(dur.asDays()) // total semua hari
            const hours = dur.hours() // jam sisa setelah hari dihitung
            const minutes = dur.minutes() // menit sisa setelah jam dihitung
            const seconds = dur.seconds() // detik sisa setelah menit dihitung

            return { 
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0")
            }
        }

        const interval = setInterval(() => {
          setTimeLeft(calculateCountdown())
        }, 1000)
    
        return () => clearInterval(interval)
    }, [])

    if (!hasMounted) return null

    const countdownData = [
        { value: timeLeft.days, dimensions: "days" },
        { value: timeLeft.hours, dimensions: "hours" },
        { value: timeLeft.minutes, dimensions: "minutes" },
        { value: timeLeft.seconds, dimensions: "seconds" },
    ]

    return(
        <div className="flex text-white items-center gap-2">
            {countdownData.map((post, index) => (
                <React.Fragment key={index}>                    
                    <CountdownValueWrapper
                    value={post.value}
                    dimensions={post.dimensions}
                    />
                    {index < countdownData.length - 1 && <p className="font-bodycopy text-sm">/</p>}
                </React.Fragment>
            ))}

        </div>
    )
}