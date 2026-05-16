"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AlertConfirmDialogAILN from "@/components/modals/AlertConfirmDialogAILN";
import { trpc } from "@/trpc/client";
import { ArrowRight, BookOpen, PlayCircle, SquareCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function labelForKind(kind: "Quiz" | "Video" | "Material") {
  if (kind === "Quiz") return "Quiz";
  if (kind === "Video") return "Recording";
  return "Materi";
}

export default function TodayFocusCardAILN() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const q = trpc.ailene.read.todayFocus.useQuery();

  const completeVideo = trpc.ailene.completeVideo.useMutation({
    onSuccess: () => {
      utils.ailene.read.todayFocus.invalidate();
      utils.ailene.list.tasks.invalidate();
      utils.auth.checkAilMember.invalidate();
    },
  });

  if (q.isLoading) {
    return (
      <CardShell title="● FOKUS HARI INI">
        <CardLoading />
      </CardShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <CardShell title="● FOKUS HARI INI">
        <CardError />
      </CardShell>
    );
  }

  const focus = q.data.focus;
  if (!focus) {
    return (
      <CardShell title="● FOKUS HARI INI">
        <h2 className="text-xl font-bold leading-snug text-gray-900 dark:text-white">
          Semua task terbaru sudah kamu selesaikan 🎉
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tunggu chapter berikutnya terbuka, atau lihat ulang materi yang sudah
          dikerjakan.
        </p>
        <div className="mt-2">
          <Link href="/student/modules">
            <ButtonAILN>Lihat modul belajar</ButtonAILN>
          </Link>
        </div>
      </CardShell>
    );
  }

  const Icon =
    focus.kind === "Quiz"
      ? SquareCheck
      : focus.kind === "Video"
        ? PlayCircle
        : BookOpen;

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-white p-6 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
        <span className="size-2 rounded-full bg-red-500 dark:shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
        FOKUS HARI INI
        <span className="text-gray-400 dark:text-gray-500">·</span>
        <span className="inline-flex items-center gap-1 normal-case text-gray-500 dark:text-gray-400">
          <Icon className="size-3.5" />
          {labelForKind(focus.kind)}
        </span>
      </div>
      <h2 className="text-xl font-bold leading-snug text-gray-900 dark:text-white">
        Selesaikan {labelForKind(focus.kind).toLowerCase()}{" "}
        <span className="rounded px-1 text-red-600 dark:text-red-400 dark:drop-shadow-[0_0_4px_rgba(239,68,68,0.6)]">
          {focus.task_title}
        </span>{" "}
        di Chapter {focus.chapter_name}.
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Pilih task ini sebagai langkah berikutnya supaya progres chapter kamu
        terus maju.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {focus.kind === "Video" && (
          <a
            href={focus.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
            onClick={() =>
              completeVideo.mutate({ video_id: Number(focus.task_id) })
            }
          >
            <ButtonAILN>
              Mulai sekarang
              <ArrowRight className="size-3.5" />
            </ButtonAILN>
          </a>
        )}
        {focus.kind === "Material" && (
          <Link href={focus.href}>
            <ButtonAILN>
              Mulai sekarang
              <ArrowRight className="size-3.5" />
            </ButtonAILN>
          </Link>
        )}
        {focus.kind === "Quiz" && (
          <ButtonAILN onClick={() => setIsQuizDialogOpen(true)}>
            Mulai sekarang
            <ArrowRight className="size-3.5" />
          </ButtonAILN>
        )}
        <Link href="/student/modules">
          <ButtonAILN variant="light">Lihat detail</ButtonAILN>
        </Link>
      </div>

      {focus.kind === "Quiz" && (
        <AlertConfirmDialogAILN
          isOpen={isQuizDialogOpen}
          alertDialogHeader="Mulai Quiz Sekarang?"
          alertDialogMessage="Waktu akan terus berjalan setelah quiz dimulai dan tidak bisa di-pause walaupun kamu keluar halaman."
          alertCancelLabel="Batal"
          alertConfirmLabel="Mulai sekarang"
          onClose={() => setIsQuizDialogOpen(false)}
          onConfirm={() => {
            setIsQuizDialogOpen(false);
            router.push(focus.href);
          }}
        />
      )}
    </div>
  );
}

function CardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-white p-6 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)]">
      <div className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {title}
      </div>
      {children}
    </div>
  );
}

function CardLoading() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-dashboard-border" />
      <div className="h-4 w-full rounded bg-gray-200 dark:bg-dashboard-border" />
      <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-dashboard-border" />
      <div className="mt-2 flex items-center gap-2">
        <div className="h-9 w-32 rounded-md bg-gray-200 dark:bg-dashboard-border" />
        <div className="h-9 w-24 rounded-md bg-gray-200 dark:bg-dashboard-border" />
      </div>
    </div>
  );
}

function CardError() {
  return (
    <div className="flex h-20 items-center justify-center">
      <span className="text-xs text-red-500 dark:text-red-400">
        Gagal memuat data.
      </span>
    </div>
  );
}
