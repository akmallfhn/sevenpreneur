"use client";
import HeroVideoCourseSVP from "../templates/HeroVideoCourseSVP";
import VideoCoursePlaylistSVP from "../indexes/VideoCoursePlaylistSVP";
import AppButton from "../buttons/AppButton";
import {
  ArrowBigUpDash,
  ChevronDown,
  ChevronUp,
  Languages,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SectionTitleSVP from "../titles/SectionTitleSVP";
import OfferHighlightVideoCourseSVP from "../templates/OfferHighlightVideoCourseSVP";

export default function PlaylistDetailsSVP() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  // Checking height content description
  useEffect(() => {
    const checkOverflow = () => {
      if (paragraphRef.current) {
        const el = paragraphRef.current;
        const isOverflow = el.scrollHeight > el.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <HeroVideoCourseSVP />
      <div className="root flex flex-col px-5 py-5 w-full gap-8 bg-white md:flex-row lg:gap-14 lg:px-0 lg:py-10 lg:pb-20 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
        {/* Main */}
        <main className="flex flex-col gap-8 md:flex-[1.7] lg:gap-10">
          {/* Description */}
          <div className="video-description relative flex flex-col gap-4">
            <SectionTitleSVP sectionTitle="About RE:START Conference 2025" />
            <div className="flex flex-col gap-2 items-center md:items-start">
              <div>
                <p
                  className={`ratings text-sm text-black/90 font-ui ${
                    !isExpanded && "line-clamp-5"
                  }`}
                  ref={paragraphRef}
                >
                  Ever wondered how AI technologies like OpenAI ChatGPT, GPT-4,
                  DALL-E, Midjourney, and Stable Diffusion really work? In this
                  course, you will learn the foundations of these groundbreaking
                  applications. In this course you will build MULTIPLE practical
                  systems using natural language processing, or NLP - the branch
                  of machine learning and data science that deals with text and
                  speech. This course is not part of my deep learning series, so
                  it doesnt contain any hard math - just straight up coding in
                  Python. All the materials for this course are FREE. After a
                  brief discussion about what NLP is and what it can do, we will
                  begin building very useful stuff. The first thing well build
                  is a cipher decryption algorithm. These have applications in
                  warfare and espionage. We will learn how to build and apply
                  several useful NLP tools in this section, namely,
                  character-level language models (using the Markov principle),
                  and genetic algorithms. The second project, where we begin to
                  use more traditional machine learning, is to build a spam
                  detector. You likely get very little spam these days, compared
                  to say, the early 2000s, because of systems like these. Next
                  well build a model for sentiment analysis in Python. This is
                  something that allows us to assign a score to a block of text
                  that tells us how positive or negative it is. People have used
                  sentiment analysis on Twitter to predict the stock market.
                  Well go over some practical tools and techniques like the NLTK
                  (natural language toolkit) library and latent semantic
                  analysis or LSA.
                  <br />
                  <br />
                  <span className="inline-flex items-center gap-1 text-alternative">
                    <Languages className="size-4" />
                    <b>Language:</b> Bahasa Indonesia
                  </span>
                  <br />
                  <span className="inline-flex items-center gap-1 text-alternative">
                    <ArrowBigUpDash className="size-4" />
                    <b>Published at:</b> 2 Agustus 2025
                  </span>
                  <br />
                </p>
              </div>
              {isOverflowing && (
                <div className="flex transition-all transform z-10">
                  <AppButton
                    variant="primaryLight"
                    size="small"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    {isExpanded ? (
                      <>
                        <p>Show Less</p>
                        <ChevronUp className="size-4" />
                      </>
                    ) : (
                      <>
                        <p>Show more</p>
                        <ChevronDown className="size-4" />
                      </>
                    )}
                  </AppButton>
                </div>
              )}
              {!isExpanded && isOverflowing && (
                <div className="overlay absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-30% from-white to-transparent pointer-events-none" />
              )}
            </div>
          </div>

          {/* Playlist */}
          <div className="video-course flex flex-col gap-4">
            <SectionTitleSVP
              sectionTitle="Course Playlist"
              sectionDescription="10 episodes ● 20 instrutors"
            />
            <VideoCoursePlaylistSVP />
          </div>
        </main>
        {/* Aside */}
        <aside className="aside flex flex-col gap-8 md:flex-1 lg:gap-10">
          <OfferHighlightVideoCourseSVP />
        </aside>
      </div>
    </div>
  );
}
