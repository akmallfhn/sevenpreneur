"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import { TaskVariant } from "@/lib/app-types";
import {
  faBookOpen,
  faCircleCheck,
  faCirclePlay,
  faLock,
  faSquareCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const PASSING_SCORE = 70;

interface Quiz {
  id: number;
  name: string;
  attempts: number;
  best_score: number | null;
  xp_reward: number;
  xp_earned: number;
}

interface Video {
  id: number;
  title: string;
  completed: boolean;
  video_url: string;
  xp_reward: number;
  xp_earned: number;
}

interface Material {
  id: number;
  title: string;
  completed: boolean;
  file_url: string | null;
  xp_reward: number;
  xp_earned: number;
}

const variantStyles: Record<
  TaskVariant,
  { icon: React.ReactNode; badge: string }
> = {
  Quiz: {
    icon: <FontAwesomeIcon icon={faSquareCheck} size="xl" />,
    badge: "Quiz",
  },
  Video: {
    icon: <FontAwesomeIcon icon={faCirclePlay} size="xl" />,
    badge: "Recording",
  },
  Material: {
    icon: <FontAwesomeIcon icon={faBookOpen} size="xl" />,
    badge: "Materi",
  },
};

type ChapterTaskItemAILNProps =
  | { variant: "Quiz"; unlocked: boolean; quiz: Quiz }
  | { variant: "Video"; unlocked: boolean; video: Video }
  | { variant: "Material"; unlocked: boolean; material: Material };

export default function ChapterTaskItemAILN(props: ChapterTaskItemAILNProps) {
  const style = variantStyles[props.variant];

  let title = "";
  let meta = "";
  let xpReward = 0;
  let isDone = false;
  let cta: React.ReactNode = null;

  if (props.variant === "Quiz") {
    const q = props.quiz;
    const hasAttempt = q.attempts > 0;
    const passed = q.best_score !== null && q.best_score >= PASSING_SCORE;
    title = q.name;
    xpReward = q.xp_reward;
    isDone = passed;
    meta = !props.unlocked
      ? "Locked"
      : !hasAttempt
        ? "Not taken yet"
        : `Score: ${q.best_score}%`;
    cta = !props.unlocked ? (
      <ButtonAILN size="small" disabled>
        Locked
      </ButtonAILN>
    ) : (
      <Link href={`/student/quizzes/${props.quiz.id}`}>
        <ButtonAILN size="small">
          {!hasAttempt ? "Take Quiz" : "See Result"}
        </ButtonAILN>
      </Link>
    );
  } else if (props.variant === "Video") {
    const v = props.video;
    title = v.title;
    xpReward = v.xp_reward;
    isDone = v.completed;
    meta = !props.unlocked
      ? "Locked"
      : v.completed
        ? "Watched"
        : "Not watched yet";
    cta = !props.unlocked ? (
      <ButtonAILN size="small" disabled>
        Locked
      </ButtonAILN>
    ) : (
      <ButtonAILN
        size="small"
        onClick={() => window.open(v.video_url, "_blank")}
      >
        Watch Recording
      </ButtonAILN>
    );
  } else {
    const m = props.material;
    title = m.title;
    xpReward = m.xp_reward;
    isDone = m.completed;
    meta = !props.unlocked ? "Locked" : m.completed ? "Read" : "Not started";
    cta = !props.unlocked ? (
      <ButtonAILN size="small" disabled>
        Locked
      </ButtonAILN>
    ) : (
      <ButtonAILN
        size="small"
        onClick={() => {
          if (m.file_url) window.open(m.file_url, "_blank");
        }}
      >
        Read Materi
      </ButtonAILN>
    );
  }

  const locked = !props.unlocked;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-dashboard-border p-3 ${
        locked ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-md ${
          locked ? "bg-gray-100 text-gray-400" : "bg-red-100 text-red-500"
        }`}
      >
        {style.icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wide text-gray-500">
          {style.badge}
        </div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-warning-background text-warning-foreground px-2 py-0.5 text-xs font-semibold">
            <FontAwesomeIcon icon={faStar} className="h-3 w-3" />
            {xpReward} XP
          </span>
          <span className="text-xs text-gray-500">{meta}</span>
        </div>
      </div>
      <div>{cta}</div>
      <div className="w-6">
        {locked ? (
          <FontAwesomeIcon icon={faLock} className="h-4 w-4 text-gray-400" />
        ) : isDone ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="h-5 w-5 text-red-500"
          />
        ) : (
          <span className="block h-4 w-4 rounded-full border-2 border-gray-300" />
        )}
      </div>
    </div>
  );
}
