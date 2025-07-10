"use client";
import Image from "next/image";
import SectionTitleRestart25 from "../titles/SectionTitleRestart25";
import ScorecardRestart25 from "../items/ScorecardRestart25";

export default function ContentEventRestart25() {
  return (
    <section id="content-event">
      <div className="content-event-root relative bg-black flex justify-center overflow-hidden">
        <div className="container flex flex-col py-8 px-8 gap-9 items-center z-20 lg:pt-24 lg:pb-[60px] lg:gap-[60px]">
          {/* Embed Youtube */}
          <section id="teaser">
            <div className="p-[1px] rounded-md bg-gradient-to-r from-0% from-[#727272] via-50% via-[#333333] to-100% to-[#727272]">
              <div className="bg-black p-3 rounded-md lg:hidden">
                <iframe
                  width="315"
                  height="180"
                  src="https://www.youtube.com/embed/GsLjwsu9Jus?si=j2bVzojiiYmE0ltu&amp;controls=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="bg-black hidden p-3 rounded-md lg:flex lg:p-4">
                <iframe
                  width="780"
                  height="478"
                  src="https://www.youtube.com/embed/GsLjwsu9Jus?si=j2bVzojiiYmE0ltu&amp;controls=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
          {/* Stats Number */}
          <div className="flex gap-4 items-center lg:gap-8">
            <ScorecardRestart25
              scorecardValue={2000}
              scorecardName="Attendees"
              isMoreValue
            />
            <ScorecardRestart25
              scorecardValue={15}
              scorecardName="Speakers"
              isMoreValue
            />
            <ScorecardRestart25 scorecardValue={10} scorecardName="Sessions" />
          </div>

          {/* Main Topics */}
          <div className="about-event flex flex-col gap-3 items-center lg:gap-5">
            <SectionTitleRestart25 sectionTitle="Main Topic" />
            <p className="quotes font-bodycopy font-medium text-sm text-center text-white/90 max-w-[500px] lg:text-xl lg:max-w-[760px]">
              <span className="font-bold">“RE:START”</span> represents founders
              who don’t just chase trends, but architect businesses that thrive
              in the age of AI, automation, and constant disruption. While many
              jump on the latest buzzwords, few truly understand how to adapt
              their mindset, models, and methods for what’s coming next. This
              track is about building not just a business — but an operating
              system for the future.
            </p>
          </div>
        </div>

        {/* Overlay */}
        <div className="overlay-top absolute left-0 top-[400px] w-full h-[320px] bg-gradient-to-t from-10% from-black/10 via-50% via-black to-100% to-black/0 z-10 lg:top-[690px]" />
        <div className="overlay absolute left-0 bottom-0 w-full h-[50px] bg-gradient-to-t from-10% from-black to-100% to-black/0 z-10 lg:hidden" />

        {/* Background */}
        <div className="absolute flex flex-col -top-40 lg:top-20">
          <Image
            className="background flex opacity-22 object-cover h-[720px]"
            src={
              "https://static.wixstatic.com/media/02a5b1_96ca791fac7348acb572e5d9bd38c550~mv2.webp"
            }
            alt="Background Hero"
            width={2440}
            height={2440}
          />
        </div>
      </div>
    </section>
  );
}
