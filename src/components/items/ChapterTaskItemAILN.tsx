"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AppAlertConfirmDialog from "@/components/modals/AppAlertConfirmDialog";
import { TaskVariant } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import {
  faBookOpen,
  faCircleCheck,
  faCirclePlay,
  faClipboardList,
  faLock,
  faSquareCheck,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isStartQuizDialogOpen, setIsStartQuizDialogOpen] = useState(false);
  const invalidateProgress = () => {
    utils.ailene.list.tasks.invalidate();
    utils.auth.checkAilMember.invalidate();
  };
  const completeMaterial = trpc.ailene.completeMaterial.useMutation({
    onSuccess: invalidateProgress,
  });
  const completeVideo = trpc.ailene.completeVideo.useMutation({
    onSuccess: invalidateProgress,
  });

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
      ? "Locked"
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
      ? "Locked"
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
    meta = !props.unlocked ? "Locked" : m.completed ? "Read" : "Not started";
    const handleCompleteMaterial = () => {
      if (!m.completed) {
        completeMaterial.mutate({ material_id: m.id });
      }
    };
    cta = !props.unlocked ? (
      <ButtonAILN size="small" disabled className="w-full">
        Locked
      </ButtonAILN>
    ) : m.file_url ? (
      <a
        href={m.file_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCompleteMaterial}
      >
        <ButtonAILN size="small" className="w-full">
          Baca Materi
        </ButtonAILN>
      </a>
    ) : (
      <Link href={`/student/materials/${props.material.id}`}>
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
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border px-2 py-0.5 text-xs font-semibold">
            <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-warning" />
            {xpReward} XP
          </span>
          <span className="text-xs text-gray-500">{meta}</span>
        </div>
      </div>
      <div className="w-32 shrink-0">{cta}</div>
      <div className="w-6">
        {locked ? (
          <FontAwesomeIcon icon={faLock} className="h-4 w-4 text-gray-400" />
        ) : hasMark ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="h-5 w-5 text-red-500"
          />
        ) : (
          <span className="block h-4 w-4 rounded-full border-2 border-gray-300" />
        )}
      </div>
      {props.variant === "Quiz" && (
        <AppAlertConfirmDialog
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

interface PreAssessmentItemAILNProps {
  unlocked: boolean;
  completed: boolean;
}

export function PreAssessmentItemAILN({
  unlocked,
  completed,
}: PreAssessmentItemAILNProps) {
  const locked = !unlocked;
  const meta = locked
    ? "Locked"
    : completed
      ? "Sudah dikirim"
      : "Belum diisi";

  const cta = locked ? (
    <ButtonAILN size="small" disabled className="w-full">
      Locked
    </ButtonAILN>
  ) : completed ? (
    <ButtonAILN size="small" disabled className="w-full">
      Selesai
    </ButtonAILN>
  ) : (
    <Link href="/student/pre-assessment" className="block">
      <ButtonAILN size="small" className="w-full">
        Mulai
      </ButtonAILN>
    </Link>
  );

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
        <FontAwesomeIcon icon={faClipboardList} size="xl" />
      </div>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wide text-gray-500">
          Pre-Assessment
        </div>
        <div className="text-sm font-semibold">Pre-Assessment AI Readiness</div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-600">
            Wajib · sekali isi
          </span>
          <span className="text-xs text-gray-500">{meta}</span>
        </div>
      </div>
      <div className="w-32 shrink-0">{cta}</div>
      <div className="w-6">
        {locked ? (
          <FontAwesomeIcon icon={faLock} className="h-4 w-4 text-gray-400" />
        ) : completed ? (
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
