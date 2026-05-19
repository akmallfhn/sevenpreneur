"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AlertConfirmDialogAILN from "@/components/modals/AlertConfirmDialogAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { getDurationFromSeconds } from "@/lib/date-time-manipulation";
import { trpc } from "@/trpc/client";
import {
  faChevronLeft,
  faChevronRight,
  faClock,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface QuizOption {
  id: number;
  option_code: string;
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  explanation: string | null;
  order_index: number;
  xp_reward: number;
  options: QuizOption[];
}

export interface QuizDetailsData {
  quiz: {
    id: string;
    name: string;
    description: string | null;
    chapter: { id: number; name: string } | null;
  };
  questions: QuizQuestion[];
  progress: {
    attempt_number: number;
    score: number;
    answers: unknown;
    submitted_at: Date | string;
  } | null;
  draft: {
    attempt_number: number;
    answers: unknown;
    started_at: Date | string;
    updated_at: Date | string;
  } | null;
  xp_earned: number;
}

const AUTOSAVE_DEBOUNCE_MS = 400;

interface QuizAttemptAILNProps {
  quizId: string;
  data: QuizDetailsData;
}

export default function QuizAttemptAILN({
  quizId,
  data,
}: QuizAttemptAILNProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { quiz, questions } = data;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextVariant = isDark ? "outline" : "primary";

  // Jawaban user, key = question id (string), value = option_code yang dipilih
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  // Index soal yang lagi ditampilin (mulai dari 0)
  const [currentIdx, setCurrentIdx] = useState(0);
  // Sisa waktu dalam detik. null = belum selesai inisialisasi dari server
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isConfirmSubmitDialogOpen, setIsConfirmSubmitDialogOpen] =
    useState(false);

  // Tandain quiz udah disubmit. Dipakai buat block autosave + submit dobel
  const submittedRef = useRef(false);
  // Tandain startAttempt udah dipanggil sekali. Buat StrictMode/dobel mount
  const startedRef = useRef(false);
  // Tandain user beneran udah pilih jawaban minimal sekali.
  // Autosave cuma fire setelah ini true, supaya seed answers dari server
  const userInteractedRef = useRef(false);

  // Dipanggil pas component mount. Server-lah yang nentuin sisa waktu
  const startAttempt = trpc.ailene.update.startQuizAttempt.useMutation({
    onSuccess: (res) => {
      if (res.status === "finalized") {
        submittedRef.current = true;
        utils.ailene.list.quizQuestions.invalidate({ quiz_id: quizId });
        utils.ailene.read.quizResult.invalidate({ quiz_id: quizId });
        utils.ailene.list.chapters.invalidate();
        utils.ailene.list.tasks.invalidate();
        utils.auth.checkAilMember.invalidate();
        return;
      }
      setAnswers((res.answers as Record<string, string | null>) ?? {});
      setSecondsLeft(res.seconds_left);
    },
    onError: () => toast.error("Gagal memulai quiz."),
  });

  // Trigger startAttempt sekali pas mount. startedRef guard biar ga dobel call
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startAttempt.mutate({ quiz_id: quizId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  // Tiap detik, kurangi secondsLeft. Saat udah 0, biarin — effect lain yang handle auto-submit.
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) return;
    const id = setTimeout(
      () => setSecondsLeft((s) => (s == null ? s : s - 1)),
      1000
    );
    return () => clearTimeout(id);
  }, [secondsLeft]);

  // Simpan jawaban ke DB (is_completed=false). Server juga nge-check kalo draft
  const saveDraft = trpc.ailene.update.saveQuizDraft.useMutation({
    onSuccess: (res) => {
      if (res.status === "finalized") {
        submittedRef.current = true;
        utils.ailene.list.quizQuestions.invalidate({ quiz_id: quizId });
        utils.ailene.read.quizResult.invalidate({ quiz_id: quizId });
        utils.ailene.list.chapters.invalidate();
        utils.ailene.list.tasks.invalidate();
        utils.auth.checkAilMember.invalidate();
      }
    },
  });

  // Finalize quiz: hitung score, set is_completed=true, award XP.
  const submitMutation = trpc.ailene.update.submitQuiz.useMutation({
    onError: () => toast.error("Gagal menyimpan jawaban quiz."),
    onSuccess: () => {
      utils.ailene.list.quizQuestions.invalidate({ quiz_id: quizId });
      utils.ailene.read.quizResult.invalidate({ quiz_id: quizId });
      utils.ailene.list.chapters.invalidate();
      utils.ailene.list.tasks.invalidate();
      utils.auth.checkAilMember.invalidate();
    },
  });

  // Autosave tiap kali `answers` berubah
  useEffect(() => {
    if (!userInteractedRef.current) return;
    if (submittedRef.current) return;
    if (secondsLeft === null) return;
    const id = setTimeout(() => {
      if (submittedRef.current) return;
      saveDraft.mutate({ quiz_id: quizId, answers });
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, quizId]);

  // Auto-submit pas waktu habis
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft > 0) return;
    if (submittedRef.current) return;
    submittedRef.current = true;
    submitMutation.mutate({ quiz_id: quizId, answers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  // ===== DERIVED VALUES =====
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;

  // User pilih opsi. Set userInteractedRef supaya autosave aktif.
  const handleSelect = (optionCode: string) => {
    if (!currentQ) return;
    const qid = String(currentQ.id);
    userInteractedRef.current = true;
    setAnswers((prev) => ({ ...prev, [qid]: optionCode }));
  };

  // Navigasi antar soal
  const handlePrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1));

  // Submit manual via tombol "Submit jawaban". Buka dialog konfirmasi dulu.
  const handleSubmit = () => setIsConfirmSubmitDialogOpen(true);
  const handleConfirmSubmit = () => {
    setIsConfirmSubmitDialogOpen(false);
    if (submittedRef.current) return;
    submittedRef.current = true;
    submitMutation.mutate({ quiz_id: quizId, answers });
  };

  // Buka dialog konfirmasi dulu saat mau keluar
  const handleExit = () => setIsExitDialogOpen(true);
  const handleConfirmExit = () => {
    setIsExitDialogOpen(false);
    router.push("/student");
  };

  const isLast = currentIdx === totalQuestions - 1;

  // Loading state: tunggu startAttempt response dulu sebelum render UI quiz,
  if (secondsLeft === null) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="flex-1 text-base font-semibold dark:text-white">
              {quiz.name}
            </h1>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-dashboard-border dark:text-gray-300">
              Soal {currentIdx + 1} / {totalQuestions}
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                secondsLeft <= 60
                  ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300 dark:border dark:border-red-500/40 dark:shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                  : secondsLeft <= 300
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 dark:border dark:border-amber-500/40"
                    : "bg-gray-50 text-gray-700 dark:bg-dashboard-border dark:text-gray-300"
              }`}
            >
              <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
              {getDurationFromSeconds(Math.max(0, secondsLeft))} tersisa
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 dark:shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
              Auto-save aktif
            </span>
            <button
              type="button"
              onClick={handleExit}
              className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-dashboard-border dark:text-gray-300 dark:hover:bg-card-inside-bg"
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="h-3.5 w-3.5"
              />
              Keluar
            </button>
          </div>
          <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full">
            {questions.map((q, idx) => {
              const qid = String(q.id);
              const isAnswered = qid in answers && answers[qid] != null;
              return (
                <div
                  key={idx}
                  className={`h-full flex-1 ${
                    isAnswered
                      ? "bg-emerald-600 dark:bg-emerald-500 dark:shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                      : "bg-gray-200 dark:bg-dashboard-border"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Main body */}
        <div className="flex flex-1 gap-4">
          {/* Left panel: question */}
          <div className="flex flex-1 flex-col gap-4 rounded-xl border bg-white p-6 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                SOAL {currentIdx + 1}
              </span>
            </div>
            {currentQ ? (
              <>
                <p className="text-[17px] font-semibold leading-snug text-gray-900 dark:text-white">
                  {currentQ.question}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pilih satu jawaban yang paling tepat.
                </p>

                <div className="flex flex-col gap-2">
                  {currentQ.options.map((opt) => {
                    const qid = String(currentQ.id);
                    const isSelected = answers[qid] === opt.option_code;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(opt.option_code)}
                        className={`flex items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 text-left text-sm transition ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-white dark:shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                            : "border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50 dark:border-dashboard-border dark:bg-card-bg dark:text-gray-200 dark:hover:border-red-500/30 dark:hover:bg-card-inside-bg"
                        }`}
                      >
                        <div
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isSelected
                              ? "bg-emerald-500 text-white dark:shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                              : "bg-gray-200 text-gray-700 dark:bg-dashboard-border dark:text-gray-300"
                          }`}
                        >
                          {opt.option_code.toUpperCase()}
                        </div>
                        <span className="flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Belum ada pertanyaan pada quiz ini.
              </p>
            )}

            <div className="mt-auto flex items-center justify-between border-t pt-4 dark:border-dashboard-border">
              <ButtonAILN
                variant="outline"
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
                Sebelumnya
              </ButtonAILN>
              <ButtonAILN
                variant={nextVariant}
                onClick={handleNext}
                disabled={isLast}
              >
                Berikutnya
                <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
              </ButtonAILN>
            </div>
          </div>

          {/* Right panel: navigation */}
          <div className="flex w-72 shrink-0 flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                NAVIGASI SOAL
              </span>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const qid = String(q.id);
                  const isCurrent = idx === currentIdx;
                  const isAnswered = qid in answers && answers[qid] != null;

                  let cls = "";
                  if (isCurrent) {
                    cls =
                      "bg-red-500 text-white dark:shadow-[0_0_10px_rgba(239,68,68,0.7)]";
                  } else if (isAnswered) {
                    cls =
                      "bg-black text-white dark:bg-red-500/20 dark:text-red-100 dark:border dark:border-red-500/40";
                  } else {
                    cls =
                      "border border-gray-200 bg-gray-100 text-gray-500 dark:border-dashboard-border dark:bg-card-inside-bg dark:text-gray-400";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`flex aspect-square items-center justify-center rounded-md text-xs font-semibold transition hover:opacity-80 ${cls}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1.5 border-t pt-3 text-xs text-gray-600 dark:border-dashboard-border dark:text-gray-400">
                <LegendItem
                  color="bg-black dark:bg-red-500/20 dark:border dark:border-red-500/40"
                  label="Terjawab"
                />
                <LegendItem
                  color="bg-red-500 dark:shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                  label="Saat ini"
                />
                <LegendItem
                  color="bg-gray-100 border border-gray-200 dark:bg-card-inside-bg dark:border-dashboard-border"
                  label="Belum"
                />
              </div>
            </div>

            <ButtonAILN
              variant={nextVariant}
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? "Menyimpan..." : "Submit jawaban"}
            </ButtonAILN>
          </div>
        </div>
      </div>
      <AlertConfirmDialogAILN
        isOpen={isExitDialogOpen}
        alertDialogHeader="Keluar dari quiz?"
        alertDialogMessage="Waktu quiz tetap berjalan walau kamu keluar halaman. Jawaban yang sudah dipilih tersimpan otomatis, tapi quiz akan otomatis disubmit ketika waktu habis."
        alertCancelLabel="Batal"
        alertConfirmLabel="Tetap keluar"
        onClose={() => setIsExitDialogOpen(false)}
        onConfirm={handleConfirmExit}
      />
      <AlertConfirmDialogAILN
        isOpen={isConfirmSubmitDialogOpen}
        alertDialogHeader="Yakin submit jawaban?"
        alertDialogMessage="Quiz tidak bisa diulang setelah disubmit. Pastikan semua jawaban kamu sudah benar sebelum lanjut."
        alertCancelLabel="Periksa lagi"
        alertConfirmLabel="Ya, submit"
        onClose={() => setIsConfirmSubmitDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </PageContainerAILN>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}
