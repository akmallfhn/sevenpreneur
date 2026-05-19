"use client";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

type Tab = "PROMPT" | "USE_CASE";

type SubmissionStatus =
  | "PENDING_SUBMIT"
  | "AWAITING_REVIEW"
  | "NEEDS_REVISION"
  | "ACCEPTED";

interface SubmissionRow {
  id: number;
  href: string;
  level_number: number;
  title: string;
  member: { id: number; full_name: string; avatar: string | null };
  deadline: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  is_accepted: boolean;
}

function deriveStatus(r: SubmissionRow): SubmissionStatus {
  if (r.is_accepted) return "ACCEPTED";
  if (!r.submitted_at) return "PENDING_SUBMIT";
  if (r.reviewed_at && dayjs(r.reviewed_at).isAfter(dayjs(r.submitted_at)))
    return "NEEDS_REVISION";
  return "AWAITING_REVIEW";
}

const statusMeta: Record<
  SubmissionStatus,
  { label: string; cls: string; icon: typeof CheckCircle2 }
> = {
  PENDING_SUBMIT: {
    label: "Belum dikerjakan",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 dark:border dark:border-amber-500/30",
    icon: Clock,
  },
  AWAITING_REVIEW: {
    label: "Perlu review",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 dark:border dark:border-blue-500/30",
    icon: Clock,
  },
  NEEDS_REVISION: {
    label: "Menunggu revisi",
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300 dark:border dark:border-red-500/30",
    icon: CircleAlert,
  },
  ACCEPTED: {
    label: "Diterima",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border dark:border-emerald-500/30",
    icon: CheckCircle2,
  },
};

export default function SubmissionsChampionAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const [tab, setTab] = useState<Tab>("PROMPT");

  const promptsQ = trpc.ailene.list.promptSubmissions.useQuery(undefined, {
    enabled: tab === "PROMPT",
  });
  const useCasesQ = trpc.ailene.list.useCaseSubmissions.useQuery(
    undefined,
    { enabled: tab === "USE_CASE" }
  );

  const rows: SubmissionRow[] =
    tab === "PROMPT"
      ? (promptsQ.data?.list ?? []).map((r) => ({
          id: r.id,
          href: `/champion/submissions/prompts/${r.id}`,
          level_number: r.prompt.level.level_number,
          title: r.prompt.name,
          member: r.member,
          deadline: r.deadline as unknown as string,
          submitted_at: r.submitted_at as unknown as string | null,
          reviewed_at: r.reviewed_at as unknown as string | null,
          is_accepted: r.is_accepted,
        }))
      : (useCasesQ.data?.list ?? []).map((r) => ({
          id: r.id,
          href: `/champion/submissions/use-cases/${r.id}`,
          level_number: r.use_case.level.level_number,
          title: r.use_case.name,
          member: r.member,
          deadline: r.deadline as unknown as string,
          submitted_at: r.submitted_at as unknown as string | null,
          reviewed_at: r.reviewed_at as unknown as string | null,
          is_accepted: r.is_accepted,
        }));

  const isLoading = tab === "PROMPT" ? promptsQ.isLoading : useCasesQ.isLoading;
  const error = tab === "PROMPT" ? promptsQ.error : useCasesQ.error;

  const awaitingReviewCount = rows.filter(
    (r) => deriveStatus(r) === "AWAITING_REVIEW"
  ).length;

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Submissions</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review hasil practice dari tim-mu.
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
                ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
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
                ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Use Case
          </button>
        </div>

        {error ? (
          <AppErrorComponents />
        ) : isLoading ? (
          <SubmissionsSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState
            label={`Belum ada submisi ${tab === "PROMPT" ? "prompt" : "use case"}.`}
          />
        ) : (
          <>
            {awaitingReviewCount > 0 && (
              <div className="rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                Ada <strong>{awaitingReviewCount}</strong> submisi yang menunggu
                review-mu.
              </div>
            )}
            <div className="overflow-hidden rounded-lg border border-dashboard-border bg-white dark:bg-card-bg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dashboard-border text-left text-xs text-gray-500 dark:text-gray-400">
                    <th className="px-4 py-3 font-medium">Anggota</th>
                    <th className="px-4 py-3 font-medium">
                      {tab === "PROMPT" ? "Prompt" : "Use Case"}
                    </th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Deadline</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <SubmissionRowItem key={r.id} row={r} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PageContainerAILN>
  );
}

function SubmissionRowItem({ row }: { row: SubmissionRow }) {
  const status = deriveStatus(row);
  const meta = statusMeta[status];
  const StatusIcon = meta.icon;
  const deadlineOverdue =
    !row.is_accepted &&
    !row.submitted_at &&
    dayjs(row.deadline).isBefore(dayjs());

  return (
    <tr className="border-b border-dashboard-border last:border-b-0 transition hover:bg-gray-50 dark:hover:bg-white/5">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Image
            src={row.member.avatar || DEFAULT_AVATAR}
            alt={row.member.full_name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="font-medium dark:text-white">
            {row.member.full_name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            L{row.level_number}
          </span>
          <span className="dark:text-gray-200 line-clamp-1">{row.title}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.cls}`}
        >
          <StatusIcon className="size-3" />
          {meta.label}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
        {row.submitted_at
          ? dayjs(row.submitted_at).format("D MMM · HH:mm")
          : "—"}
      </td>
      <td className="px-4 py-3 text-xs">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="size-3 shrink-0 text-gray-400" />
          <span
            className={
              deadlineOverdue
                ? "font-semibold text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            {dayjs(row.deadline).format("D MMM · HH:mm")}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={row.href}
          className="rounded-md border border-dashboard-border px-3 py-1 text-xs font-semibold text-gray-700 transition hover:border-emerald-500 hover:text-emerald-700 dark:text-gray-300 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
        >
          {status === "AWAITING_REVIEW" ? "Review" : "Lihat"}
        </Link>
      </td>
    </tr>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-dashboard-border py-12 text-center text-gray-500 dark:text-gray-400">
      <ClipboardList className="size-6" />
      <div className="text-sm">{label}</div>
    </div>
  );
}

function SubmissionsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-14 animate-pulse rounded-md border border-dashboard-border bg-gray-100 dark:bg-card-bg"
        />
      ))}
    </div>
  );
}
