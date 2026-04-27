"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { BookCheck, ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: unknown;
  correct_option: string;
  explanation: string | null;
  lesson_id: number;
  order_index: number;
}

interface QuizAileneProps {
  lessonId: number;
}

type QuizState = "answering" | "result";

export default function QuizAilene(props: QuizAileneProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizState, setQuizState] = useState<QuizState>("answering");
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    xp_awarded: number;
    perQuestion: {
      correct: boolean;
      correct_option: string;
      explanation?: string | null;
    }[];
  } | null>(null);

  const {
    data: questionsData,
    isLoading,
    isError,
  } = trpc.ailene.listQuizQuestionsForUser.useQuery({
    lesson_id: props.lessonId,
  });

  const submitMutation = trpc.ailene.submitQuiz.useMutation({
    onSuccess: (data) => {
      utils.ailene.myProgress.invalidate();
      utils.ailene.listLessonsWithProgress.invalidate();
      if (data.passed) {
        toast.success(`Lulus! Kamu mendapat +${data.xp_awarded} XP 🎉`);
      } else {
        toast.error(`Belum lulus. Skor: ${data.score}%. Coba lagi!`);
      }
    },
    onError: () => toast.error("Terjadi kesalahan. Coba lagi."),
  });

  const questions = (questionsData?.list ?? []) as QuizQuestion[];
  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[String(q.id)] !== undefined);

  const handleSubmit = () => {
    if (!allAnswered) {
      toast.warning("Jawab semua soal terlebih dahulu.");
      return;
    }

    const correct = questions.filter(
      (q) => answers[String(q.id)] === q.correct_option
    ).length;
    const score = Math.round((correct / questions.length) * 100);

    const perQuestion = questions.map((q) => ({
      correct: answers[String(q.id)] === q.correct_option,
      correct_option: q.correct_option,
      explanation: q.explanation,
    }));

    submitMutation.mutate(
      { lesson_id: props.lessonId, score },
      {
        onSuccess: (data) => {
          setResult({
            score: data.score,
            passed: data.passed,
            xp_awarded: data.xp_awarded,
            perQuestion,
          });
          setQuizState("result");
        },
      }
    );
  };

  const handleRetry = () => {
    setAnswers({});
    setQuizState("answering");
    setResult(null);
  };

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-2xl mx-auto w-full flex flex-col gap-6 px-8">
        <Link href={`/lessons/${props.lessonId}`}>
          <AppButton variant="light" size="small">
            <ChevronLeft className="size-3.5" />
            Kembali ke Materi
          </AppButton>
        </Link>

        {isLoading && <AppLoadingComponents />}

        {isError && (
          <div className="flex flex-col gap-2 py-20 items-center text-center">
            <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white">
              Gagal memuat soal quiz.
            </p>
            <p className="font-bodycopy text-xs text-emphasis">
              Coba reload halaman ini.
            </p>
          </div>
        )}

        {!isLoading && !isError && quizState === "answering" && (
          <>
            <div className="flex flex-col gap-1">
              <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal">
                Quiz
              </h1>
              <p className="font-bodycopy text-sm text-emphasis">
                {questions.length} soal · Nilai minimum 70% untuk lulus
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {questions.map((q, idx) => {
                const options: QuizOption[] = Array.isArray(q.options) ? (q.options as QuizOption[]) : [];
                return (
                  <div
                    key={q.id}
                    className="flex flex-col gap-3 p-5 rounded-xl border border-sevenpreneur-ash"
                  >
                    <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">
                      <span className="text-primary mr-1">{idx + 1}.</span>
                      {q.question}
                    </p>
                    <div className="flex flex-col gap-2">
                      {options.map((opt) => {
                        const isSelected = answers[String(q.id)] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [String(q.id)]: opt.id,
                              }))
                            }
                            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition font-bodycopy text-sm ${
                              isSelected
                                ? "border-primary bg-primary-muted text-primary font-semibold"
                                : "border-sevenpreneur-ash hover:border-primary/40 hover:bg-section-background text-sevenpreneur-coal"
                            }`}
                          >
                            <div
                              className={`flex shrink-0 size-5 rounded-full border-2 items-center justify-center ${
                                isSelected
                                  ? "border-primary"
                                  : "border-sevenpreneur-ash"
                              }`}
                            >
                              {isSelected && (
                                <div className="size-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                            <span>
                              {opt.id.toUpperCase()}. {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <AppButton
              variant="primary"
              size="medium"
              onClick={handleSubmit}
              disabled={!allAnswered || submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                "Submit Jawaban"
              )}
            </AppButton>
          </>
        )}

        {!isLoading && quizState === "result" && result && (
          <>
            <div
              className={`flex flex-col gap-3 p-6 rounded-xl border ${
                result.passed
                  ? "border-success bg-success-background"
                  : "border-danger bg-danger-background"
              }`}
            >
              {result.passed ? (
                <BookCheck className="size-8 text-success" />
              ) : (
                <XCircle className="size-8 text-danger" />
              )}
              <h2 className="font-brand font-bold text-2xl text-sevenpreneur-coal">
                {result.passed
                  ? "Selamat, kamu lulus! 🎉"
                  : "Belum lulus, coba lagi!"}
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Skor kamu: <strong>{result.score}%</strong>
                {result.passed && result.xp_awarded > 0 && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="text-primary font-semibold">
                      +{result.xp_awarded} XP diperoleh
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Per-question review */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">
                Pembahasan Jawaban
              </h3>
              {questions.map((q, idx) => {
                const review = result.perQuestion[idx];
                const options: QuizOption[] = Array.isArray(q.options) ? (q.options as QuizOption[]) : [];
                return (
                  <div
                    key={q.id}
                    className={`flex flex-col gap-3 p-4 rounded-xl border ${
                      review.correct
                        ? "border-success/40 bg-success-background/20"
                        : "border-danger/40 bg-danger-background/20"
                    }`}
                  >
                    <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal">
                      <span
                        className={`mr-1 ${review.correct ? "text-success" : "text-danger"}`}
                      >
                        {idx + 1}.
                      </span>
                      {q.question}
                    </p>
                    <p className="font-bodycopy text-xs text-emphasis">
                      Jawaban benar:{" "}
                      <strong className="text-success">
                        {
                          options.find((o) => o.id === review.correct_option)
                            ?.text
                        }
                      </strong>
                    </p>
                    {review.explanation && (
                      <p className="font-bodycopy text-xs text-sevenpreneur-coal bg-white/70 rounded-lg p-3 border border-black/5">
                        {review.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <AppButton
                variant="primarySoft"
                size="medium"
                onClick={handleRetry}
              >
                Coba Lagi
              </AppButton>
              <Link href="/">
                <AppButton variant="primary" size="medium">
                  Kembali ke Dashboard
                </AppButton>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
