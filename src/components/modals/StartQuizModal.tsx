"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Target, Zap } from "lucide-react";
import AppButton from "../buttons/AppButton";

interface StartQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  quizCount: number;
  xpReward: number;
}

export default function StartQuizModal({
  isOpen,
  onClose,
  lessonId,
  quizCount,
  xpReward,
}: StartQuizModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStart = () => {
    onClose();
    router.push(`/lessons/${lessonId}/quiz`);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/70 z-50 px-4"
      onClick={onClose}
    >
      <div
        className="flex flex-col bg-white dark:bg-surface-black w-full max-w-sm p-6 gap-5 rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-bodycopy font-bold text-lg text-sevenpreneur-coal dark:text-white">
            Siap mulai quiz?
          </h2>
          <p className="font-bodycopy text-sm text-emphasis">
            Pastikan kamu sudah membaca materi sebelum memulai.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-section-background">
            <BookOpen className="size-4 text-primary shrink-0" />
            <span className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white">
              {quizCount} soal pilihan ganda
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-section-background">
            <Clock className="size-4 text-amber-500 shrink-0" />
            <span className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white">
              2 menit per soal
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-section-background">
            <Target className="size-4 text-primary shrink-0" />
            <span className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white">
              Nilai minimum 70% untuk lulus
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-section-background">
            <Zap className="size-4 text-warning shrink-0" />
            <span className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white">
              +{xpReward} XP jika lulus · Tidak bisa diulang
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <AppButton
            variant="light"
            size="medium"
            onClick={onClose}
            className="flex-1 justify-center"
          >
            Batal
          </AppButton>
          <AppButton
            variant="primary"
            size="medium"
            onClick={handleStart}
            className="flex-1 justify-center"
          >
            Mulai
          </AppButton>
        </div>
      </div>
    </div>
  );
}
