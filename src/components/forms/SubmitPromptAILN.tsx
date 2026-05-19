"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AppTextArea from "@/components/fields/AppTextArea";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock,
  FileText,
  Layers,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  SquarePen,
  Tag,
} from "lucide-react";
import Link from "next/link";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Status =
  | "PENDING_SUBMIT"
  | "AWAITING_REVIEW"
  | "NEEDS_REVISION"
  | "ACCEPTED";

const statusMeta: Record<
  Status,
  { label: string; cls: string; icon: typeof CheckCircle2 }
> = {
  PENDING_SUBMIT: {
    label: "Belum dikerjakan",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    icon: Clock,
  },
  AWAITING_REVIEW: {
    label: "Menunggu review",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    icon: Clock,
  },
  NEEDS_REVISION: {
    label: "Perlu revisi",
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    icon: CircleAlert,
  },
  ACCEPTED: {
    label: "Diterima",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: CheckCircle2,
  },
};

function FieldRow({
  icon,
  label,
  helper,
  required,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="size-9 shrink-0 rounded-md border border-dashboard-border bg-card-inside-bg flex items-center justify-center text-foreground dark:text-gray-300">
        {icon}
      </div>
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <label className="flex items-center gap-0.5 text-sm font-semibold font-read text-foreground dark:text-white">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
        {children}
        {helper && (
          <p className="text-xs font-read text-gray-500 dark:text-gray-400">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SubmitPromptAILN({
  sessionToken,
  promptId,
}: {
  sessionToken: string;
  promptId: number;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const utils = trpc.useUtils();
  const assignmentQ = trpc.ailene.read.promptAssignment.useQuery({
    prompt_id: promptId,
  });
  const submitM = trpc.ailene.update.submitPromptAssignment.useMutation();

  const a = assignmentQ.data?.assignment;

  const [formData, setFormData] = useState<{
    input: string;
    output: string;
  }>({
    input: "",
    output: "",
  });

  useEffect(() => {
    if (!a) return;
    setFormData({
      input: a.input ?? "",
      output: a.output ?? "",
    });
  }, [a]);

  const status: Status = useMemo(() => {
    if (!a) return "PENDING_SUBMIT";
    if (a.is_accepted) return "ACCEPTED";
    if (!a.submitted_at) return "PENDING_SUBMIT";
    if (
      a.reviewed_at &&
      dayjs(a.reviewed_at as unknown as string).isAfter(
        dayjs(a.submitted_at as unknown as string)
      )
    )
      return "NEEDS_REVISION";
    return "AWAITING_REVIEW";
  }, [a]);

  if (assignmentQ.isLoading) {
    return (
      <PageContainerAILN>
        <div className="flex w-full items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      </PageContainerAILN>
    );
  }

  if (assignmentQ.error) {
    if (assignmentQ.error.data?.code === "NOT_FOUND") {
      return (
        <PageContainerAILN>
          <AppPageState variant="NOT_FOUND" />
        </PageContainerAILN>
      );
    }
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  if (!a) {
    return (
      <PageContainerAILN>
        <AppPageState variant="NOT_FOUND" />
      </PageContainerAILN>
    );
  }

  const meta = statusMeta[status];
  const StatusIcon = meta.icon;
  const isLocked = status === "ACCEPTED";
  const deadlineDate = dayjs(a.deadline as unknown as string);
  const deadlineOverdue = !a.is_accepted && deadlineDate.isBefore(dayjs());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.input.trim()) {
      toast.error("Input prompt tidak boleh kosong.");
      return;
    }
    if (!formData.output.trim()) {
      toast.error("Output tidak boleh kosong.");
      return;
    }
    submitM.mutate(
      {
        prompt_id: promptId,
        input: formData.input.trim(),
        output: formData.output.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Tugas berhasil dikirim.");
          utils.ailene.read.promptAssignment.invalidate({
            prompt_id: promptId,
          });
          utils.ailene.list.assignedPrompts.invalidate();
        },
        onError: (err) => {
          toast.error("Gagal kirim", { description: err.message });
        },
      }
    );
  };

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6 py-4">
        {/* Header — MaterialDetailsAILN-style: big title + badge row */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold leading-tight font-read text-sevenpreneur-coal dark:text-white">
            {a.prompt.name}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300">
              <Layers className="h-3 w-3 text-red-500" />
              <span className="font-medium">
                Level {a.prompt.level.level_number}
              </span>
            </span>

            {a.prompt.categories.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300"
              >
                <Tag className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">{c.name}</span>
              </span>
            ))}

            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold ${meta.cls}`}
            >
              <StatusIcon className="h-3 w-3" />
              {meta.label}
            </span>
          </div>

          {a.message && (
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MessageSquare className="size-3.5 shrink-0 mt-0.5" />
              <span className="italic">&ldquo;{a.message}&rdquo;</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.8fr] lg:items-start">
          {/* LEFT: Detail prompt + champion review notes */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-5 dark:bg-card-bg">
              <div className="size-10 rounded-full bg-black flex items-center justify-center text-white dark:bg-white dark:text-black">
                <FileText className="size-5" />
              </div>
              <h2 className="text-lg font-bold font-read text-foreground dark:text-white">
                Detail Prompt
              </h2>

              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide font-read text-gray-500 dark:text-gray-400">
                  Skenario
                </div>
                <p className="text-sm whitespace-pre-wrap font-read text-gray-700 dark:text-gray-200">
                  {a.prompt.scenario}
                </p>
              </div>

              <div className="flex flex-col gap-1 border-t border-dashboard-border pt-4">
                <div className="text-[11px] font-semibold uppercase tracking-wide font-read text-gray-500 dark:text-gray-400">
                  Expected Output
                </div>
                <p className="text-sm whitespace-pre-wrap font-read text-gray-700 dark:text-gray-200">
                  {a.prompt.expected_output}
                </p>
              </div>

              <div className="flex items-center gap-2 border-t border-dashboard-border pt-3 text-xs font-read">
                <CalendarClock
                  className={`size-3.5 shrink-0 ${
                    deadlineOverdue
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span
                  className={
                    deadlineOverdue
                      ? "font-semibold text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-300"
                  }
                >
                  Deadline: {deadlineDate.format("ddd, D MMM YYYY · HH:mm")}
                  {deadlineOverdue ? " (lewat)" : ""}
                </span>
              </div>
            </div>

            {status === "NEEDS_REVISION" && a.comment && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
                  Catatan champion · perlu revisi
                </div>
                <p className="mt-1 text-sm text-red-700 dark:text-red-200">
                  {a.comment}
                </p>
              </div>
            )}
            {status === "ACCEPTED" && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Diterima oleh champion
                </div>
                {a.comment && (
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-200">
                    {a.comment}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg"
          >
            <h2 className="text-base font-bold font-read text-foreground dark:text-white">
              {isLocked ? "Submission kamu" : "Kirim tugasmu"}
            </h2>

            <FieldRow
              icon={<SquarePen className="size-4" />}
              label="Prompt yang kamu pakai"
              helper="Tulis prompt persis seperti yang kamu kirim ke AI."
              required
            >
              <div className="flex flex-col gap-1">
                <AppTextArea
                  textAreaId="prompt-input"
                  textAreaPlaceholder="Tulis prompt yang kamu kirim ke AI…"
                  value={formData.input}
                  onTextAreaChange={(v) =>
                    setFormData((prev) => ({ ...prev, input: v }))
                  }
                  characterLength={5000}
                  textAreaHeight="min-h-[160px]"
                  variant="AILN"
                  disabled={isLocked}
                  required
                />
                <div className="self-end text-xs font-read text-gray-400">
                  {formData.input.length}/5000 karakter
                </div>
              </div>
            </FieldRow>

            <FieldRow
              icon={<Sparkles className="size-4" />}
              label="Output dari AI"
              helper="Tempel hasil dari AI apa adanya, tanpa diedit."
              required
            >
              <div className="flex flex-col gap-1">
                <AppTextArea
                  textAreaId="prompt-output"
                  textAreaPlaceholder="Tempel hasil dari AI…"
                  value={formData.output}
                  onTextAreaChange={(v) =>
                    setFormData((prev) => ({ ...prev, output: v }))
                  }
                  characterLength={10000}
                  textAreaHeight="min-h-[200px]"
                  variant="AILN"
                  disabled={isLocked}
                  required
                />
                <div className="self-end text-xs font-read text-gray-400">
                  {formData.output.length}/10000 karakter
                </div>
              </div>
            </FieldRow>

            {!isLocked && (
              <ButtonAILN
                type="submit"
                variant="primary"
                disabled={submitM.isPending}
                className="w-fit self-end"
              >
                {submitM.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Mengirim…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {status === "NEEDS_REVISION"
                      ? "Kirim Revisi"
                      : a.submitted_at
                        ? "Update Submission"
                        : "Kirim Tugas"}
                  </>
                )}
              </ButtonAILN>
            )}
            {isLocked && (
              <Link
                href="/student/practice"
                className="self-center text-sm text-gray-500 underline dark:text-gray-400"
              >
                Kembali ke daftar tugas
              </Link>
            )}
          </form>
        </div>
      </div>
    </PageContainerAILN>
  );
}
