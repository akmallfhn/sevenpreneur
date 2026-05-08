"use client";

import { BARI_QUESTIONS, BariQuestion } from "@/lib/bari-questions";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  BariAssessmentStatusEnum,
  BariRevenueModelEnum,
  NumEmployeeEnum,
} from "@prisma/client";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Industry = { id: number; name: string };

type AnswerValue = {
  option_codes?: string[];
  text_answer?: string;
};

interface BARIAssessmentSVPProps {
  sessionToken: string;
  industries: Industry[];
}

const TEAM_SIZE_OPTIONS: { value: NumEmployeeEnum; label: string }[] = [
  { value: "SMALL", label: "Solo or 2 people" },
  { value: "MEDIUM", label: "3–10 people" },
  { value: "LARGE", label: "11–50 people" },
  { value: "XLARGE", label: "51–200 people" },
  { value: "XXLARGE", label: "More than 200 people" },
];

const REVENUE_MODEL_OPTIONS: { value: BariRevenueModelEnum; label: string }[] =
  [
    { value: "PRODUCTS", label: "Selling products (physical or digital)" },
    { value: "SERVICES", label: "Selling services or expertise" },
    { value: "SUBSCRIPTION", label: "Subscription or recurring contracts" },
    { value: "MARKETPLACE", label: "Marketplace or platform fees" },
    { value: "MIXED", label: "A mix of the above" },
  ];

const PILLAR_LABEL: Record<string, string> = {
  data_foundation: "Data Foundation",
  process_digitisation: "Process Digitisation",
  ai_adoption_baseline: "AI Adoption Baseline",
  team_readiness: "Team & Leadership Readiness",
  ai_search_visibility: "AI Search Visibility",
  disruption_exposure: "Disruption Exposure",
};

export default function BARIAssessmentSVP(props: BARIAssessmentSVPProps) {
  const router = useRouter();
  const stage1Questions = useMemo(
    () => BARI_QUESTIONS.filter((q) => q.stage === 1),
    []
  );
  const totalSteps = 1 + stage1Questions.length;

  // Step 0 = intake. Step 1..N = question (index = step - 1).
  const [step, setStep] = useState(0);
  const [intake, setIntake] = useState<{
    industry_id: number | null;
    team_size: NumEmployeeEnum | null;
    revenue_model: BariRevenueModelEnum | null;
  }>({
    industry_id: null,
    team_size: null,
    revenue_model: null,
  });
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  useEffect(() => {
    if (props.sessionToken) setSessionToken(props.sessionToken);
  }, [props.sessionToken]);

  const submitMutation = trpc.create.bari.assessment.useMutation({
    onSuccess: (data) => {
      toast.success("Assessment submitted.");
      router.push(`/business-ai-readiness-index/assesments/${data.assessment.id}`);
    },
    onError: (e) =>
      toast.error("Failed to submit assessment.", { description: e.message }),
  });

  const intakeComplete =
    intake.industry_id != null &&
    intake.team_size != null &&
    intake.revenue_model != null;

  const currentQuestion: BariQuestion | undefined =
    step >= 1 ? stage1Questions[step - 1] : undefined;

  const currentAnswer = currentQuestion
    ? answers[currentQuestion.code]
    : undefined;

  const isCurrentAnswered = (() => {
    if (!currentQuestion) return false;
    if (!currentAnswer) {
      // Open text questions are skippable
      return (
        currentQuestion.format === "open_text" ||
        currentQuestion.format === "url"
      );
    }
    switch (currentQuestion.format) {
      case "mc_single":
      case "mc_multi":
        return (currentAnswer.option_codes ?? []).length > 0;
      case "open_text":
      case "url":
        return true;
      case "likert":
        return false; // not in stage 1
    }
  })();

  function setAnswer(code: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [code]: value }));
  }

  function handleNext() {
    if (step === 0) {
      if (!intakeComplete) return;
      setStep(1);
      return;
    }
    if (step < totalSteps - 1) {
      setStep(step + 1);
      return;
    }
    handleSubmit();
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleSubmit() {
    const answerPayload = Object.entries(answers)
      .filter(([, v]) => {
        if (v.option_codes && v.option_codes.length > 0) return true;
        if (v.text_answer && v.text_answer.trim().length > 0) return true;
        return false;
      })
      .map(([question_code, v]) => ({
        question_code,
        option_codes: v.option_codes,
        text_answer: v.text_answer?.trim() ? v.text_answer.trim() : undefined,
      }));

    if (answerPayload.length === 0) {
      toast.error("Please answer at least one question before submitting.");
      return;
    }

    submitMutation.mutate({
      industry_id: intake.industry_id ?? undefined,
      team_size: intake.team_size ?? undefined,
      revenue_model: intake.revenue_model ?? undefined,
      status: BariAssessmentStatusEnum.COMPLETED,
      answers: answerPayload,
    });
  }

  // Progress percentage: count intake as 1 unit + answered questions out of total stage-1 questions
  const progressPct = (() => {
    const completedUnits = step;
    return Math.round((completedUnits / totalSteps) * 100);
  })();

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "#0a0908", color: "#f5f4f0" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="rounded-[20px] overflow-hidden bg-[#111110] border border-[#2a2826]">
          {/* App bar */}
          <div className="h-[60px] bg-[#0a0908]/90 backdrop-blur border-b border-[#2a2826] flex items-center justify-between px-6">
            <span className="font-cormorant text-lg font-medium text-[#f5f4f0] tracking-[0.3px]">
              BARI
            </span>

            {step >= 1 && currentQuestion && (
              <div className="flex-1 max-w-[320px] mx-6">
                <div className="font-jetbrains text-[9px] tracking-[2px] uppercase text-[#8a8780] mb-1.5">
                  Question {step} of {stage1Questions.length}
                </div>
                <div className="h-px bg-[#2a2826] rounded-full overflow-hidden">
                  <div
                    className="h-px rounded-full"
                    style={{
                      width: `${progressPct}%`,
                      background:
                        "linear-gradient(90deg, #6e6c66, #f5f4f0)",
                    }}
                  />
                </div>
              </div>
            )}
            {step === 0 && <div className="flex-1" />}

            <span className="flex items-center gap-1.5 font-jetbrains text-[9px] text-[#7a9b7e] tracking-[1.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7a9b7e]" />
              {submitMutation.isPending ? "Submitting" : "Auto-saving"}
            </span>
          </div>

          {/* Step content */}
          {step === 0 ? (
            <IntakeStep
              industries={props.industries}
              value={intake}
              onChange={setIntake}
            />
          ) : currentQuestion ? (
            currentQuestion.format === "mc_single" ||
            currentQuestion.format === "mc_multi" ? (
              <MCQuestionStep
                question={currentQuestion}
                stepIndex={step}
                totalSteps={stage1Questions.length}
                value={currentAnswer?.option_codes ?? []}
                onChange={(option_codes) =>
                  setAnswer(currentQuestion.code, { option_codes })
                }
              />
            ) : (
              <OpenTextStep
                question={currentQuestion}
                stepIndex={step}
                totalSteps={stage1Questions.length}
                value={currentAnswer?.text_answer ?? ""}
                onChange={(text_answer) =>
                  setAnswer(currentQuestion.code, { text_answer })
                }
                onSkip={() =>
                  setAnswers((prev) => {
                    const next = { ...prev };
                    delete next[currentQuestion.code];
                    return next;
                  })
                }
              />
            )
          ) : null}

          {/* Footer nav */}
          <div className="px-10 md:px-16 pb-10 md:pb-14 -mt-2">
            <div className="flex items-center justify-between pt-8 border-t border-[#1f1d1b]">
              {step === 0 ? (
                <span className="font-jetbrains text-[9px] tracking-[1.5px] text-[#5a5853]">
                  Your data is never sold or shared.
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={submitMutation.isPending}
                  className="inline-flex items-center gap-2 font-medium font-read rounded-full px-6 h-10 text-[13px] bg-transparent text-[#c9c6bf] border border-[#3d3a36] hover:border-[#5a5853] hover:text-[#f5f4f0] transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              )}

              {step >= 1 && currentQuestion && (
                <span className="hidden md:block text-[11px] italic text-[#5a5853]">
                  {step === totalSteps - 1
                    ? "Submit when ready"
                    : currentQuestion.format === "mc_single"
                      ? "Select one to continue"
                      : currentQuestion.format === "mc_multi"
                        ? "Select all that apply"
                        : `${stage1Questions.length - step} questions remaining`}
                </span>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  submitMutation.isPending ||
                  (step === 0 && !intakeComplete) ||
                  (step >= 1 && !isCurrentAnswered)
                }
                className="inline-flex items-center justify-center gap-2 font-medium font-read rounded-full px-7 h-11 text-[14px] bg-[#e8e6e1] text-[#0a0908] hover:bg-[#f5f4f0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting…
                  </>
                ) : step === 0 ? (
                  <>
                    Begin assessment
                    <ArrowRight className="size-4" />
                  </>
                ) : step === totalSteps - 1 ? (
                  <>
                    Submit
                    <Check className="size-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────── Step 1: Intake ─────────────

type IntakeData = {
  industry_id: number | null;
  team_size: NumEmployeeEnum | null;
  revenue_model: BariRevenueModelEnum | null;
};

function IntakeStep(props: {
  industries: Industry[];
  value: IntakeData;
  onChange: (v: IntakeData) => void;
}) {
  return (
    <div className="px-10 md:px-16 py-12 md:py-14">
      <div className="font-jetbrains text-[9px] tracking-[3px] uppercase text-[#8a8780] mb-8 flex items-center gap-2.5">
        <span className="w-4 h-px bg-[#5a5853]" />
        Business context
      </div>

      <h1
        className="font-cormorant font-normal text-[#f5f4f0] mb-3"
        style={{
          fontSize: "clamp(36px, 5vw, 52px)",
          lineHeight: 1.02,
          letterSpacing: "-1.5px",
        }}
      >
        Before we begin,
        <br />
        <em className="italic">tell us about your business.</em>
      </h1>
      <p
        className="font-cormorant font-light italic text-[#c9c6bf] mb-12 max-w-[520px]"
        style={{ fontSize: 19, lineHeight: 1.5 }}
      >
        These details shape the analysis. The more specific you are, the more
        useful your results will be.
      </p>

      {/* Industry */}
      <FieldGroup label="Industry">
        <SelectList
          options={props.industries.map((i) => ({
            value: i.id,
            label: i.name,
          }))}
          value={props.value.industry_id}
          onChange={(v) =>
            props.onChange({ ...props.value, industry_id: v as number })
          }
          maxHeight={260}
        />
      </FieldGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <FieldGroup label="Team size">
          <SelectList
            options={TEAM_SIZE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            value={props.value.team_size}
            onChange={(v) =>
              props.onChange({
                ...props.value,
                team_size: v as NumEmployeeEnum,
              })
            }
          />
        </FieldGroup>

        <FieldGroup label="Primary revenue model">
          <SelectList
            options={REVENUE_MODEL_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            value={props.value.revenue_model}
            onChange={(v) =>
              props.onChange({
                ...props.value,
                revenue_model: v as BariRevenueModelEnum,
              })
            }
          />
        </FieldGroup>
      </div>
    </div>
  );
}

function FieldGroup(props: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-read text-[10px] tracking-[2px] uppercase text-[#8a8780] mb-2 font-medium">
        {props.label}
      </div>
      {props.children}
    </div>
  );
}

function SelectList<T extends string | number>(props: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  maxHeight?: number;
}) {
  return (
    <div
      className="bg-[#161513] border border-[#2a2826] rounded-xl flex flex-col overflow-hidden overflow-y-auto"
      style={props.maxHeight ? { maxHeight: props.maxHeight } : undefined}
    >
      {props.options.map((opt, i) => {
        const selected = props.value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => props.onChange(opt.value)}
            className={`text-left px-5 py-3 text-[13px] transition-colors flex items-center justify-between ${
              i < props.options.length - 1
                ? "border-b border-[#1f1d1b]"
                : ""
            } ${
              selected
                ? "bg-[#1c1a17] text-[#f5f4f0]"
                : "text-[#c9c6bf] hover:bg-[#1c1a17] hover:text-[#f5f4f0]"
            }`}
          >
            <span>{opt.label}</span>
            {selected && (
              <span className="font-jetbrains text-[10px] text-[#a8a59f]">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ───────────── Step 2: MC Question ─────────────

function MCQuestionStep(props: {
  question: BariQuestion;
  stepIndex: number;
  totalSteps: number;
  value: string[];
  onChange: (codes: string[]) => void;
}) {
  const isMulti = props.question.format === "mc_multi";
  const overrideOption = props.question.options?.find((o) => o.is_override);

  function toggle(code: string) {
    if (!isMulti) {
      props.onChange([code]);
      return;
    }
    const current = new Set(props.value);
    const isOverride = overrideOption?.code === code;
    if (current.has(code)) {
      current.delete(code);
    } else {
      if (isOverride) {
        // Selecting override clears all others
        props.onChange([code]);
        return;
      }
      // Selecting a regular option clears the override
      if (overrideOption) current.delete(overrideOption.code);
      current.add(code);
      if (props.question.max_select && current.size > props.question.max_select) {
        return;
      }
    }
    props.onChange(Array.from(current));
  }

  const pillarLabel = props.question.pillar
    ? PILLAR_LABEL[props.question.pillar]
    : null;

  return (
    <div className="px-10 md:px-16 py-12 md:py-14">
      <div className="flex items-center gap-5 mb-14">
        <span className="font-jetbrains text-[9px] tracking-[2px] uppercase text-[#8a8780] whitespace-nowrap">
          Stage 1
        </span>
        <div className="flex-1 h-px bg-[#2a2826] rounded-full overflow-hidden">
          <div
            className="h-px rounded-full"
            style={{
              width: `${(props.stepIndex / props.totalSteps) * 100}%`,
              background: "linear-gradient(90deg, #6e6c66, #f5f4f0)",
            }}
          />
        </div>
        <span className="font-jetbrains text-[9px] tracking-[2px] uppercase text-[#8a8780] whitespace-nowrap">
          {props.stepIndex} / {props.totalSteps}
        </span>
      </div>

      {pillarLabel && (
        <div className="inline-flex items-center gap-2 font-jetbrains text-[9px] tracking-[2.5px] uppercase text-[#5a5853] mb-5">
          <span className="w-1 h-1 rounded-full bg-[#5a5853]" />
          {pillarLabel}
        </div>
      )}

      <div
        className="font-cormorant font-normal text-[#f5f4f0] mb-9 max-w-[680px]"
        style={{
          fontSize: "clamp(24px, 3.2vw, 34px)",
          lineHeight: 1.25,
          letterSpacing: "-0.3px",
        }}
      >
        {props.question.prompt}
      </div>

      {isMulti && props.question.max_select ? (
        <p className="font-read text-[12px] text-[#8a8780] mb-4">
          Select up to {props.question.max_select}.
        </p>
      ) : null}

      <div className="flex flex-col gap-2 max-w-[680px]">
        {props.question.options?.map((opt) => {
          const selected = props.value.includes(opt.code);
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => toggle(opt.code)}
              className={`text-left bg-[#161513] border rounded-xl px-5 py-4 text-[14px] leading-snug transition-colors flex items-center justify-between gap-4 ${
                selected
                  ? "bg-[#1c1a17] border-[#6e6c66] text-[#f5f4f0]"
                  : "border-[#2a2826] text-[#c9c6bf] hover:border-[#3d3a36] hover:text-[#e8e6e1]"
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`shrink-0 w-[18px] h-[18px] rounded-full border flex items-center justify-center font-jetbrains text-[10px] transition-colors ${
                  selected
                    ? "bg-[#6e6c66] border-[#6e6c66] text-[#0a0908]"
                    : "bg-transparent border-[#3d3a36] text-transparent"
                }`}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ───────────── Step 3: Open Text Question ─────────────

function OpenTextStep(props: {
  question: BariQuestion;
  stepIndex: number;
  totalSteps: number;
  value: string;
  onChange: (text: string) => void;
  onSkip: () => void;
}) {
  const charLimit = props.question.char_limit ?? 500;
  const remaining = charLimit - props.value.length;

  return (
    <div className="px-10 md:px-16 py-12 md:py-14">
      <div className="flex items-center gap-5 mb-14">
        <span className="font-jetbrains text-[9px] tracking-[2px] uppercase text-[#8a8780] whitespace-nowrap">
          Stage 1
        </span>
        <div className="flex-1 h-px bg-[#2a2826] rounded-full overflow-hidden">
          <div
            className="h-px rounded-full"
            style={{
              width: `${(props.stepIndex / props.totalSteps) * 100}%`,
              background: "linear-gradient(90deg, #6e6c66, #f5f4f0)",
            }}
          />
        </div>
        <span className="font-jetbrains text-[9px] tracking-[2px] uppercase text-[#8a8780] whitespace-nowrap">
          {props.stepIndex} / {props.totalSteps}
        </span>
      </div>

      <div className="inline-flex items-center gap-2 font-jetbrains text-[9px] tracking-[2.5px] uppercase text-[#a8a59f] mb-5">
        <span className="w-1 h-1 rounded-full bg-[#a8a59f]" />
        A few final questions
      </div>

      <div
        className="font-cormorant font-normal text-[#f5f4f0] mb-9 max-w-[680px]"
        style={{
          fontSize: "clamp(24px, 3.2vw, 34px)",
          lineHeight: 1.25,
          letterSpacing: "-0.3px",
        }}
      >
        {props.question.prompt}
      </div>

      <div className="bg-[#161513] border border-[#2a2826] border-l-2 border-l-[#6e6c66] rounded-lg px-5 py-3.5 mb-7 max-w-[640px] text-[13px] text-[#8a8780] italic leading-[1.65]">
        Be specific — the more concrete your answer, the more targeted your
        report will be. There are no wrong answers here.
      </div>

      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value.slice(0, charLimit))}
        placeholder="Type your answer here…"
        className="w-full max-w-[640px] bg-[#161513] border border-[#2a2826] focus:border-[#3d3a36] focus:bg-[#1c1a17] rounded-2xl px-5 py-4 font-read text-[15px] text-[#f5f4f0] leading-[1.6] resize-none h-[120px] outline-none transition-colors placeholder:text-[#5a5853] placeholder:italic"
      />
      <div className="flex items-center justify-between max-w-[640px] mt-2">
        <button
          type="button"
          onClick={props.onSkip}
          className="text-[11px] text-[#5a5853] hover:text-[#8a8780] transition-colors tracking-[0.5px]"
        >
          Skip this question
        </button>
        <span className="font-jetbrains text-[9px] text-[#5a5853] tracking-[1px]">
          {props.value.length} / {charLimit}
          {remaining < 30 && remaining >= 0 ? ` · ${remaining} left` : ""}
        </span>
      </div>
    </div>
  );
}
