"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AppSheet from "@/components/modals/AppSheet";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export type AssignKind = "PROMPT" | "USE_CASE";

interface AssignFormChampionAILNProps {
  isOpen: boolean;
  onClose: () => void;
  kind: AssignKind;
  item: { id: number; name: string } | null;
}

type TargetMode = "INDIVIDUAL" | "BULK";

export default function AssignFormChampionAILN({
  isOpen,
  onClose,
  kind,
  item,
}: AssignFormChampionAILNProps) {
  const utils = trpc.useUtils();
  const memberQ = trpc.auth.checkAilMember.useQuery(undefined, {
    enabled: isOpen,
  });
  const membersQ = trpc.ailene.champion.listMembers.useQuery(
    {},
    { enabled: isOpen }
  );

  const assignPromptM = trpc.ailene.champion.assignPrompt.useMutation();
  const assignUseCaseM = trpc.ailene.champion.assignUseCase.useMutation();
  const assignMutation = kind === "PROMPT" ? assignPromptM : assignUseCaseM;

  const groups = memberQ.data?.ail_member?.championed_groups ?? [];
  const members = membersQ.data?.list ?? [];

  const [mode, setMode] = useState<TargetMode>("INDIVIDUAL");
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [deadlineDate, setDeadlineDate] = useState(
    dayjs().add(7, "day").format("YYYY-MM-DD")
  );
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [message, setMessage] = useState("");

  const toggleMember = (id: number) =>
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleGroup = (id: number) =>
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!item) {
      toast.error("Pilih item dulu.");
      return;
    }
    if (mode === "INDIVIDUAL" && selectedMemberIds.length === 0) {
      toast.error("Pilih minimal 1 anggota.");
      return;
    }
    if (mode === "BULK" && selectedGroupIds.length === 0) {
      toast.error("Pilih minimal 1 grup.");
      return;
    }
    const deadlineISO = dayjs(`${deadlineDate}T${deadlineTime}`).toISOString();
    if (dayjs(deadlineISO).isBefore(dayjs())) {
      toast.error("Deadline harus di masa depan.");
      return;
    }

    assignMutation.mutate(
      {
        library_id: item.id,
        target_type: mode === "INDIVIDUAL" ? "MEMBER" : "GROUP",
        target_ids:
          mode === "INDIVIDUAL" ? selectedMemberIds : selectedGroupIds,
        deadline: deadlineISO,
        message: message.trim() || null,
      },
      {
        onSuccess: (data) => {
          const label = kind === "PROMPT" ? "Prompt" : "Use Case";
          const skipped = data.skipped ?? 0;
          if (skipped > 0) {
            toast.success(
              `${label} berhasil di-assign ke ${data.assigned_count} anggota (${skipped} skipped — sudah pernah di-assign).`
            );
          } else {
            toast.success(
              `${label} berhasil di-assign ke ${data.assigned_count} anggota.`
            );
          }
          utils.ailene.student.assignedPrompts.invalidate();
          utils.ailene.student.assignedUseCases.invalidate();
          setSelectedMemberIds([]);
          setSelectedGroupIds([]);
          setMessage("");
          onClose();
        },
        onError: (err) => {
          toast.error("Gagal assign", { description: err.message });
        },
      }
    );
  };

  const isLoading =
    memberQ.isLoading || (mode === "INDIVIDUAL" && membersQ.isLoading);
  const isSubmitting = assignMutation.isPending;

  return (
    <AppSheet
      isOpen={isOpen}
      onClose={onClose}
      sheetName={`Assign ${kind === "PROMPT" ? "Prompt" : "Use Case"}`}
      sheetDescription={item?.name ?? ""}
    >
      <form
        className="relative flex h-full w-full flex-col"
        onSubmit={handleSubmit}
      >
        <div className="flex h-full flex-col gap-5 overflow-y-auto px-6 pb-28">
          {/* Target mode toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Target
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("INDIVIDUAL")}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  mode === "INDIVIDUAL"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "border-dashboard-border text-gray-600 hover:border-gray-400 dark:text-gray-300"
                }`}
              >
                Assign Individual
              </button>
              <button
                type="button"
                onClick={() => setMode("BULK")}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  mode === "BULK"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "border-dashboard-border text-gray-600 hover:border-gray-400 dark:text-gray-300"
                }`}
              >
                Assign Bulk (Grup)
              </button>
            </div>
          </div>

          {/* Target picker */}
          {mode === "INDIVIDUAL" ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Pilih Anggota ({selectedMemberIds.length} dipilih)
              </label>
              {isLoading ? (
                <div className="text-sm text-gray-500">Memuat…</div>
              ) : members.length === 0 ? (
                <div className="text-sm text-gray-500">Belum ada anggota.</div>
              ) : (
                <div className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border border-dashboard-border p-2">
                  {members.map((m) => {
                    const checked = selectedMemberIds.includes(m.member_id);
                    return (
                      <label
                        key={m.member_id}
                        className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition ${
                          checked
                            ? "bg-emerald-50 dark:bg-emerald-500/10"
                            : "hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMember(m.member_id)}
                          className="size-4"
                        />
                        <div className="flex flex-1 flex-col">
                          <span className="font-medium dark:text-white">
                            {m.user.full_name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {m.user.email}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Pilih Grup ({selectedGroupIds.length} dipilih)
              </label>
              {isLoading ? (
                <div className="text-sm text-gray-500">Memuat…</div>
              ) : groups.length === 0 ? (
                <div className="text-sm text-gray-500">Belum ada grup.</div>
              ) : (
                <div className="flex flex-col gap-1 rounded-md border border-dashboard-border p-2">
                  {groups.map((g) => {
                    const checked = selectedGroupIds.includes(g.id);
                    return (
                      <label
                        key={g.id}
                        className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition ${
                          checked
                            ? "bg-emerald-50 dark:bg-emerald-500/10"
                            : "hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleGroup(g.id)}
                          className="size-4"
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <span className="font-medium dark:text-white">
                            {g.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {g._count?.members ?? 0} anggota
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Deadline */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Deadline
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:text-gray-200"
                required
              />
              <input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:text-gray-200"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Catatan untuk anggota (opsional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="Tambahkan catatan atau instruksi khusus…"
              rows={4}
              className="resize-none rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
            />
            <div className="self-end text-xs text-gray-400">
              {message.length}/500
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-40 flex w-full flex-col gap-1 border-t border-dashboard-border bg-sb-bg p-4">
          <ButtonAILN
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengirim…
              </>
            ) : (
              <>
                <Send className="size-4" />
                Assign{" "}
                {kind === "PROMPT" ? "Prompt" : "Use Case"}
              </>
            )}
          </ButtonAILN>
          <p className="text-center text-[11px] text-gray-500 dark:text-gray-400">
            Anggota akan menerima notifikasi di dashboard mereka.
          </p>
        </div>
      </form>
    </AppSheet>
  );
}
