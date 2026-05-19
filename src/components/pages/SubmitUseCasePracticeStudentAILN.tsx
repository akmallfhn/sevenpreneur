"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/client";
import { AilUseCaseFrequency } from "@prisma/client";
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

const FREQUENCY_OPTIONS: { value: AilUseCaseFrequency; label: string }[] = [
  { value: "DAILY", label: "Harian" },
  { value: "WEEKLY", label: "Mingguan" },
  { value: "MONTHLY", label: "Bulanan" },
  { value: "OCCASIONALLY", label: "Sesekali" },
];

export default function SubmitUseCasePracticeStudentAILN({
  sessionToken,
  useCaseId,
}: {
  sessionToken: string;
  useCaseId: number;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const router = useRouter();
  const utils = trpc.useUtils();
  const assignmentQ = trpc.ailene.student.useCaseAssignment.useQuery({
    use_case_id: useCaseId,
  });
  const submitM = trpc.ailene.student.submitUseCaseAssignment.useMutation();

  const a = assignmentQ.data?.assignment;

  const [outcomeProof, setOutcomeProof] = useState("");
  const [hoursSaved, setHoursSaved] = useState("");
  const [description, setDescription] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [frequency, setFrequency] = useState<AilUseCaseFrequency | "">("");

  useEffect(() => {
    if (a) {
      setOutcomeProof(a.outcome_proof ?? "");
      setHoursSaved(
        a.hours_saved !== null && a.hours_saved !== undefined
          ? String(a.hours_saved)
          : ""
      );
      setDescription(a.description ?? "");
      setAiTool(a.ai_tool ?? "");
      setFrequency(a.frequency ?? "");
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
    if (!outcomeProof.trim()) {
      toast.error("Outcome / bukti hasil wajib diisi.");
      return;
    }
    const hoursNum = Number(hoursSaved);
    if (!Number.isFinite(hoursNum) || hoursNum < 0) {
      toast.error("Hours saved harus angka non-negatif.");
      return;
    }
    if (!description.trim()) {
      toast.error("Deskripsi wajib diisi.");
      return;
    }
    if (!aiTool.trim()) {
      toast.error("AI tool wajib diisi.");
      return;
    }
    if (!frequency) {
      toast.error("Pilih frekuensi pemakaian.");
      return;
    }

    submitM.mutate(
      {
        use_case_id: useCaseId,
        outcome_proof: outcomeProof.trim(),
        hours_saved: hoursNum,
        description: description.trim(),
        ai_tool: aiTool.trim(),
        frequency: frequency as AilUseCaseFrequency,
      },
      {
        onSuccess: () => {
          toast.success("Tugas berhasil dikirim.");
          utils.ailene.student.useCaseAssignment.invalidate({
            use_case_id: useCaseId,
          });
          utils.ailene.student.assignedUseCases.invalidate();
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
              L{a.use_case.level.level_number}
            </span>
            {a.use_case.categories.map((c) => (
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
          <h1 className="text-2xl font-bold dark:text-white">
            {a.use_case.name}
          </h1>
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

        <div className="flex flex-col gap-2 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Deskripsi Use Case
          </div>
          <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-200">
            {a.use_case.description}
          </p>
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
            {isLocked ? "Submission kamu" : "Laporkan use case-mu"}
          </h2>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="uc-outcome"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Outcome / bukti hasil
            </label>
            <input
              id="uc-outcome"
              type="text"
              value={outcomeProof}
              onChange={(e) => setOutcomeProof(e.target.value.slice(0, 500))}
              disabled={isLocked}
              placeholder="URL Google Drive, link screenshot, atau ringkasan singkat hasilnya"
              className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-200 dark:placeholder:text-gray-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="uc-hours"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Hours saved (jam)
              </label>
              <input
                id="uc-hours"
                type="number"
                step="0.25"
                min="0"
                value={hoursSaved}
                onChange={(e) => setHoursSaved(e.target.value)}
                disabled={isLocked}
                placeholder="e.g. 3.5"
                className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-200 dark:placeholder:text-gray-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="uc-tool"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                AI tool yang dipakai
              </label>
              <input
                id="uc-tool"
                type="text"
                value={aiTool}
                onChange={(e) => setAiTool(e.target.value.slice(0, 255))}
                disabled={isLocked}
                placeholder="e.g. ChatGPT, Claude, Gemini, NotebookLM"
                className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-200 dark:placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="uc-frequency"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Frekuensi pemakaian
            </label>
            <select
              id="uc-frequency"
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as AilUseCaseFrequency | "")
              }
              disabled={isLocked}
              className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-200"
              required
            >
              <option value="">Pilih frekuensi…</option>
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="uc-description"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Deskripsi penerapan
            </label>
            <textarea
              id="uc-description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
              disabled={isLocked}
              rows={6}
              placeholder="Ceritakan gimana kamu pakai AI di pekerjaanmu, langkah-langkahnya, dan dampak konkret yang kamu rasakan."
              className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-gray-200 dark:placeholder:text-gray-500"
              required
            />
            <div className="self-end text-xs text-gray-400">
              {description.length}/5000
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
