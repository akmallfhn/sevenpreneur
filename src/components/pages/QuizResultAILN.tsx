"use client";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { trpc } from "@/trpc/client";
import {
  faCircleCheck,
  faCircleXmark,
  faClock,
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

  return (
    <PageContainerAILN>
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">{quiz.name}</h1>
          {quiz.description && (
            <p className="text-sm text-gray-500">{quiz.description}</p>
          )}
        </div>

        <div
          className={`flex flex-col items-center gap-2 rounded-xl border p-8 text-center ${
            score >= PASS_THRESHOLD
              ? "border-green-300 bg-green-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          <span
            className={`text-[52px] font-bold leading-none ${
              score >= PASS_THRESHOLD ? "text-green-600" : "text-red-600"
            }`}
          >
            {score}%
          </span>
          <p className="text-[15px] text-gray-700">
            {motivationalMessage(score)}
          </p>
          {xp_earned > 0 && (
            <span className="mt-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              +{xp_earned} XP diperoleh
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Pembahasan Jawaban</h3>
          {questions.map((q, idx) => {
            const selected = answers[String(q.id)];
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
                      Belum dijawab · Jawaban benar:{" "}
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
    </PageContainerAILN>
  );
}
