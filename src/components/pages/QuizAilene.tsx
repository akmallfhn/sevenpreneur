"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { CheckCircle2, ChevronLeft, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppLoadingComponents from "../states/AppLoadingComponents";

const TIMER_SECONDS = 10;
const PASS_THRESHOLD = 70;

interface QuizOption {
  id: number;
  option_id: string;
  text: string;
  is_correct: boolean;
  order_index: number;
  question_id: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  explanation: string | null;
  lesson_id: number;
  order_index: number;
}

interface QuizAileneProps {
  lessonId: number;
}

type Phase = "idle" | "active" | "result";

function motivationalMessage(score: number): string {
  if (score === 100) return "Sempurna! Luar biasa.";
  if (score >= 80) return "Bagus sekali!";
  if (score >= 70) return "Lulus! Terus semangat.";
  if (score >= 50) return "Hampir! Pelajari lagi materinya.";
  return "Pelajari lagi materinya, kamu pasti bisa!";
}

function TimerRing({ timeLeft }: { timeLeft: number }) {
  const r = 17;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - timeLeft / TIMER_SECONDS);
  const color = timeLeft > 6 ? "#534AB7" : timeLeft > 3 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative size-11 shrink-0">
      <svg className="size-11 -rotate-90" viewBox="0 0 38 38">
        <circle cx="19" cy="19" r={r} fill="none" stroke="#E5E7EB" strokeWidth="3" />
        <circle
          cx="19" cy="19" r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.95s linear, stroke 0.3s" }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bodycopy font-medium text-[13px]"
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}

export default function QuizAilene({ lessonId }: QuizAileneProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();

  const { data, isLoading, isError } = trpc.ailene.listQuizQuestionsForUser.useQuery({
    lesson_id: lessonId,
  });

  const questions = (data?.list ?? []) as QuizQuestion[];
  const existingProgress = data?.progress ?? null;
  const isMember = data?.is_member ?? false;

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  // answers: questionId -> option_id (string) or null (timeout). Key absent = unanswered.
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [finalScore, setFinalScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [resultAnswers, setResultAnswers] = useState<Record<string, string | null>>({});

  const submitMutation = trpc.ailene.submitQuiz.useMutation({
    onError: () => toast.error("Gagal menyimpan hasil quiz."),
  });

  // Derive completed-on-load state without an effect
  const isAlreadyCompleted = !isLoading && !isError && phase === "idle" && !!existingProgress?.completed_at;
  const effectivePhase: Phase = isAlreadyCompleted ? "result" : phase;
  const displayScore = isAlreadyCompleted ? (existingProgress!.score ?? 0) : finalScore;
  const displayAnswers: Record<string, string | null> = isAlreadyCompleted
    ? ((existingProgress!.answers as Record<string, string | null>) ?? {})
    : resultAnswers;

  const currentQuestion = questions[currentIdx];
  const currentQId = String(currentQuestion?.id ?? "");
  const isLocked = currentQId !== "" && currentQId in answers;
  const currentAnswer = isLocked ? answers[currentQId] : undefined;

  // Timer tick — auto-answer happens inside the callback to avoid synchronous setState in effect body
  useEffect(() => {
    if (phase !== "active" || isLocked || timeLeft <= 0) return;
    const tid = setTimeout(() => {
      setTimeLeft((t) => t - 1);
      if (timeLeft === 1) {
        setAnswers((prev) => {
          if (currentQId in prev) return prev;
          return { ...prev, [currentQId]: null };
        });
      }
    }, 1000);
    return () => clearTimeout(tid);
  }, [phase, isLocked, timeLeft, currentQId]);

  const handleStart = () => {
    setPhase("active");
    setCurrentIdx(0);
    setTimeLeft(TIMER_SECONDS);
    setAnswers({});
  };

  const handleSelect = (optionId: string) => {
    if (isLocked || !currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQId]: optionId }));
  };

  const handleNext = () => {
    const isLast = currentIdx === questions.length - 1;
    if (!isLast) {
      setCurrentIdx((i) => i + 1);
      setTimeLeft(TIMER_SECONDS);
      return;
    }

    // Calculate score from current answers
    const correct = questions.filter((q) => {
      const sel = answers[String(q.id)];
      return sel != null && q.options.some((o) => o.is_correct && o.option_id === sel);
    }).length;
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    setFinalScore(score);
    setResultAnswers({ ...answers });
    setPhase("result");

    submitMutation.mutate(
      { lesson_id: lessonId, score, answers },
      {
        onSuccess: (d) => {
          setXpAwarded(d.xp_awarded);
          utils.ailene.listQuizQuestionsForUser.invalidate({ lesson_id: lessonId });
        },
      }
    );
  };

  const isLastQuestion = currentIdx === questions.length - 1;

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-2xl mx-auto w-full flex flex-col gap-6 px-8">
        <Link href={`/lessons/${lessonId}`}>
          <AppButton variant="light" size="small">
            <ChevronLeft className="size-3.5" />
            Kembali ke Materi
          </AppButton>
        </Link>

        {isLoading && <AppLoadingComponents />}

        {isError && (
          <div className="py-20 text-center">
            <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">Gagal memuat soal quiz.</p>
            <p className="font-bodycopy text-xs text-emphasis">Coba reload halaman ini.</p>
          </div>
        )}

        {/* ── IDLE ─────────────────────────────────────────── */}
        {!isLoading && !isError && effectivePhase === "idle" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal">Quiz</h1>
              <p className="font-bodycopy text-sm text-emphasis">
                {questions.length} soal · 10 detik per soal · Nilai minimum {PASS_THRESHOLD}% untuk lulus
              </p>
            </div>

            {!isMember ? (
              <p className="font-bodycopy text-sm text-danger">
                Kamu belum terdaftar sebagai member Ailene.
              </p>
            ) : (
              <AppButton variant="primary" size="medium" className="self-start" onClick={handleStart}>
                Mulai Quiz
              </AppButton>
            )}
          </div>
        )}

        {/* ── ACTIVE ───────────────────────────────────────── */}
        {!isLoading && !isError && effectivePhase === "active" && currentQuestion && (
          <div className="flex flex-col gap-5">
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-sevenpreneur-ash rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="font-bodycopy text-[13px] text-emphasis shrink-0">
                {currentIdx + 1} / {questions.length}
              </span>
              <TimerRing timeLeft={timeLeft} />
            </div>

            {/* Question card */}
            <div className="flex flex-col gap-2 p-6 rounded-xl border border-sevenpreneur-ash bg-white">
              <span className="font-bodycopy text-[11px] font-semibold text-emphasis uppercase tracking-widest">
                Pertanyaan
              </span>
              <p className="font-bodycopy font-semibold text-[17px] text-sevenpreneur-coal leading-snug">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {currentQuestion.options.map((opt) => {
                const isCorrect = opt.is_correct;
                const isSelected = currentAnswer === opt.option_id;
                const isWrongSelection = isLocked && isSelected && !isCorrect;

                let btnCls = "";
                let badgeCls = "";

                if (!isLocked) {
                  btnCls = "border-sevenpreneur-ash hover:border-primary/50 hover:bg-section-background text-sevenpreneur-coal cursor-pointer";
                  badgeCls = "bg-sevenpreneur-ash text-sevenpreneur-coal";
                } else if (isCorrect) {
                  btnCls = "border-success bg-success-background/40 text-sevenpreneur-coal";
                  badgeCls = "bg-success text-white";
                } else if (isWrongSelection) {
                  btnCls = "border-danger bg-danger-background/40 text-sevenpreneur-coal";
                  badgeCls = "bg-danger text-white";
                } else {
                  btnCls = "border-sevenpreneur-ash/40 text-emphasis opacity-50";
                  badgeCls = "bg-sevenpreneur-ash/40 text-emphasis";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.option_id)}
                    disabled={isLocked}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border-[1.5px] text-left transition font-bodycopy text-sm ${btnCls}`}
                  >
                    <div
                      className={`flex shrink-0 size-7 rounded-full items-center justify-center font-bold text-xs transition ${badgeCls}`}
                    >
                      {opt.option_id.toUpperCase()}
                    </div>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {/* Feedback bar */}
            {isLocked && (
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-bodycopy text-sm font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  currentAnswer === null
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : currentQuestion.options.some((o) => o.is_correct && o.option_id === currentAnswer)
                    ? "bg-success-background border-success/30 text-success-foreground"
                    : "bg-danger-background border-danger/30 text-danger-foreground"
                }`}
              >
                {currentAnswer === null ? (
                  <><Clock className="size-4 shrink-0" /> Waktu habis! Jawaban yang benar disorot.</>
                ) : currentQuestion.options.some((o) => o.is_correct && o.option_id === currentAnswer) ? (
                  <><CheckCircle2 className="size-4 shrink-0" /> Benar!</>
                ) : (
                  <><XCircle className="size-4 shrink-0" /> Salah.</>
                )}
              </div>
            )}

            {/* Explanation */}
            {isLocked && currentQuestion.explanation && (
              <p className="font-bodycopy text-xs text-sevenpreneur-coal bg-section-background rounded-lg px-4 py-3 border border-sevenpreneur-ash/50">
                {currentQuestion.explanation}
              </p>
            )}

            {/* Next / Lihat Hasil button */}
            {isLocked && (
              <button
                onClick={handleNext}
                disabled={submitMutation.isPending && isLastQuestion}
                className="w-full h-12 rounded-lg bg-primary text-white font-bodycopy font-semibold text-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {isLastQuestion ? (submitMutation.isPending ? "Menyimpan..." : "Lihat Hasil") : "Lanjut →"}
              </button>
            )}
          </div>
        )}

        {/* ── RESULT ───────────────────────────────────────── */}
        {effectivePhase === "result" && (
          <div className="flex flex-col gap-6">
            {/* Score card */}
            <div
              className={`flex flex-col items-center gap-2 p-8 rounded-xl border text-center ${
                displayScore >= PASS_THRESHOLD
                  ? "border-success bg-success-background/30"
                  : "border-danger bg-danger-background/30"
              }`}
            >
              <span
                className={`font-brand font-bold text-[52px] leading-none ${
                  displayScore >= PASS_THRESHOLD ? "text-success" : "text-danger"
                }`}
              >
                {displayScore}%
              </span>
              <p className="font-bodycopy text-[15px] text-emphasis">{motivationalMessage(displayScore)}</p>
              {xpAwarded > 0 && (
                <span className="mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-bodycopy text-xs font-semibold">
                  +{xpAwarded} XP diperoleh
                </span>
              )}
            </div>

            {/* Per-question review */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">Pembahasan Jawaban</h3>
              {questions.map((q, idx) => {
                const selected = displayAnswers[String(q.id)];
                const isTimeout = selected === null || selected === undefined;
                const isCorrect = !isTimeout && q.options.some((o) => o.is_correct && o.option_id === selected);
                const correctOpt = q.options.find((o) => o.is_correct);
                const selectedOpt = q.options.find((o) => o.option_id === selected);

                return (
                  <div
                    key={q.id}
                    className={`flex flex-col gap-3 p-4 rounded-xl border ${
                      isTimeout
                        ? "border-amber-200 bg-amber-50/50"
                        : isCorrect
                        ? "border-success/30 bg-success-background/20"
                        : "border-danger/30 bg-danger-background/20"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isTimeout ? (
                        <Clock className="size-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : isCorrect ? (
                        <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="size-4 text-danger shrink-0 mt-0.5" />
                      )}
                      <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">
                        <span className="text-emphasis font-normal mr-1">{idx + 1}.</span>
                        {q.question}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 pl-6">
                      {isTimeout ? (
                        <p className="font-bodycopy text-xs text-amber-700">
                          Waktu habis · Jawaban benar:{" "}
                          <strong>{correctOpt?.option_id.toUpperCase()}. {correctOpt?.text}</strong>
                        </p>
                      ) : isCorrect ? (
                        <p className="font-bodycopy text-xs text-success-foreground">
                          Jawaban kamu benar: <strong>{selectedOpt?.option_id.toUpperCase()}. {selectedOpt?.text}</strong>
                        </p>
                      ) : (
                        <>
                          <p className="font-bodycopy text-xs text-danger-foreground">
                            Jawaban kamu: <strong>{selectedOpt?.option_id.toUpperCase()}. {selectedOpt?.text}</strong>
                          </p>
                          <p className="font-bodycopy text-xs text-success-foreground">
                            Jawaban benar: <strong>{correctOpt?.option_id.toUpperCase()}. {correctOpt?.text}</strong>
                          </p>
                        </>
                      )}
                      {q.explanation && (
                        <p className="font-bodycopy text-xs text-sevenpreneur-coal bg-white/70 rounded-lg px-3 py-2 mt-1 border border-black/5">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href={`/lessons/${lessonId}`}>
              <AppButton variant="primarySoft" size="medium" className="w-full justify-center">
                Lihat Konten Lagi
              </AppButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
