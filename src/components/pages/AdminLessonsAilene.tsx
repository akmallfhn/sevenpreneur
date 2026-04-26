"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { AiLearnLessonStatus } from "@prisma/client";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";

const STATUS_BADGE: Record<AiLearnLessonStatus, { label: string; cls: string }> = {
  DRAFT: { label: "Draft", cls: "bg-warning-background text-warning-foreground" },
  PUBLISHED: { label: "Published", cls: "bg-success-background text-success-foreground" },
  ARCHIVED: { label: "Archived", cls: "bg-sevenpreneur-ash text-emphasis" },
};

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations", 2: "Techniques", 3: "Advanced", 4: "Strategic",
};

export default function AdminLessonsAilene() {
  const { isCollapsed } = useSidebar();
  const [statusFilter, setStatusFilter] = useState<AiLearnLessonStatus | undefined>(undefined);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.ailene.listLessons.useQuery({
    status: statusFilter,
  });

  const deleteMutation = trpc.ailene.deleteLesson.useMutation({
    onSuccess: () => {
      toast.success("Materi berhasil dihapus.");
      utils.ailene.listLessons.invalidate();
    },
    onError: () => toast.error("Gagal menghapus materi."),
  });

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Hapus materi "${title}"?`)) return;
    deleteMutation.mutate({ id });
  };

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal">
              Kelola Materi
            </h1>
            <p className="font-bodycopy text-sm text-emphasis">
              Buat dan kelola materi pembelajaran AI untuk platform Ailene.
            </p>
          </div>
          <Link href="/admin/lessons/create">
            <AppButton variant="primary" size="medium">
              <Plus className="size-4" />
              Buat Materi
            </AppButton>
          </Link>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {([undefined, "DRAFT", "PUBLISHED", "ARCHIVED"] as (AiLearnLessonStatus | undefined)[]).map((s) => (
            <AppButton
              key={s ?? "all"}
              variant={statusFilter === s ? "primary" : "light"}
              size="small"
              onClick={() => setStatusFilter(s)}
            >
              {s ? STATUS_BADGE[s].label : "Semua"}
            </AppButton>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-emphasis">
            <Loader2 className="animate-spin size-6" />
          </div>
        )}

        {!isLoading && (
          <div className="rounded-xl border border-sevenpreneur-ash overflow-hidden">
            <table className="w-full text-sm font-bodycopy">
              <thead className="bg-section-background border-b border-sevenpreneur-ash">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-emphasis text-xs">JUDUL</th>
                  <th className="text-left px-4 py-3 font-semibold text-emphasis text-xs">LEVEL</th>
                  <th className="text-left px-4 py-3 font-semibold text-emphasis text-xs">XP</th>
                  <th className="text-left px-4 py-3 font-semibold text-emphasis text-xs">QUIZ</th>
                  <th className="text-left px-4 py-3 font-semibold text-emphasis text-xs">STATUS</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data?.list.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-emphasis text-sm">
                      Belum ada materi.
                    </td>
                  </tr>
                )}
                {data?.list.map((lesson) => {
                  const badge = STATUS_BADGE[lesson.status];
                  return (
                    <tr key={lesson.id} className="border-b border-sevenpreneur-ash/50 hover:bg-section-background/50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sevenpreneur-coal line-clamp-1">{lesson.title}</p>
                      </td>
                      <td className="px-4 py-3 text-emphasis">
                        L{lesson.level} {LEVEL_LABELS[lesson.level]}
                      </td>
                      <td className="px-4 py-3 text-primary font-semibold">
                        +{lesson.xp_reward}
                      </td>
                      <td className="px-4 py-3 text-emphasis">
                        {lesson._count.quiz_questions} soal
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/lessons/${lesson.id}/edit`}>
                            <AppButton variant="light" size="mediumIcon">
                              <Pencil className="size-3.5" />
                            </AppButton>
                          </Link>
                          <AppButton
                            variant="destructiveSoft"
                            size="mediumIcon"
                            onClick={() => handleDelete(lesson.id, lesson.title)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="size-3.5" />
                          </AppButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
