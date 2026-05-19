"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AppTextArea from "@/components/fields/AppTextArea";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
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

  const router = useRouter();
  const utils = trpc.useUtils();
  const assignmentQ = trpc.ailene.read.promptAssignment.useQuery({
    prompt_id: promptId,
  });
  const submitM = trpc.ailene.update.submitPromptAssignment.useMutation();

  const a = assignmentQ.data?.assignment;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (a) {
      setInput(a.input ?? "");
      setOutput(a.output ?? "");
    }
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
    if (!input.trim()) {
      toast.error("Input prompt tidak boleh kosong.");
      return;
    }
    if (!output.trim()) {
      toast.error("Output tidak boleh kosong.");
      return;
    }
    submitM.mutate(
      {
        prompt_id: promptId,
        input: input.trim(),
        output: output.trim(),
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
      <div className="flex w-full flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/student/practice")}
          className="flex w-fit items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Tugas
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md bg-red-50 px-2 py-0.5 font-bold text-red-600 dark:bg-red-500/10 dark:text-red-300">
              L{a.prompt.level.level_number}
            </span>
            {a.prompt.categories.map((c) => (
              <span
                key={c.id}
                className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300"
              >
                {c.name}
              </span>
            ))}
            <span
              className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.cls}`}
            >
              <StatusIcon className="size-3" />
              {meta.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">{a.prompt.name}</h1>
          <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-3.5 shrink-0" />
              <span
                className={
                  deadlineOverdue
                    ? "font-semibold text-red-600 dark:text-red-400"
                    : ""
                }
              >
                Deadline: {deadlineDate.format("ddd, D MMM YYYY · HH:mm")}
                {deadlineOverdue ? " (lewat)" : ""}
              </span>
            </div>
            {a.assigned_by && <div>Dari: {a.assigned_by.full_name}</div>}
            {a.message && (
              <div className="flex items-start gap-2">
                <MessageSquare className="size-3.5 shrink-0 mt-0.5" />
                <span className="italic">&ldquo;{a.message}&rdquo;</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Skenario
            </div>
            <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-200">
              {a.prompt.scenario}
            </p>
          </div>
          <div className="flex flex-col gap-1 border-t border-dashboard-border pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Expected Output
            </div>
            <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-200">
              {a.prompt.expected_output}
            </p>
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg"
        >
          <h2 className="text-base font-bold dark:text-white">
            {isLocked ? "Submission kamu" : "Kirim tugasmu"}
          </h2>

          <div className="flex flex-col gap-1">
            <AppTextArea
              textAreaId="prompt-input"
              textAreaName="Prompt yang kamu pakai"
              textAreaPlaceholder="Tulis prompt yang kamu kirim ke AI…"
              value={input}
              onTextAreaChange={setInput}
              characterLength={5000}
              textAreaHeight="min-h-[160px]"
              variant="AILN"
              disabled={isLocked}
              required
            />
            <div className="self-end text-xs text-gray-400">
              {input.length}/5000
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <AppTextArea
              textAreaId="prompt-output"
              textAreaName="Output dari AI"
              textAreaPlaceholder="Tempel hasil dari AI…"
              value={output}
              onTextAreaChange={setOutput}
              characterLength={10000}
              textAreaHeight="min-h-[200px]"
              variant="AILN"
              disabled={isLocked}
              required
            />
            <div className="self-end text-xs text-gray-400">
              {output.length}/10000
            </div>
          </div>

          {!isLocked && (
            <ButtonAILN
              type="submit"
              variant="primary"
              disabled={submitM.isPending}
              className="w-full"
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
    </PageContainerAILN>
  );
}
