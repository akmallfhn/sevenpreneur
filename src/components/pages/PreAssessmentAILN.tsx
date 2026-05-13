"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AppAlertConfirmDialog from "@/components/modals/AppAlertConfirmDialog";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import {
  PRE_ASSESSMENT_CATEGORY_COLORS,
  PRE_ASSESSMENT_QUESTIONS,
  PRE_ASSESSMENT_TYPE_LABELS,
  PreAssessmentQuestion,
} from "@/lib/pre-assessment-questions";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  faCheckCircle,
  faChevronLeft,
  faChevronRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type AnswerValue = string | string[] | null;
type AnswerMap = Record<string, AnswerValue>;

interface PreAssessmentAILNProps {
  sessionToken: string;
}

function isAnswered(q: PreAssessmentQuestion, v: AnswerValue): boolean {
  if (v == null) return false;
  if (q.type === "multi") return Array.isArray(v) && v.length > 0;
  return typeof v === "string" && v.trim().length > 0;
}

export default function PreAssessmentAILN({
  sessionToken,
}: PreAssessmentAILNProps) {
  const utils = trpc.useUtils();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data, isLoading, isError } =
    trpc.ailene.read.myPreAssessment.useQuery();

  const submittedRef = useRef(false);

  const [answers, setAnswers] = useState<AnswerMap>(() => {
    const init: AnswerMap = {};
    for (const q of PRE_ASSESSMENT_QUESTIONS) {
      init[q.field] = q.type === "multi" ? [] : null;
    }
    return init;
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const totalQuestions = PRE_ASSESSMENT_QUESTIONS.length;
  const currentQ = PRE_ASSESSMENT_QUESTIONS[currentIdx];

  const answeredCount = useMemo(
    () =>
      PRE_ASSESSMENT_QUESTIONS.filter((q) => isAnswered(q, answers[q.field]))
        .length,
    [answers]
  );

  const missingRequired = useMemo(
    () =>
      PRE_ASSESSMENT_QUESTIONS.filter(
        (q) => q.required && !isAnswered(q, answers[q.field])
      ),
    [answers]
  );

  const submitMutation = trpc.ailene.submitPreAssessment.useMutation({
    onSuccess: () => {
      utils.ailene.read.myPreAssessment.invalidate();
      toast.success("Pre-assessment berhasil dikirim.");
    },
    onError: (err) => {
      submittedRef.current = false;
      toast.error(err.message || "Gagal mengirim pre-assessment.");
    },
  });

  if (isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  if (isError || !data) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  if (data.pre_assessment) {
    return <PreAssessmentCompletedAILN />;
  }

  const handleSelectSingle = (code: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.field]: code }));
  };

  const handleToggleMulti = (label: string) => {
    setAnswers((prev) => {
      const cur = (prev[currentQ.field] as string[] | null) ?? [];
      const next = cur.includes(label)
        ? cur.filter((x) => x !== label)
        : [...cur, label];
      return { ...prev, [currentQ.field]: next };
    });
  };

  const handleTextChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.field]: value.length > 0 ? value : null,
    }));
  };

  const handlePrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1));

  const requestSubmit = () => {
    if (missingRequired.length > 0) {
      toast.error(
        `Masih ada ${missingRequired.length} pertanyaan wajib yang belum dijawab.`
      );
      setCurrentIdx(
        PRE_ASSESSMENT_QUESTIONS.findIndex(
          (q) => q.id === missingRequired[0].id
        )
      );
      return;
    }
    setIsSubmitDialogOpen(true);
  };

  const confirmSubmit = () => {
    if (submittedRef.current) return;
    setIsSubmitDialogOpen(false);
    submittedRef.current = true;

    const payload = {
      q1_ai_use_frequency: answers.q1_ai_use_frequency as
        | "NEVER"
        | "TRIED"
        | "WEEKLY"
        | "DAILY"
        | "INTENSIVE",
      q2_ai_tools_used: (answers.q2_ai_tools_used as string[]) ?? [],
      q3_job_role: (answers.q3_job_role as string) ?? "",
      q4_ai_understanding: answers.q4_ai_understanding as
        | "NONE"
        | "AWARE"
        | "BASIC"
        | "EXPLAIN"
        | "EXPERT",
      q5_ai_limitations: (answers.q5_ai_limitations as string[]) ?? [],
      q6_output_review: answers.q6_output_review as
        | "NO_CHECK"
        | "SOMETIMES"
        | "ALWAYS"
        | "CROSS_CHECK"
        | "NO_USE",
      q7_use_cases: (answers.q7_use_cases as string[]) ?? [],
      q8_team_adoption: answers.q8_team_adoption as
        | "NONE"
        | "PERSONAL"
        | "PILOT"
        | "POLICY"
        | "INTEGRATED",
      q9_concrete_example:
        (answers.q9_concrete_example as string | null) ?? null,
      q10_prompt_comfort: answers.q10_prompt_comfort as
        | "NONE"
        | "BASIC"
        | "DECENT"
        | "STRUCTURED"
        | "EXPERT",
      q11_safety_practices: (answers.q11_safety_practices as string[]) ?? [],
      q12_professional_attitude: answers.q12_professional_attitude as
        | "TOO_RISKY"
        | "CAUTIOUS"
        | "NEUTRAL"
        | "SUPPORTIVE"
        | "ESSENTIAL",
      q13_biggest_challenge: (answers.q13_biggest_challenge as string) ?? "",
      q14_training_expectation:
        (answers.q14_training_expectation as string) ?? "",
      q15_motivation: answers.q15_motivation as
        | "MANDATORY"
        | "CURIOUS"
        | "TENTATIVE"
        | "READY"
        | "EAGER",
    };

    submitMutation.mutate(payload);
  };

  const isLast = currentIdx === totalQuestions - 1;
  const progressPct = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 rounded-xl border bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <h1 className="text-base font-semibold">
                Pre-Assessment AI Readiness
              </h1>
              <p className="text-xs text-gray-500">
                Bantu kami memahami posisi awalmu sebelum pelatihan. Jawaban
                kamu hanya disimpan satu kali — tidak bisa diubah setelah
                dikirim.
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Soal {currentIdx + 1} / {totalQuestions}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {answeredCount} / {totalQuestions} terjawab ({progressPct}%)
            </span>
          </div>
          <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full">
            {PRE_ASSESSMENT_QUESTIONS.map((q, idx) => {
              const ans = isAnswered(q, answers[q.field]);
              return (
                <div
                  key={idx}
                  className={`h-full flex-1 ${
                    ans ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Main body */}
        <div className="flex flex-1 gap-4">
          {/* Left: question */}
          <div className="flex flex-1 flex-col gap-4 rounded-xl border bg-white p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                SOAL {currentIdx + 1}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  PRE_ASSESSMENT_CATEGORY_COLORS[currentQ.category]
                }`}
              >
                {currentQ.category}
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                {PRE_ASSESSMENT_TYPE_LABELS[currentQ.type]}
              </span>
              {!currentQ.required && (
                <span className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                  Opsional
                </span>
              )}
            </div>

            <p className="text-[17px] font-semibold leading-snug text-gray-900">
              {currentQ.question}
              {currentQ.required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </p>

            <QuestionBody
              question={currentQ}
              value={answers[currentQ.field]}
              onSelectSingle={handleSelectSingle}
              onToggleMulti={handleToggleMulti}
              onTextChange={handleTextChange}
            />

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
              {isLast ? (
                <ButtonAILN
                  onClick={requestSubmit}
                  disabled={submitMutation.isPending}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" />
                  {submitMutation.isPending ? "Mengirim..." : "Kirim Jawaban"}
                </ButtonAILN>
              ) : (
                <ButtonAILN onClick={handleNext}>
                  Berikutnya
                  <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
                </ButtonAILN>
              )}
            </div>
          </div>

          {/* Right: navigation panel */}
          <div className="flex w-80 shrink-0 flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-xl border bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                NAVIGASI SOAL
              </span>
              <div className="grid grid-cols-5 gap-2">
                {PRE_ASSESSMENT_QUESTIONS.map((q, idx) => {
                  const isCurrent = idx === currentIdx;
                  const ans = isAnswered(q, answers[q.field]);

                  let cls = "";
                  if (isCurrent) {
                    cls = "bg-red-500 text-white";
                  } else if (ans) {
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
                      title={q.question}
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

            <div className="flex flex-col gap-2 rounded-xl border bg-white p-4">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                STATUS
              </span>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Terjawab</span>
                <span className="font-semibold text-gray-900">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Wajib belum diisi</span>
                <span
                  className={`font-semibold ${
                    missingRequired.length === 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {missingRequired.length}
                </span>
              </div>
            </div>

            <ButtonAILN
              onClick={requestSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? "Mengirim..." : "Kirim Jawaban"}
            </ButtonAILN>
          </div>
        </div>
      </div>

      <AppAlertConfirmDialog
        isOpen={isSubmitDialogOpen}
        alertDialogHeader="Kirim pre-assessment sekarang?"
        alertDialogMessage="Jawaban hanya bisa dikirim satu kali dan tidak bisa diubah setelahnya. Pastikan semua jawabanmu sudah sesuai."
        alertCancelLabel="Periksa lagi"
        alertConfirmLabel="Kirim sekarang"
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={confirmSubmit}
      />
    </PageContainerAILN>
  );
}

function QuestionBody({
  question,
  value,
  onSelectSingle,
  onToggleMulti,
  onTextChange,
}: {
  question: PreAssessmentQuestion;
  value: AnswerValue;
  onSelectSingle: (code: string) => void;
  onToggleMulti: (label: string) => void;
  onTextChange: (value: string) => void;
}) {
  if (question.type === "single") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          Pilih satu jawaban yang paling tepat.
        </p>
        {question.options.map((opt, idx) => {
          const code = question.valueCodes[idx];
          const selected = value === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onSelectSingle(code)}
              className={`flex items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 text-left text-sm transition ${
                selected
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  selected
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "multi") {
    const arr = (value as string[] | null) ?? [];
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          Pilih semua jawaban yang sesuai (boleh lebih dari satu).
        </p>
        {question.options.map((opt) => {
          const selected = arr.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggleMulti(opt)}
              className={`flex items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 text-left text-sm transition ${
                selected
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-white hover:border-black/30 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                  selected
                    ? "bg-emerald-500 text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {selected ? "✓" : ""}
              </div>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "short") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">Tuliskan jawaban singkat.</p>
        <input
          type="text"
          value={(value as string | null) ?? ""}
          onChange={(e) => onTextChange(e.target.value)}
          maxLength={255}
          placeholder={question.placeholder}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-emerald-500 focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-500">
        Tuliskan jawabanmu dengan lebih lengkap.
      </p>
      <textarea
        value={(value as string | null) ?? ""}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={question.placeholder}
        rows={6}
        className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-emerald-500 focus:outline-none"
      />
    </div>
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

function PreAssessmentCompletedAILN() {
  const router = useRouter();
  return (
    <PageContainerAILN>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-xl border bg-white p-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <FontAwesomeIcon icon={faCheckCircle} className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold leading-tight">
          Pre-assessment sudah selesai
        </h1>
        <p className="text-sm text-gray-600">
          Terima kasih! Jawabanmu sudah tersimpan dan tidak perlu diisi ulang.
          Sekarang kamu bisa lanjut ke modul pelatihan.
        </p>
        <ButtonAILN onClick={() => router.push("/student")}>
          Kembali ke Dashboard
        </ButtonAILN>
      </div>
    </PageContainerAILN>
  );
}
