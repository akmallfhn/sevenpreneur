"use client";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";

export type EmptyStateLMS =
  | "COURSES"
  | "COHORTS"
  | "PLAYLISTS"
  | "TEMPLATES"
  | "AI_TOOLS"
  | "LEARNINGS"
  | "MODULES"
  | "PROJECTS"
  | "MATERIALS"
  | "MEMBERS"
  | "RECORDING"
  | "DISCUSSIONS";

export const variantStyles: Record<
  EmptyStateLMS,
  {
    title: string | null;
    description: string;
    image: string | null;
    action: string | null;
  }
> = {
  COURSES: {
    title: "No Courses Purchased",
    description:
      "Looks like you haven’t bought any courses. Explore our collections and start learning something new today!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: "Explore Program",
  },
  COHORTS: {
    title: "No Bootcamp Purchased",
    description:
      "Looks like you haven’t bought any programs. Explore our collections and start learning something new today!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: "Explore Program",
  },
  PLAYLISTS: {
    title: "No Video Purchased",
    description:
      "Looks like you haven’t bought any video series. Explore our collections and start learning something new today!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: "Explore Program",
  },
  TEMPLATES: {
    title: "Business Templates Locked",
    description:
      "Looks like you’re not part of any Bootcamp Programs. Join one to unlock all business templates!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: "Explore Program",
  },
  AI_TOOLS: {
    title: "AI Tools Locked",
    description:
      "Looks like you’re not part of any Bootcamp Programs. Join one to unlock all AI Tools!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: "Explore Program",
  },
  LEARNINGS: {
    title: "No Sessions Available",
    description:
      "There are no learning sessions scheduled right now. Please check back later or contact your program coordinator for updates.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: null,
  },
  MODULES: {
    title: "Modules Coming Soon",
    description:
      "We’re working on something great! New modules will be ready soon",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: null,
  },
  PROJECTS: {
    title: "No Assignments Yet",
    description:
      "You don’t have any tasks or assignments right now. New tasks will appear here once they’re ready!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: null,
  },
  MEMBERS: {
    title: "No Members Have Joined So Far",
    description:
      "Looks like no one’s joined this cohort just yet. Once members enroll, you’ll see them listed right here!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg",
    action: null,
  },
  MATERIALS: {
    title: null,
    description:
      "The session materials are being prepared and will be available soon.",
    image: null,
    action: null,
  },
  RECORDING: {
    title: "Oops, No Video Yet!",
    description:
      "Don’t worry! The video will be uploaded shortly after the session ends. Stay tuned!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/no-recording.svg",
    action: null,
  },
  DISCUSSIONS: {
    title: "Got something to say?",
    description:
      "After joining this session, what are your questions, ideas, or takeaways? Share them with everyone here!",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/empty-comment.svg",
    action: null,
  },
};

interface EmptyComponentsLMSProps {
  variant: EmptyStateLMS;
}

export default function EmptyComponentsLMS(props: EmptyComponentsLMSProps) {
  const { title, description, image, action } = variantStyles[props.variant];

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="state-box flex flex-col w-full h-full p-6 items-center lg:p-3 lg:justify-center">
      <div className="state-container flex flex-col gap-4 max-w-md text-center items-center">
        {!!image && (
          <div className="state-illustration flex max-w-60 overflow-hidden lg:max-w-80">
            <Image
              className="object-cover w-full h-full"
              src={image}
              alt="empty-lms"
              width={500}
              height={400}
            />
          </div>
        )}
        <div className="state-captions flex flex-col gap-1 items-center">
          {!!title && (
            <h2 className="flex font-bold font-bodycopy text-center tracking-tight text-base lg:text-xl">
              {title}
            </h2>
          )}
          <p className="font-bodycopy text-center font-medium text-emphasis text-sm lg:text-[15px]">
            {description}
          </p>
        </div>
        {!!action && (
          <Link href={`https://www.${domain}`}>
            <AppButton>{action}</AppButton>
          </Link>
        )}
      </div>
    </div>
  );
}
