"use client";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { trpc } from "@/trpc/client";
import {
  faChartPie,
  faCircleCheck,
  faCircleXmark,
  faFileLines,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const PASS_THRESHOLD = 70;

function motivationalMessage(score: number): string {
  if (score === 100) return "Sempurna! Luar biasa.";
  if (score >= 80) return "Bagus sekali!";
  if (score >= 70) return "Lulus! Terus semangat.";
  if (score >= 50) return "Hampir! Pelajari lagi materinya.";
  return "Pelajari lagi materinya, kamu pasti bisa!";
}

interface QuizOption {
  id: number;
  option_code: string;
  text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  explanation: string | null;
  order_index: number;
  xp_reward: number;
  options: QuizOption[];
}

interface QuizResultPayload {
  quiz: {
    id: string;
    name: string;
    description: string | null;
    chapter: { id: number; name: string } | null;
  };
  questions: QuizQuestion[];
  submission: {
    attempt_number: number;
    score: number;
    answers: unknown;
    submitted_at: Date | string;
  };
  xp_earned: number;
}

interface QuizResultAILNProps {
  quizId: string;
}

export default function QuizResultAILN({ quizId }: QuizResultAILNProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const isDark = mounted && resolvedTheme === "dark";

  const { data, isLoading, isError } = trpc.ailene.read.quizResult.useQuery({
    quiz_id: quizId,
  });

  if (isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  const d = data as unknown as QuizResultPayload | undefined;
  if (isError || !d?.quiz) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  const { quiz, questions, submission, xp_earned } = d;
  const score = submission.score;
  const answers: Record<string, string | null> =
    submission.answers &&
    typeof submission.answers === "object" &&
    submission.answers !== null
      ? (submission.answers as Record<string, string | null>)
      : {};

  // Hitung statistik
  const totalQuestions = questions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  for (const q of questions) {
    const sel = answers[String(q.id)];
    if (sel === null || sel === undefined) {
      unansweredCount += 1;
    } else if (q.options.some((o) => o.is_correct && o.option_code === sel)) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
  }
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-4">
        {/* Header bar */}
        <div className="flex flex-1 flex-col">
          <h1 className="text-xl font-bold leading-tight dark:text-white">
            {quiz.name}
          </h1>
          {quiz.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Top stats card */}
        <div className="flex flex-wrap items-stretch gap-6 rounded-xl border bg-white p-6 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
          {/* Skor */}
          <div className="flex flex-1 flex-col justify-between gap-3 min-w-[200px]">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Skor Kamu
              </span>
              <span
                className={`text-5xl font-bold leading-none ${
                  score >= PASS_THRESHOLD
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {score}%
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {motivationalMessage(score)}
              </p>
            </div>
            {xp_earned > 0 && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-amber-500/10 dark:text-amber-300 dark:border dark:border-amber-500/40">
                <FontAwesomeIcon
                  icon={faStar}
                  className="h-3 w-3 dark:drop-shadow-[0_0_4px_rgba(251,191,36,0.7)]"
                />
                +{xp_earned} XP diperoleh
              </span>
            )}
          </div>

          {/* Donut chart */}
          <div className="flex shrink-0 items-center justify-center">
            <DonutChart
              correct={correctCount}
              total={totalQuestions}
              isDark={isDark}
            />
          </div>

          {/* Ringkasan Performa */}
          <div className="flex flex-1 flex-col gap-2 min-w-[200px]">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Ringkasan Performa
            </span>
            <StatRow
              icon={faFileLines}
              label="Total Pertanyaan"
              value={totalQuestions}
              iconClass="text-gray-500 dark:text-gray-400"
            />
            <StatRow
              icon={faCircleCheck}
              label="Benar"
              value={correctCount}
              iconClass="text-green-700 dark:text-green-400"
              valueClass="text-green-700 dark:text-green-400"
            />
            <StatRow
              icon={faCircleXmark}
              label="Salah"
              value={wrongCount + unansweredCount}
              iconClass="text-red-600 dark:text-red-400"
              valueClass="text-red-600 dark:text-red-400"
            />
            <StatRow
              icon={faChartPie}
              label="Akurasi"
              value={`${accuracy}%`}
              iconClass="text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        {/* Pembahasan Jawaban */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold dark:text-white">
            Pembahasan Jawaban
          </h3>
          {questions.map((q, idx) => {
            const selected = answers[String(q.id)];
            const isUnanswered = selected === null || selected === undefined;
            const isCorrect =
              !isUnanswered &&
              q.options.some((o) => o.is_correct && o.option_code === selected);
            const correctOpt = q.options.find((o) => o.is_correct);
            const selectedOpt = q.options.find(
              (o) => o.option_code === selected
            );

            let badgeCls = "";
            let badgeIcon = faCircleCheck;
            let badgeLabel = "";
            if (isUnanswered) {
              badgeCls =
                "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300";
              badgeIcon = faCircleXmark;
              badgeLabel = "Belum Dijawab";
            } else if (isCorrect) {
              badgeCls =
                "border border-green-200 bg-green-100 text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-400";
              badgeIcon = faCircleCheck;
              badgeLabel = "Benar";
            } else {
              badgeCls =
                "border border-red-200 bg-red-100 text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400";
              badgeIcon = faCircleXmark;
              badgeLabel = "Salah";
            }

            return (
              <div
                key={q.id}
                className="flex items-start gap-4 rounded-xl border bg-white p-5 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white dark:bg-red-500/20 dark:text-red-100 dark:border dark:border-red-500/40">
                  {idx + 1}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {q.question}
                  </p>

                  <div className="flex flex-col gap-1">
                    {!isUnanswered && (
                      <p className="flex items-baseline gap-2 text-xs">
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className={`h-3 w-3 ${
                            isCorrect
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        />
                        <span
                          className={
                            isCorrect
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          Jawaban kamu:{" "}
                          <strong>
                            {selectedOpt?.option_code.toUpperCase()}.{" "}
                            {selectedOpt?.text}
                          </strong>
                        </span>
                      </p>
                    )}
                    <p className="flex items-baseline gap-2 text-xs">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="h-3 w-3 text-green-700 dark:text-green-400"
                      />
                      <span className="text-green-700 dark:text-green-400">
                        Jawaban benar:{" "}
                        <strong>
                          {correctOpt?.option_code.toUpperCase()}.{" "}
                          {correctOpt?.text}
                        </strong>
                      </span>
                    </p>
                  </div>

                  {q.explanation && (
                    <p className="rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-700 dark:border-dashboard-border dark:bg-card-inside-bg dark:text-gray-300">
                      <strong className="font-semibold">Penjelasan: </strong>
                      {q.explanation}
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeCls}`}
                >
                  <FontAwesomeIcon icon={badgeIcon} className="h-3 w-3" />
                  {badgeLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainerAILN>
  );
}

function StatRow({
  icon,
  label,
  value,
  iconClass = "text-gray-500 dark:text-gray-400",
  valueClass = "text-gray-900 dark:text-white",
}: {
  icon: typeof faFileLines;
  label: string;
  value: number | string;
  iconClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <FontAwesomeIcon icon={icon} className={`h-3.5 w-3.5 ${iconClass}`} />
        {label}
      </span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function DonutChart({
  correct,
  total,
  isDark,
}: {
  correct: number;
  total: number;
  isDark: boolean;
}) {
  const radius = 56;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const ratio = total > 0 ? correct / total : 0;
  const offset = circumference * (1 - ratio);
  const size = radius * 2;

  const trackColor = isDark ? "#202229" : "#E5E7EB";
  const progressColor = isDark ? "#ef4444" : "#111827";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={progressColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none text-gray-900 dark:text-white">
          {correct}/{total}
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
          Benar
        </span>
      </div>
    </div>
  );
}
