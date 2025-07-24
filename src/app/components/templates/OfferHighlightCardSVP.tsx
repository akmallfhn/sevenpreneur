"use client";
import {
  Atom,
  BookUser,
  Layout,
  LayoutDashboard,
  MessageCircleMore,
  Puzzle,
  Sprout,
  TvMinimalPlay,
} from "lucide-react";

export default function OfferHighlightCardSVP() {
  return (
    <div className="benefit-offer-container flex flex-col gap-5 p-5 m-5 bg-[#FDFBFB] border border-outline rounded-md lg:max-w-[620px] lg:mx-auto">
      <div className="section-title-cohort flex flex-col font-bold font-ui gap-0.5">
        <p className="text-secondary">BENEFIT</p>
        <h2 className="text-black text-2xl">Why you’ll love this program</h2>
      </div>
      <div className="benefit-offer-list flex flex-col gap-3">
        <div className="benefit-offer-item flex gap-2 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center overflow-hidden">
            <Puzzle className="size-6 text-alternative" />
          </div>
          <p className="text-sm">
            <b>7 proven modules</b> to guide you from zero to scalable business
          </p>
        </div>

        <div className="benefit-offer-item flex gap-2 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center overflow-hidden">
            <Atom className="size-6 text-alternative" />
          </div>
          <p className="text-sm">
            <b>Interactive learning</b>, not just passive watching
          </p>
        </div>

        <div className="benefit-offer-item flex gap-2 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center overflow-hidden">
            <BookUser className="size-6 text-alternative" />
          </div>
          <p className="text-sm">
            <b>Guest speaker & alumni sessions</b> to inspire and share real
            stories
          </p>
        </div>

        <div className="benefit-offer-item flex gap-2 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center overflow-hidden">
            <MessageCircleMore className="size-6 text-alternative" />
          </div>
          <p className="text-sm">
            <b>Real-time feedback</b> from mentors to keep you on track
          </p>
        </div>

        <div className="benefit-offer-item flex gap-2 items-center font-ui">
          <div className="flex w-8 h-8 items-center overflow-hidden">
            <Sprout className="size-6 text-alternative" />
          </div>
          <p className="text-sm">
            Opportunity to <b>receive seed funding</b>
          </p>
        </div>

        <div className="benefit-offer-item flex gap-2 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center overflow-hidden">
            <LayoutDashboard className="size-6 text-alternative" />
          </div>
          <p className="text-sm">
            <b>LMS dashboard access</b> to organized learning materials
          </p>
        </div>

        <div className="benefit-offer-item flex gap-2 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center overflow-hidden">
            <TvMinimalPlay className="size-6 text-alternative" />
          </div>
          <p className="text-sm">
            <b>Session recordings</b> for anytime replays
          </p>
        </div>
      </div>
    </div>
  );
}
