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
          <h1 className="text-xl font-bold leading-tight">{quiz.name}</h1>
          {quiz.description && (
            <p className="text-sm text-gray-500">{quiz.description}</p>
          )}
        </div>

        {/* Top stats card */}
        <div className="flex flex-wrap items-stretch gap-6 rounded-xl border bg-white p-6">
          {/* Skor */}
          <div className="flex flex-1 flex-col justify-between gap-3 min-w-[200px]">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">
                Skor Kamu
              </span>
              <span
                className={`text-5xl font-bold leading-none ${
                  score >= PASS_THRESHOLD ? "text-gray-900" : "text-gray-900"
                }`}
              >
                {score}%
              </span>
              <p className="text-sm text-gray-600">
                {motivationalMessage(score)}
              </p>
            </div>
            {xp_earned > 0 && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                <FontAwesomeIcon icon={faStar} className="h-3 w-3" />+
                {xp_earned} XP diperoleh
              </span>
            )}
          </div>

          {/* Donut chart */}
          <div className="flex shrink-0 items-center justify-center">
            <DonutChart correct={correctCount} total={totalQuestions} />
          </div>

          {/* Ringkasan Performa */}
          <div className="flex flex-1 flex-col gap-2 min-w-[200px]">
            <span className="text-sm font-semibold text-gray-900">
              Ringkasan Performa
            </span>
            <StatRow
              icon={faFileLines}
              label="Total Pertanyaan"
              value={totalQuestions}
              iconClass="text-gray-500"
            />
            <StatRow
              icon={faCircleCheck}
              label="Benar"
              value={correctCount}
              iconClass="text-emerald-600"
              valueClass="text-emerald-600"
            />
            <StatRow
              icon={faCircleXmark}
              label="Salah"
              value={wrongCount + unansweredCount}
              iconClass="text-red-500"
              valueClass="text-red-500"
            />
            <StatRow
              icon={faChartPie}
              label="Akurasi"
              value={`${accuracy}%`}
              iconClass="text-gray-500"
            />
          </div>
        </div>

        {/* Pembahasan Jawaban */}
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold">Pembahasan Jawaban</h3>
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
              badgeCls = "border border-amber-200 bg-amber-50 text-amber-700";
              badgeIcon = faCircleXmark;
              badgeLabel = "Belum Dijawab";
            } else if (isCorrect) {
              badgeCls =
                "border border-emerald-200 bg-emerald-50 text-emerald-700";
              badgeIcon = faCircleCheck;
              badgeLabel = "Benar";
            } else {
              badgeCls = "border border-red-200 bg-red-50 text-red-600";
              badgeIcon = faCircleXmark;
              badgeLabel = "Salah";
            }

            return (
              <div
                key={q.id}
                className="flex items-start gap-4 rounded-xl border bg-white p-5"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {idx + 1}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {q.question}
                  </p>

                  <div className="flex flex-col gap-1">
                    {!isUnanswered && (
                      <p className="flex items-baseline gap-2 text-xs">
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className={`h-3 w-3 ${
                            isCorrect ? "text-emerald-600" : "text-red-500"
                          }`}
                        />
                        <span
                          className={
                            isCorrect ? "text-emerald-700" : "text-red-600"
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
                        className="h-3 w-3 text-emerald-600"
                      />
                      <span className="text-emerald-700">
                        Jawaban benar:{" "}
                        <strong>
                          {correctOpt?.option_code.toUpperCase()}.{" "}
                          {correctOpt?.text}
                        </strong>
                      </span>
                    </p>
                  </div>

                  {q.explanation && (
                    <p className="rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-700">
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
  iconClass = "text-gray-500",
  valueClass = "text-gray-900",
}: {
  icon: typeof faFileLines;
  label: string;
  value: number | string;
  iconClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm text-gray-700">
        <FontAwesomeIcon icon={icon} className={`h-3.5 w-3.5 ${iconClass}`} />
        {label}
      </span>
      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function DonutChart({ correct, total }: { correct: number; total: number }) {
  const radius = 56;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const ratio = total > 0 ? correct / total : 0;
  const offset = circumference * (1 - ratio);
  const size = radius * 2;

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
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#111827"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none text-gray-900">
          {correct}/{total}
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-gray-500">
          Benar
        </span>
      </div>
    </div>
  );
}
