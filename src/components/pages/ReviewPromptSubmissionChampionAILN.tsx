"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
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
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

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
    label: "Perlu review",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    icon: Clock,
  },
  NEEDS_REVISION: {
    label: "Menunggu revisi student",
    cls: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    icon: CircleAlert,
  },
  ACCEPTED: {
    label: "Diterima",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: CheckCircle2,
  },
};

export default function ReviewPromptSubmissionChampionAILN({
  sessionToken,
  submissionId,
}: {
  sessionToken: string;
  submissionId: number;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const router = useRouter();
  const utils = trpc.useUtils();
  const detailQ = trpc.ailene.champion.promptSubmissionDetail.useQuery({
    submission_id: submissionId,
  });
  const reviewM = trpc.ailene.champion.reviewPromptSubmission.useMutation();

  const s = detailQ.data?.submission;

  const [comment, setComment] = useState("");

  useEffect(() => {
    if (s) setComment(s.comment ?? "");
  }, [s]);

  const status: Status = useMemo(() => {
    if (!s) return "PENDING_SUBMIT";
    if (s.is_accepted) return "ACCEPTED";
    if (!s.submitted_at) return "PENDING_SUBMIT";
    if (
      s.reviewed_at &&
      dayjs(s.reviewed_at as unknown as string).isAfter(
        dayjs(s.submitted_at as unknown as string)
      )
    )
      return "NEEDS_REVISION";
    return "AWAITING_REVIEW";
  }, [s]);

  if (detailQ.isLoading) {
    return (
      <PageContainerAILN>
        <div className="flex w-full items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-gray-400" />
        </div>
      </PageContainerAILN>
    );
  }
  if (detailQ.error) {
    if (detailQ.error.data?.code === "NOT_FOUND") {
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
  if (!s) {
    return (
      <PageContainerAILN>
        <AppPageState variant="NOT_FOUND" />
      </PageContainerAILN>
    );
  }

  const meta = statusMeta[status];
  const StatusIcon = meta.icon;
  const canReview =
    status === "AWAITING_REVIEW" || status === "NEEDS_REVISION";
  const deadlineDate = dayjs(s.deadline as unknown as string);

  const handleReview = (e: FormEvent, isAccepted: boolean) => {
    e.preventDefault();
    if (!isAccepted && !comment.trim()) {
      toast.error("Catatan wajib diisi kalau minta revisi.");
      return;
    }
    reviewM.mutate(
      {
        submission_id: submissionId,
        is_accepted: isAccepted,
        comment: comment.trim() || null,
      },
      {
        onSuccess: () => {
          toast.success(
            isAccepted ? "Submisi diterima." : "Revisi diminta ke student."
          );
          utils.ailene.champion.promptSubmissionDetail.invalidate({
            submission_id: submissionId,
          });
          utils.ailene.champion.promptSubmissions.invalidate();
        },
        onError: (err) => {
          toast.error("Gagal menyimpan review", { description: err.message });
        },
      }
    );
  };

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        <button
          type="button"
          onClick={() => router.push("/champion/submissions")}
          className="flex w-fit items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Submissions
        </button>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              L{s.prompt.level.level_number}
            </span>
            {s.prompt.categories.map((c) => (
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
          <h1 className="text-2xl font-bold dark:text-white">{s.prompt.name}</h1>
        </div>

        {/* Member + deadline */}
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg">
          <div className="flex items-center gap-3">
            <Image
              src={s.member.avatar || DEFAULT_AVATAR}
              alt={s.member.full_name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-semibold dark:text-white">
                {s.member.full_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {s.member.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <CalendarClock className="size-3.5" />
            Deadline: {deadlineDate.format("ddd, D MMM YYYY · HH:mm")}
          </div>
          {s.submitted_at && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Submitted:{" "}
              {dayjs(s.submitted_at as unknown as string).format(
                "ddd, D MMM YYYY · HH:mm"
              )}
            </div>
          )}
        </div>

        {/* Original prompt context */}
        <div className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Skenario
            </div>
            <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-200">
              {s.prompt.scenario}
            </p>
          </div>
          <div className="flex flex-col gap-1 border-t border-dashboard-border pt-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Expected Output
            </div>
            <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-200">
              {s.prompt.expected_output}
            </p>
          </div>
        </div>

        {/* Student submission */}
        {s.submitted_at ? (
          <div className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg">
            <h2 className="text-base font-bold dark:text-white">
              Submission dari {s.member.full_name}
            </h2>
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Prompt yang dia pakai
              </div>
              <p className="text-sm whitespace-pre-wrap rounded-md border border-dashboard-border bg-card-inside-bg p-3 text-gray-700 dark:text-gray-200">
                {s.input ?? "—"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Output dari AI
              </div>
              <p className="text-sm whitespace-pre-wrap rounded-md border border-dashboard-border bg-card-inside-bg p-3 text-gray-700 dark:text-gray-200">
                {s.output ?? "—"}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-dashboard-border p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Student belum submit.
          </div>
        )}

        {/* Review form */}
        {canReview && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg"
          >
            <h2 className="text-base font-bold dark:text-white">
              {status === "NEEDS_REVISION"
                ? "Review revisi"
                : "Review submission"}
            </h2>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="review-comment"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                <MessageSquare className="size-3" />
                Catatan untuk student
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 2000))}
                rows={4}
                placeholder="Tulis feedback (wajib kalau minta revisi, opsional kalau accept)"
                className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
              />
              <div className="self-end text-xs text-gray-400">
                {comment.length}/2000
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <ButtonAILN
                type="button"
                variant="outline"
                disabled={reviewM.isPending}
                onClick={(e) => handleReview(e, false)}
                className="flex-1"
              >
                <RotateCcw className="size-4" />
                Minta Revisi
              </ButtonAILN>
              <ButtonAILN
                type="button"
                variant="secondary"
                disabled={reviewM.isPending}
                onClick={(e) => handleReview(e, true)}
                className="flex-1"
              >
                {reviewM.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                Terima Submission
              </ButtonAILN>
            </div>
          </form>
        )}

        {/* Past review */}
        {(status === "NEEDS_REVISION" || status === "ACCEPTED") && s.comment && (
          <div
            className={`rounded-lg border p-4 ${
              status === "ACCEPTED"
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                : "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
            }`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide">
              Catatan kamu sebelumnya ·{" "}
              {s.reviewed_at &&
                dayjs(s.reviewed_at as unknown as string).format(
                  "D MMM · HH:mm"
                )}
            </div>
            <p className="mt-1 text-sm">{s.comment}</p>
          </div>
        )}
      </div>
    </PageContainerAILN>
  );
}
