"use client";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

type AssignmentTab = "PROMPT" | "USE_CASE";

type AssignmentStatus =
  | "PENDING_SUBMIT"
  | "AWAITING_REVIEW"
  | "NEEDS_REVISION"
  | "ACCEPTED";

interface Assignment {
  id: number;
  title: string;
  body: string;
  level_number: number;
  categories: { id: number; name: string }[];
  champion_name: string | null;
  deadline: string;
  message: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  comment: string | null;
  is_accepted: boolean;
}

function deriveStatus(a: Assignment): AssignmentStatus {
  if (a.is_accepted) return "ACCEPTED";
  if (!a.submitted_at) return "PENDING_SUBMIT";
  if (
    a.reviewed_at &&
    dayjs(a.reviewed_at).isAfter(dayjs(a.submitted_at))
  )
    return "NEEDS_REVISION";
  return "AWAITING_REVIEW";
}

const statusMeta: Record<
  AssignmentStatus,
  { label: string; cls: string; icon: typeof CheckCircle2 }
> = {
  PENDING_SUBMIT: {
    label: "Belum dikerjakan",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 dark:border dark:border-amber-500/30",
    icon: Clock,
  },
  AWAITING_REVIEW: {
    label: "Menunggu review",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 dark:border dark:border-blue-500/30",
    icon: Clock,
  },
  NEEDS_REVISION: {
    label: "Perlu revisi",
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300 dark:border dark:border-red-500/30",
    icon: CircleAlert,
  },
  ACCEPTED: {
    label: "Diterima",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border dark:border-emerald-500/30",
    icon: CheckCircle2,
  },
};

export default function AssignmentsStudentAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const [tab, setTab] = useState<AssignmentTab>("PROMPT");

  const promptsQ = trpc.ailene.student.assignedPrompts.useQuery(undefined, {
    enabled: tab === "PROMPT",
  });
  const useCasesQ = trpc.ailene.student.assignedUseCases.useQuery(undefined, {
    enabled: tab === "USE_CASE",
  });

  const assignments: Assignment[] =
    tab === "PROMPT"
      ? (promptsQ.data?.list ?? []).map((r) => ({
          id: r.id,
          title: r.prompt.name,
          body: r.prompt.scenario,
          level_number: r.prompt.level.level_number,
          categories: r.prompt.categories,
          champion_name: r.assigned_by?.full_name ?? null,
          deadline: r.deadline as unknown as string,
          message: r.message,
          submitted_at: r.submitted_at as unknown as string | null,
          reviewed_at: r.reviewed_at as unknown as string | null,
          comment: r.comment,
          is_accepted: r.is_accepted,
        }))
      : (useCasesQ.data?.list ?? []).map((r) => ({
          id: r.id,
          title: r.use_case.name,
          body: r.use_case.description,
          level_number: r.use_case.level.level_number,
          categories: r.use_case.categories,
          champion_name: r.assigned_by?.full_name ?? null,
          deadline: r.deadline as unknown as string,
          message: r.message,
          submitted_at: r.submitted_at as unknown as string | null,
          reviewed_at: r.reviewed_at as unknown as string | null,
          comment: r.comment,
          is_accepted: r.is_accepted,
        }));

  const isLoading = tab === "PROMPT" ? promptsQ.isLoading : useCasesQ.isLoading;
  const error = tab === "PROMPT" ? promptsQ.error : useCasesQ.error;

  const pendingCount = assignments.filter(
    (a) => deriveStatus(a) === "PENDING_SUBMIT"
  ).length;

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Tugas Saya</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prompt &amp; use case yang di-assign dari champion-mu.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-dashboard-border">
          <button
            type="button"
            onClick={() => setTab("PROMPT")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition ${
              tab === "PROMPT"
                ? "border-red-500 text-red-600 dark:border-red-400 dark:text-red-300"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Prompt
          </button>
          <button
            type="button"
            onClick={() => setTab("USE_CASE")}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition ${
              tab === "USE_CASE"
                ? "border-red-500 text-red-600 dark:border-red-400 dark:text-red-300"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Use Case
          </button>
        </div>

        {error ? (
          <AppErrorComponents />
        ) : isLoading ? (
          <AssignmentSkeleton />
        ) : assignments.length === 0 ? (
          <EmptyState
            label={`Belum ada ${tab === "PROMPT" ? "prompt" : "use case"} yang di-assign.`}
          />
        ) : (
          <>
            {pendingCount > 0 && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                Kamu punya <strong>{pendingCount}</strong> tugas yang belum
                dikerjakan.
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {assignments.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageContainerAILN>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const status = deriveStatus(assignment);
  const meta = statusMeta[status];
  const StatusIcon = meta.icon;
  const deadlineOverdue =
    !assignment.is_accepted &&
    !assignment.submitted_at &&
    dayjs(assignment.deadline).isBefore(dayjs());

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-md bg-red-50 px-2 py-0.5 font-bold text-red-600 dark:bg-red-500/10 dark:text-red-300">
            L{assignment.level_number}
          </span>
          {assignment.categories.slice(0, 2).map((c) => (
            <span
              key={c.id}
              className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-white/5 dark:text-gray-300"
            >
              {c.name}
            </span>
          ))}
        </div>
        <span
          className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.cls}`}
        >
          <StatusIcon className="size-3" />
          {meta.label}
        </span>
      </div>
      <h3 className="text-sm font-bold dark:text-white">{assignment.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
        {assignment.body}
      </p>

      <div className="flex flex-col gap-1 border-t border-dashboard-border pt-3 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-3.5 shrink-0" />
          <span
            className={
              deadlineOverdue ? "font-semibold text-red-600 dark:text-red-400" : ""
            }
          >
            Deadline:{" "}
            {dayjs(assignment.deadline).format("ddd, D MMM YYYY · HH:mm")}
            {deadlineOverdue ? " (lewat)" : ""}
          </span>
        </div>
        {assignment.champion_name && (
          <div className="flex items-center gap-2">
            <BookOpen className="size-3.5 shrink-0" />
            <span>Dari: {assignment.champion_name}</span>
          </div>
        )}
        {assignment.message && (
          <div className="flex items-start gap-2">
            <MessageSquare className="size-3.5 shrink-0 mt-0.5" />
            <span className="italic">&ldquo;{assignment.message}&rdquo;</span>
          </div>
        )}
        {status === "NEEDS_REVISION" && assignment.comment && (
          <div className="mt-1 rounded border border-red-200 bg-red-50 p-2 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
            <div className="text-[10px] font-bold uppercase tracking-wide">
              Catatan champion
            </div>
            <div className="mt-0.5">{assignment.comment}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-dashboard-border py-12 text-center text-gray-500 dark:text-gray-400">
      <BookOpen className="size-6" />
      <div className="text-sm">{label}</div>
    </div>
  );
}

function AssignmentSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-lg border border-dashboard-border bg-gray-100 dark:bg-card-bg"
        />
      ))}
    </div>
  );
}
