"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  faCircleCheck,
  faCircleXmark,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TIMER_SECONDS = 120;
const PASS_THRESHOLD = 70;

interface QuizOption {
  id: number;
  option_code: string;
  text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  explanation: string | null;
  order_index: number;
  xp_reward: number;
}

interface QuizAILNProps {
  sessionToken: string;
  quizId: number;
}

type Phase = "idle" | "active" | "result";

function motivationalMessage(score: number): string {
  if (score === 100) return "Sempurna! Luar biasa.";
  if (score >= 80) return "Bagus sekali!";
  if (score >= 70) return "Lulus! Terus semangat.";
  if (score >= 50) return "Hampir! Pelajari lagi materinya.";
  return "Pelajari lagi materinya, kamu pasti bisa!";
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function TimerRing({ timeLeft }: { timeLeft: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - timeLeft / TIMER_SECONDS);
  const color =
    timeLeft > 60 ? "#000000" : timeLeft > 30 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative size-14 shrink-0">
      <svg className="size-14 -rotate-90" viewBox="0 0 46 46">
        <circle
          cx="23"
          cy="23"
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="3"
        />
        <circle
          cx="23"
          cy="23"
          r={r}
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
        className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold"
        style={{ color }}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

export default function QuizAILN({ sessionToken, quizId }: QuizAILNProps) {
  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.ailene.list.quizQuestions.useQuery({
    quiz_id: quizId,
  });

  const d = data as unknown as
    | {
        quiz: {
          id: number;
          name: string;
          description: string | null;
          chapter: { id: number; name: string } | null;
        };
        questions: QuizQuestion[];
        progress: {
          attempt_number: number;
          score: number;
          answers: unknown;
          submitted_at: Date;
        } | null;
        xp_earned: number;
      }
    | undefined;
  const quiz = d?.quiz;
  const questions: QuizQuestion[] = d?.questions ?? [];
  const existingProgress = d?.progress ?? null;

  const [phase, setPhase] = useState<Phase>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [finalScore, setFinalScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [resultAnswers, setResultAnswers] = useState<
    Record<string, string | null>
  >({});

  const submitMutation = trpc.ailene.submitQuiz.useMutation({
    onError: () => toast.error("Gagal menyimpan hasil quiz."),
  });

  const hasAttempted = !!existingProgress;
  const isAlreadyCompleted =
    !isLoading && !isError && hasAttempted && phase === "idle";
  const shouldAutoStart =
    !isLoading && !isError && !hasAttempted && phase === "idle";
  const effectivePhase: Phase = isAlreadyCompleted
    ? "result"
    : shouldAutoStart
      ? "active"
      : phase;

  const displayScore = isAlreadyCompleted
    ? (existingProgress?.score ?? 0)
    : finalScore;
  const displayAnswers: Record<string, string | null> = isAlreadyCompleted
    ? ((existingProgress?.answers as Record<string, string | null>) ?? {})
    : resultAnswers;

  const currentQuestion = questions[currentIdx];
  const currentQId = String(currentQuestion?.id ?? "");
  const isLocked = currentQId !== "" && currentQId in answers;
  const currentAnswer = isLocked ? answers[currentQId] : undefined;

  useEffect(() => {
    if (effectivePhase !== "active" || isLocked || timeLeft <= 0) return;
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
  }, [effectivePhase, isLocked, timeLeft, currentQId]);

  const handleSelect = (optionCode: string) => {
    if (isLocked || !currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQId]: optionCode }));
  };

  const handleNext = () => {
    const isLast = currentIdx === questions.length - 1;
    if (!isLast) {
      setCurrentIdx((i) => i + 1);
      setTimeLeft(TIMER_SECONDS);
      return;
    }

    const correct = questions.filter((q) => {
      const sel = answers[String(q.id)];
      return (
        sel != null &&
        q.options.some((o) => o.is_correct && o.option_code === sel)
      );
    }).length;
    const score =
      questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    setFinalScore(score);
    setResultAnswers({ ...answers });
    setPhase("result");

    submitMutation.mutate(
      { quiz_id: quizId, answers },
      {
        onSuccess: (d) => {
          setXpAwarded(d.xp_awarded);
          utils.ailene.list.quizQuestions.invalidate({ quiz_id: quizId });
          utils.auth.checkAilMember.invalidate();
        },
      }
    );
  };

  const isLastQuestion = currentIdx === questions.length - 1;

  if (isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  if (isError || !quiz) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  return (
    <PageContainerAILN>
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{quiz.name}</h1>
          {quiz.description && (
            <p className="text-sm text-gray-500">{quiz.description}</p>
          )}
        </div>

        {/* ACTIVE */}
        {effectivePhase === "active" && currentQuestion && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-black transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="shrink-0 text-[13px] text-gray-500">
                {currentIdx + 1} / {questions.length}
              </span>
              <TimerRing timeLeft={timeLeft} />
            </div>

            <div className="flex flex-col gap-2 rounded-xl border bg-white p-6">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Pertanyaan
              </span>
              <p className="text-[17px] font-semibold leading-snug">
                {currentQuestion.question}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {currentQuestion.options.map((opt) => {
                const isCorrect = opt.is_correct;
                const isSelected = currentAnswer === opt.option_code;
                const isWrongSelection = isLocked && isSelected && !isCorrect;

                let btnCls = "";
                let badgeCls = "";

                if (!isLocked) {
                  btnCls =
                    "border-gray-200 hover:border-black/30 hover:bg-gray-50 cursor-pointer";
                  badgeCls = "bg-gray-200 text-gray-800";
                } else if (isCorrect) {
                  btnCls = "border-green-500 bg-green-50";
                  badgeCls = "bg-green-500 text-white";
                } else if (isWrongSelection) {
                  btnCls = "border-red-500 bg-red-50";
                  badgeCls = "bg-red-500 text-white";
                } else {
                  btnCls = "border-gray-200 opacity-50";
                  badgeCls = "bg-gray-200 text-gray-600";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.option_code)}
                    disabled={isLocked}
                    className={`flex w-full items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 text-left text-sm transition ${btnCls}`}
                  >
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badgeCls}`}
                    >
                      {opt.option_code.toUpperCase()}
                    </div>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {isLocked && (
              <div
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${
                  currentAnswer === null
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : currentQuestion.options.some(
                          (o) => o.is_correct && o.option_code === currentAnswer
                        )
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {currentAnswer === null ? (
                  <>
                    <FontAwesomeIcon icon={faClock} className="h-4 w-4" /> Waktu
                    habis! Jawaban yang benar disorot.
                  </>
                ) : currentQuestion.options.some(
                    (o) => o.is_correct && o.option_code === currentAnswer
                  ) ? (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />{" "}
                    Benar!
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" />{" "}
                    Salah.
                  </>
                )}
              </div>
            )}

            {isLocked && currentQuestion.explanation && (
              <p className="rounded-lg border bg-gray-50 px-4 py-3 text-xs text-gray-700">
                {currentQuestion.explanation}
              </p>
            )}

            {isLocked && (
              <ButtonAILN
                onClick={handleNext}
                disabled={submitMutation.isPending && isLastQuestion}
              >
                {isLastQuestion
                  ? submitMutation.isPending
                    ? "Menyimpan..."
                    : "Lihat Hasil"
                  : "Lanjut"}
              </ButtonAILN>
            )}
          </div>
        )}

        {/* RESULT */}
        {effectivePhase === "result" && (
          <div className="flex flex-col gap-6">
            <div
              className={`flex flex-col items-center gap-2 rounded-xl border p-8 text-center ${
                displayScore >= PASS_THRESHOLD
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <span
                className={`text-[52px] font-bold leading-none ${
                  displayScore >= PASS_THRESHOLD
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {displayScore}%
              </span>
              <p className="text-[15px] text-gray-700">
                {motivationalMessage(displayScore)}
              </p>
              {xpAwarded > 0 && (
                <span className="mt-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  +{xpAwarded} XP diperoleh
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Pembahasan Jawaban</h3>
              {questions.map((q, idx) => {
                const selected = displayAnswers[String(q.id)];
                const isTimeout = selected === null || selected === undefined;
                const isCorrect =
                  !isTimeout &&
                  q.options.some(
                    (o) => o.is_correct && o.option_code === selected
                  );
                const correctOpt = q.options.find((o) => o.is_correct);
                const selectedOpt = q.options.find(
                  (o) => o.option_code === selected
                );

                return (
                  <div
                    key={q.id}
                    className={`flex flex-col gap-3 rounded-xl border p-4 ${
                      isTimeout
                        ? "border-amber-200 bg-amber-50"
                        : isCorrect
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isTimeout ? (
                        <FontAwesomeIcon
                          icon={faClock}
                          className="mt-0.5 h-4 w-4 text-amber-500"
                        />
                      ) : isCorrect ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="mt-0.5 h-4 w-4 text-green-600"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="mt-0.5 h-4 w-4 text-red-600"
                        />
                      )}
                      <p className="text-sm font-semibold">
                        <span className="mr-1 font-normal text-gray-500">
                          {idx + 1}.
                        </span>
                        {q.question}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 pl-6">
                      {isTimeout ? (
                        <p className="text-xs text-amber-700">
                          Waktu habis · Jawaban benar:{" "}
                          <strong>
                            {correctOpt?.option_code.toUpperCase()}.{" "}
                            {correctOpt?.text}
                          </strong>
                        </p>
                      ) : isCorrect ? (
                        <p className="text-xs text-green-700">
                          Jawaban kamu benar:{" "}
                          <strong>
                            {selectedOpt?.option_code.toUpperCase()}.{" "}
                            {selectedOpt?.text}
                          </strong>
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-red-700">
                            Jawaban kamu:{" "}
                            <strong>
                              {selectedOpt?.option_code.toUpperCase()}.{" "}
                              {selectedOpt?.text}
                            </strong>
                          </p>
                          <p className="text-xs text-green-700">
                            Jawaban benar:{" "}
                            <strong>
                              {correctOpt?.option_code.toUpperCase()}.{" "}
                              {correctOpt?.text}
                            </strong>
                          </p>
                        </>
                      )}
                      {q.explanation && (
                        <p className="mt-1 rounded-lg border bg-white/70 px-3 py-2 text-xs text-gray-700">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageContainerAILN>
  );
}
