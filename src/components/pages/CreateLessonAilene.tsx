"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { AiLearnLessonStatus } from "@prisma/client";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";

const LEVELS = [
  { value: 1, label: "Level 1 — Foundations" },
  { value: 2, label: "Level 2 — Techniques" },
  { value: 3, label: "Level 3 — Advanced" },
  { value: 4, label: "Level 4 — Strategic" },
];

export default function CreateLessonAilene() {
  const { isCollapsed } = useSidebar();
  const router = useRouter();

  const { data: journeyData } = trpc.ailene.listJourneys.useQuery();
  const journeys = journeyData?.list ?? [];

  const [form, setForm] = useState<{
    title: string;
    description: string;
    content: string;
    level: number;
    xp_reward: number;
    status: AiLearnLessonStatus;
    journey_id: number | null;
  }>({
    title: "",
    description: "",
    content: "",
    level: 1,
    xp_reward: 10,
    status: AiLearnLessonStatus.DRAFT,
    journey_id: null,
  });

  const createMutation = trpc.ailene.createLesson.useMutation({
    onSuccess: (data) => {
      toast.success("Materi berhasil dibuat!");
      router.push(`/admin/lessons/${data.lesson.id}/edit`);
    },
    onError: () => toast.error("Gagal membuat materi."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.warning("Judul tidak boleh kosong.");
    if (!form.journey_id) return toast.warning("Pilih journey terlebih dahulu.");
    createMutation.mutate({ ...form, journey_id: form.journey_id });
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-sevenpreneur-ash text-sm font-bodycopy focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";
  const labelCls = "font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest";

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-3xl mx-auto w-full flex flex-col gap-6 px-8">
        <Link href="/admin/lessons">
          <AppButton variant="light" size="small">
            <ChevronLeft className="size-3.5" />
            Kelola Materi
          </AppButton>
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal">
            Buat Materi Baru
          </h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Setelah disimpan, kamu bisa tambahkan soal quiz di halaman edit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Judul *</label>
            <input
              className={inputCls}
              placeholder="Judul materi"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Deskripsi Singkat</label>
            <input
              className={inputCls}
              placeholder="Ringkasan singkat materi ini"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Journey *</label>
            <select
              className={inputCls}
              value={form.journey_id ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, journey_id: e.target.value ? Number(e.target.value) : null }))}
            >
              <option value="">— Pilih journey —</option>
              {journeys.map((j) => (
                <option key={j.id} value={j.id}>{j.name}{j.role ? ` (${j.role})` : ""}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Level</label>
              <select
                className={inputCls}
                value={form.level}
                onChange={(e) => setForm((p) => ({ ...p, level: Number(e.target.value) }))}
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>XP Reward</label>
              <input
                type="number"
                className={inputCls}
                min={1}
                value={form.xp_reward}
                onChange={(e) => setForm((p) => ({ ...p, xp_reward: Number(e.target.value) }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as AiLearnLessonStatus }))}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>
              Konten Materi{" "}
              <span className="normal-case text-emphasis font-normal">(Markdown)</span>
            </label>
            <textarea
              className={`${inputCls} min-h-72 resize-y font-mono text-xs leading-relaxed`}
              placeholder={"# Judul\n\nTulis materi dalam format Markdown...\n\n## Sub-judul\n\nIsi konten di sini."}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            />
            <p className="font-bodycopy text-xs text-emphasis">
              Gunakan Markdown: # untuk heading, **bold**, *italic*, - untuk list
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <AppButton
              type="submit"
              variant="primary"
              size="medium"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="animate-spin size-4" />}
              Simpan & Lanjut Edit Quiz
            </AppButton>
            <Link href="/admin/lessons">
              <AppButton variant="light" size="medium">
                Batal
              </AppButton>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
