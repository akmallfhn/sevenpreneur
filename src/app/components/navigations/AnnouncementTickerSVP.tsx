"use client";
import Link from "next/link";

interface AnnouncementTickerSVPProps {
  tickerText: string;
  tickerAction?: string;
}

export default function AnnouncementTickerSVP({
  tickerText,
  tickerAction,
}: AnnouncementTickerSVPProps) {
  const tickerData = {
    text: tickerText,
    action: tickerAction,
  };
  const tickerMessages = Array(8).fill(tickerData);
  const loopedMessages = [...tickerMessages, ...tickerMessages];

  return (
    <Link
      href="/cohorts/sevenpreneur-business-blueprint-program#package-plans"
      className="announcement-ticker relative w-full h-10 bg-[#DEEBFF] flex items-center overflow-hidden dark:bg-[#09003E]"
    >
      <div className="announcement-track flex gap-5 text-sm font-brand font-[350px] whitespace-nowrap z-10">
        {loopedMessages.map((post, index) => (
          <div
            key={index}
            className="announcement-item flex gap-2 items-center"
          >
            <p>{post.text}</p>
            {post.action && (
              <p className="py-[3px] px-2 text-[13px] border border-black rounded-full dark:border-white">
                {post.action}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Absolute Animation */}
      <div className="announcement-background absolute flex top-1/2 -translate-y-1/2 size-[220px] bg-[#FFC6D7] rounded-full blur-3xl dark:bg-[#520050] lg:size-[620px]" />

      {/* CSS-in-JS */}
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .announcement-track {
          display: inline-flex;
          animation: ticker 72s linear infinite;
        }
        @keyframes pingpong {
          0% {
            transform: translateX(-30%);
          }
          100% {
            transform: translateX(140%);
          }
        }
        .announcement-background {
          animation: pingpong 10s ease-in-out infinite alternate;
          will-change: transform;
        }

        .announcement-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Link>
  );
}
