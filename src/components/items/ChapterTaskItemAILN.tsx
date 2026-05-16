"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import { TaskVariant } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import AlertConfirmDialogAILN from "../modals/AlertConfirmDialogAILN";

const QUIZ_DURATION_MINUTES = 20;

interface Quiz {
  id: string;
  name: string;
  attempts: number;
  best_score: number | null;
  question_count: number;
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
  id: string;
  title: string;
  completed: boolean;
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
  | {
      variant: "Quiz";
      unlocked: boolean;
      quiz: Quiz;
      lockedMessage?: string;
    }
  | {
      variant: "Video";
      unlocked: boolean;
      video: Video;
      lockedMessage?: string;
    }
  | {
      variant: "Material";
      unlocked: boolean;
      material: Material;
      lockedMessage?: string;
    };

export default function ChapterTaskItemAILN(props: ChapterTaskItemAILNProps) {
  const style = variantStyles[props.variant];
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isStartQuizDialogOpen, setIsStartQuizDialogOpen] = useState(false);
  const invalidateProgress = () => {
    utils.ailene.list.tasks.invalidate();
    utils.ailene.list.chapters.invalidate();
    utils.ailene.list.levels.invalidate();
    utils.auth.checkAilMember.invalidate();
    utils.ailene.read.todayFocus.invalidate();
  };
  const completeVideo = trpc.ailene.completeVideo.useMutation({
    onSuccess: invalidateProgress,
  });

  const lockedText = props.lockedMessage ?? "Locked";

  let title = "";
  let meta = "";
  let xpReward = 0;
  let hasMark = false;
  let cta: React.ReactNode = null;

  if (props.variant === "Quiz") {
    const q = props.quiz;
    const hasAttempt = q.attempts > 0;
    title = q.name;
    xpReward = q.xp_reward;
    hasMark = hasAttempt;
    meta = !props.unlocked
      ? lockedText
      : !hasAttempt
        ? "Not taken yet"
        : `Score: ${q.best_score}%`;
    cta = !props.unlocked ? (
      <ButtonAILN size="small" disabled className="w-full">
        Locked
      </ButtonAILN>
    ) : hasAttempt ? (
      <Link href={`/student/quizzes/${props.quiz.id}`} className="block">
        <ButtonAILN size="small" className="w-full">
          Lihat Hasil
        </ButtonAILN>
      </Link>
    ) : (
      <ButtonAILN
        size="small"
        className="w-full"
        onClick={() => setIsStartQuizDialogOpen(true)}
      >
        Mulai Quiz
      </ButtonAILN>
    );
  } else if (props.variant === "Video") {
    const v = props.video;
    title = v.title;
    xpReward = v.xp_reward;
    hasMark = v.completed;
    meta = !props.unlocked
      ? lockedText
      : v.completed
        ? "Watched"
        : "Not watched yet";
    const handleCompleteVideo = () => {
      if (!v.completed) {
        completeVideo.mutate({ video_id: v.id });
      }
    };
    cta = !props.unlocked ? (
      <ButtonAILN size="small" disabled className="w-full">
        Locked
      </ButtonAILN>
    ) : (
      <a
        href={v.video_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCompleteVideo}
      >
        <ButtonAILN size="small" className="w-full">
          Lihat Recording
        </ButtonAILN>
      </a>
    );
  } else {
    const m = props.material;
    title = m.title;
    xpReward = m.xp_reward;
    hasMark = m.completed;
    meta = !props.unlocked ? lockedText : m.completed ? "Read" : "Not started";

    cta = !props.unlocked ? (
      <ButtonAILN size="small" disabled className="w-full">
        Locked
      </ButtonAILN>
    ) : (
      <Link
        href={`/student/materials/${props.material.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ButtonAILN size="small" className="w-full">
          Baca Materi
        </ButtonAILN>
      </Link>
    );
  }

  const locked = !props.unlocked;
  const quizQuestionCount =
    props.variant === "Quiz" ? props.quiz.question_count : 0;
  const quizId = props.variant === "Quiz" ? props.quiz.id : "";

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-dashboard-border p-3 ${
        locked
          ? "bg-gray-50 dark:bg-red-500/[0.03]"
          : "bg-white dark:bg-red-500/5 dark:shadow-[0_0_10px_rgba(239,68,68,0.1)]"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-md ${
          locked
            ? "bg-gray-100 text-gray-400 dark:bg-red-500/5 dark:text-red-500/40"
            : "bg-red-100 text-red-500 dark:bg-red-500/15 dark:text-red-400 dark:shadow-[0_0_10px_rgba(239,68,68,0.4)]"
        }`}
      >
        {style.icon}
      </div>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {style.badge}
        </div>
        <div className="text-sm font-semibold dark:text-white">{title}</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border px-2 py-0.5 text-xs font-semibold dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200">
            <FontAwesomeIcon
              icon={faStar}
              className="h-3 w-3 text-warning dark:text-amber-400 dark:drop-shadow-[0_0_4px_rgba(251,191,36,0.7)]"
            />
            {xpReward} XP
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {meta}
          </span>
        </div>
      </div>
      <div className="w-32 shrink-0">{cta}</div>
      <div className="w-6">
        {locked ? (
          <FontAwesomeIcon
            icon={faLock}
            className="h-4 w-4 text-gray-400 dark:text-red-500/40"
          />
        ) : hasMark ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="h-5 w-5 text-red-500 dark:text-red-400 dark:drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
          />
        ) : (
          <span className="block h-4 w-4 rounded-full border-2 border-gray-300 dark:border-red-500/40" />
        )}
      </div>
      {props.variant === "Quiz" && (
        <AlertConfirmDialogAILN
          isOpen={isStartQuizDialogOpen}
          alertDialogHeader="Mulai Quiz Sekarang?"
          alertDialogMessage={`Quiz ini terdiri dari ${quizQuestionCount} pertanyaan dengan total waktu ${QUIZ_DURATION_MINUTES} menit. Waktu akan terus berjalan setelah quiz dimulai dan tidak bisa di-pause walaupun kamu keluar halaman.`}
          alertCancelLabel="Batal"
          alertConfirmLabel="Mulai sekarang"
          onClose={() => setIsStartQuizDialogOpen(false)}
          onConfirm={() => {
            setIsStartQuizDialogOpen(false);
            router.push(`/student/quizzes/${quizId}`);
          }}
        />
      )}
    </div>
  );
}
