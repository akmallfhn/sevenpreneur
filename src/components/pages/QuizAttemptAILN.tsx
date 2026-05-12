"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AppAlertConfirmDialog from "@/components/modals/AppAlertConfirmDialog";
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

const AUTOSAVE_DEBOUNCE_MS = 600;

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

  // ===== STATE =====
  // Jawaban user, key = question id (string), value = option_code yang dipilih
  // Format DB: { "16": "c", "19": "b", ... }
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  // Index soal yang lagi ditampilin (mulai dari 0)
  const [currentIdx, setCurrentIdx] = useState(0);
  // Sisa waktu dalam detik. null = belum selesai inisialisasi dari server
  // (timer baru dibuat setelah startQuizAttempt sukses)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  // Toggle dialog konfirmasi sebelum keluar
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  // ===== REFS (flag yang ga butuh trigger re-render) =====
  // Tandain quiz udah disubmit. Dipakai buat block autosave + submit dobel
  const submittedRef = useRef(false);
  // Tandain startAttempt udah dipanggil sekali. Buat StrictMode/dobel mount
  const startedRef = useRef(false);
  // Tandain user beneran udah pilih jawaban minimal sekali.
  // Autosave cuma fire setelah ini true, supaya seed answers dari server
  // (yang nge-set state pas mount) ga ke-trigger autosave palsu
  const userInteractedRef = useRef(false);

  // ===== MUTATION: START / RESUME ATTEMPT =====
  // Dipanggil pas component mount. Server-lah yang nentuin sisa waktu
  // berdasarkan started_at di DB — bukan client. Jadi refresh = tetep akurat.
  const startAttempt = trpc.ailene.startQuizAttempt.useMutation({
    onError: () => toast.error("Gagal memulai quiz."),
    onSuccess: (res) => {
      // Kalo server mendeteksi draft existing tapi udah expired (lewat 20 menit),
      // dia finalize duluan dan return status "finalized".
      // Client tinggal invalidate cache → parent QuizDetailsAILN re-render
      // ke QuizResultAILN secara otomatis.
      if (res.status === "finalized") {
        submittedRef.current = true;
        utils.ailene.list.quizQuestions.invalidate({ quiz_id: quizId });
        utils.ailene.read.quizResult.invalidate({ quiz_id: quizId });
        utils.ailene.list.chapters.invalidate();
        utils.ailene.list.tasks.invalidate();
        utils.auth.checkAilMember.invalidate();
        return;
      }
      // Status "active" = attempt valid, lanjut quiz.
      // Seed answers dari draft tersimpan (kalo resume) atau {} (kalo baru).
      setAnswers((res.answers as Record<string, string | null>) ?? {});
      setSecondsLeft(res.seconds_left);
    },
  });

  // Trigger startAttempt sekali pas mount. startedRef guard biar ga dobel call
  // (React StrictMode di dev bisa render dua kali).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startAttempt.mutate({ quiz_id: quizId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  // ===== TIMER COUNTDOWN =====
  // Tiap detik, kurangi secondsLeft. Saat udah 0, biarin — effect lain yang
  // handle auto-submit. Pattern setTimeout di-recreate tiap render lebih
  // aman daripada setInterval (auto-cleanup, ga ada drift).
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) return;
    const id = setTimeout(
      () => setSecondsLeft((s) => (s == null ? s : s - 1)),
      1000
    );
    return () => clearTimeout(id);
  }, [secondsLeft]);

  // ===== MUTATION: AUTOSAVE DRAFT =====
  // Simpan jawaban ke DB (is_completed=false). Server juga nge-check kalo draft
  // udah expired, dia finalize duluan dan return "finalized" — sama kayak
  // startAttempt, kita invalidate ke result view.
  const saveDraft = trpc.ailene.saveQuizDraft.useMutation({
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

  // ===== MUTATION: SUBMIT FINAL =====
  // Finalize quiz: hitung score, set is_completed=true, award XP.
  // Setelah sukses, invalidate semua cache yang nampilin progress.
  const submitMutation = trpc.ailene.submitQuiz.useMutation({
    onError: () => toast.error("Gagal menyimpan jawaban quiz."),
    onSuccess: () => {
      utils.ailene.list.quizQuestions.invalidate({ quiz_id: quizId });
      utils.ailene.read.quizResult.invalidate({ quiz_id: quizId });
      utils.ailene.list.chapters.invalidate();
      utils.ailene.list.tasks.invalidate();
      utils.auth.checkAilMember.invalidate();
    },
  });

  // ===== AUTOSAVE DEBOUNCED =====
  // Tiap kali `answers` berubah, tunggu 600ms (AUTOSAVE_DEBOUNCE_MS) — kalo
  // user pilih jawaban lagi sebelum 600ms, timeout di-reset (cleanup function).
  // Setelah idle 600ms, fire saveDraft.mutate.
  //
  // Guard yang penting:
  // - userInteractedRef: skip seed answers dari startAttempt onSuccess
  // - submittedRef: skip kalo udah submit (race condition setelah submit)
  // - secondsLeft===null: skip kalo attempt belum siap
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

  // ===== AUTO-SUBMIT PAS TIMER HABIS =====
  // Begitu secondsLeft jadi 0, kalo belum disubmit, fire submitMutation
  // pakai jawaban terakhir di state. Kalo user offline pas ini fire,
  // QStash job di server tetep jalan T+20min dari started_at — jadi
  // submit tetap kejadi walau client ga sempat fire.
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

  // ===== HANDLERS =====
  // User pilih opsi. Set userInteractedRef supaya autosave aktif.
  // Pakai functional setState ({...prev}) biar tahan terhadap rapid clicks.
  const handleSelect = (optionCode: string) => {
    if (!currentQ) return;
    const qid = String(currentQ.id);
    userInteractedRef.current = true;
    setAnswers((prev) => ({ ...prev, [qid]: optionCode }));
  };

  // Navigasi antar soal — clamp di range [0, totalQuestions-1]
  const handlePrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1));

  // Submit manual via tombol "Submit jawaban".
  // submittedRef guard cegah dobel-submit (klik 2x cepat / timer expired
  // bareng klik submit).
  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    submitMutation.mutate({ quiz_id: quizId, answers });
  };

  // Tombol "Keluar" → buka dialog konfirmasi dulu (warn user bahwa timer
  // tetep jalan di background). Confirm → router.back().
  const handleExit = () => setIsExitDialogOpen(true);
  const handleConfirmExit = () => {
    setIsExitDialogOpen(false);
    router.back();
  };

  const isLast = currentIdx === totalQuestions - 1;

  // Loading state: tunggu startAttempt response dulu sebelum render UI quiz,
  // supaya timer ga ke-render dengan nilai placeholder.
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
        <div className="flex flex-col gap-3 rounded-xl border bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="flex-1 text-base font-semibold">{quiz.name}</h1>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Soal {currentIdx + 1} / {totalQuestions}
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                secondsLeft <= 60
                  ? "bg-red-50 text-red-600"
                  : secondsLeft <= 300
                    ? "bg-amber-50 text-amber-700"
                    : "bg-gray-50 text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
              {getDurationFromSeconds(Math.max(0, secondsLeft))} tersisa
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Auto-save aktif
            </span>
            <button
              type="button"
              onClick={handleExit}
              className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
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
                    isAnswered ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Main body */}
        <div className="flex flex-1 gap-4">
          {/* Left panel: question */}
          <div className="flex flex-1 flex-col gap-4 rounded-xl border bg-white p-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                SOAL {currentIdx + 1}
              </span>
            </div>
            {currentQ ? (
              <>
                <p className="text-[17px] font-semibold leading-snug text-gray-900">
                  {currentQ.question}
                </p>
                <p className="text-sm text-gray-500">
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
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-200 text-gray-700"
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
              <p className="text-sm text-gray-500">
                Belum ada pertanyaan pada quiz ini.
              </p>
            )}

            <div className="mt-auto flex items-center justify-between border-t pt-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
                Sebelumnya
              </button>
              <ButtonAILN onClick={handleNext} disabled={isLast}>
                Berikutnya
                <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
              </ButtonAILN>
            </div>
          </div>

          {/* Right panel: navigation */}
          <div className="flex w-72 shrink-0 flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-xl border bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                NAVIGASI SOAL
              </span>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const qid = String(q.id);
                  const isCurrent = idx === currentIdx;
                  const isAnswered = qid in answers && answers[qid] != null;

                  let cls = "";
                  if (isCurrent) {
                    cls = "bg-red-500 text-white";
                  } else if (isAnswered) {
                    cls = "bg-black text-white";
                  } else {
                    cls = "border border-gray-200 bg-gray-100 text-gray-500";
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
              <div className="flex flex-col gap-1.5 border-t pt-3 text-xs text-gray-600">
                <LegendItem color="bg-black" label="Terjawab" />
                <LegendItem color="bg-red-500" label="Saat ini" />
                <LegendItem
                  color="bg-gray-100 border border-gray-200"
                  label="Belum"
                />
              </div>
            </div>

            <ButtonAILN
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? "Menyimpan..." : "Submit jawaban"}
            </ButtonAILN>
          </div>
        </div>
      </div>
      <AppAlertConfirmDialog
        isOpen={isExitDialogOpen}
        alertDialogHeader="Keluar dari quiz?"
        alertDialogMessage="Waktu quiz tetap berjalan walau kamu keluar halaman. Jawaban yang sudah dipilih tersimpan otomatis, tapi quiz akan otomatis disubmit ketika waktu habis."
        alertCancelLabel="Batal"
        alertConfirmLabel="Tetap keluar"
        onClose={() => setIsExitDialogOpen(false)}
        onConfirm={handleConfirmExit}
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
