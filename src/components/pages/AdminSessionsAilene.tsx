"use client";
import AppButton from "@/components/buttons/AppButton";
import InputCMS from "@/components/fields/InputCMS";
import SelectCMS from "@/components/fields/SelectCMS";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import dayjs from "dayjs";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const METHOD_OPTIONS = [
  { label: "Online", value: LearningMethodEnum.ONLINE },
  { label: "Onsite", value: LearningMethodEnum.ONSITE },
  { label: "Hybrid", value: LearningMethodEnum.HYBRID },
];

const STATUS_OPTIONS = [
  { label: "Active", value: StatusEnum.ACTIVE },
  { label: "Inactive", value: StatusEnum.INACTIVE },
];

const METHOD_BADGE: Record<LearningMethodEnum, string> = {
  ONLINE: "bg-primary/10 text-primary",
  ONSITE: "bg-success-background text-success-foreground",
  HYBRID: "bg-warning-background text-warning-foreground",
};

const EMPTY_FORM = {
  name: "",
  description: "",
  method: LearningMethodEnum.ONLINE as string | number | null,
  meeting_date: "",
  meeting_url: "",
  location_name: "",
  location_url: "",
  recording_url: "",
  external_video_id: "",
  feedback_form: "",
  status: StatusEnum.ACTIVE as string | number | null,
};

interface AdminSessionsAileneProps {
  sessionToken: string;
}

export default function AdminSessionsAilene({ sessionToken }: AdminSessionsAileneProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data, isLoading } = trpc.ailene.listSessions.useQuery();

  const createMutation = trpc.ailene.createSession.useMutation({
    onSuccess: () => {
      toast.success("Session berhasil dibuat.");
      utils.ailene.listSessions.invalidate();
      closeModal();
    },
    onError: (e) => toast.error("Gagal membuat session.", { description: e.message }),
  });

  const updateMutation = trpc.ailene.updateSession.useMutation({
    onSuccess: () => {
      toast.success("Session berhasil diperbarui.");
      utils.ailene.listSessions.invalidate();
      closeModal();
    },
    onError: (e) => toast.error("Gagal memperbarui session.", { description: e.message }),
  });

  const deleteMutation = trpc.ailene.deleteSession.useMutation({
    onSuccess: () => {
      toast.success("Session berhasil dihapus.");
      utils.ailene.listSessions.invalidate();
    },
    onError: () => toast.error("Gagal menghapus session."),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setIsModalOpen(true);
  };

  const openEdit = (session: NonNullable<typeof data>["list"][number]) => {
    setEditingId(session.id);
    setForm({
      name: session.name,
      description: session.description,
      method: session.method,
      meeting_date: dayjs(session.meeting_date).format("YYYY-MM-DDTHH:mm"),
      meeting_url: session.meeting_url ?? "",
      location_name: session.location_name ?? "",
      location_url: session.location_url ?? "",
      recording_url: session.recording_url ?? "",
      external_video_id: session.external_video_id ?? "",
      feedback_form: session.feedback_form ?? "",
      status: session.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleSubmit = () => {
    if (!form.name || !form.description || !form.meeting_date || !form.method) {
      toast.error("Nama, deskripsi, tanggal, dan metode wajib diisi.");
      return;
    }
    const meetingDateISO = new Date(form.meeting_date).toISOString();

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: form.name,
        description: form.description,
        method: form.method as LearningMethodEnum,
        meeting_date: meetingDateISO,
        meeting_url: form.meeting_url || undefined,
        location_name: form.location_name || undefined,
        location_url: form.location_url || undefined,
        recording_url: form.recording_url || undefined,
        external_video_id: form.external_video_id || undefined,
        feedback_form: form.feedback_form || undefined,
        status: form.status as StatusEnum,
      });
    } else {
      createMutation.mutate({
        name: form.name,
        description: form.description,
        method: form.method as LearningMethodEnum,
        meeting_date: meetingDateISO,
        meeting_url: form.meeting_url || undefined,
        location_name: form.location_name || undefined,
        location_url: form.location_url || undefined,
        recording_url: form.recording_url || undefined,
        external_video_id: form.external_video_id || undefined,
        feedback_form: form.feedback_form || undefined,
        status: form.status as StatusEnum,
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Hapus session "${name}"?`)) return;
    deleteMutation.mutate({ id });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}>
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
              Kelola Sessions
            </h1>
            <p className="font-bodycopy text-sm text-emphasis">
              Jadwalkan dan kelola sesi pembelajaran live untuk member Ailene.
            </p>
          </div>
          <AppButton variant="primary" size="medium" onClick={openCreate}>
            <Plus className="size-4" />
            Tambah Session
          </AppButton>
        </div>

        {isLoading && <AppLoadingComponents />}

        {/* Session list */}
        {data && !isLoading && (
          <div className="flex flex-col gap-3">
            {data.list.length === 0 && (
              <p className="text-center text-emphasis font-bodycopy py-12">
                Belum ada session. Tambahkan session pertama!
              </p>
            )}
            {data.list.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border border-dashboard-border bg-card-bg"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bodycopy font-bold text-sevenpreneur-coal dark:text-white truncate">
                      {session.name}
                    </span>
                    <span className={`shrink-0 text-[11px] font-semibold font-bodycopy px-2 py-0.5 rounded-full capitalize ${METHOD_BADGE[session.method]}`}>
                      {session.method.toLowerCase()}
                    </span>
                    {session.status === StatusEnum.INACTIVE && (
                      <span className="shrink-0 text-[11px] font-semibold font-bodycopy px-2 py-0.5 rounded-full bg-sevenpreneur-ash text-emphasis">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="font-bodycopy text-sm text-emphasis truncate">
                    {session.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-emphasis font-bodycopy mt-0.5">
                    <span>📅 {dayjs(session.meeting_date).format("D MMM YYYY, HH:mm")}</span>
                    {session.speaker && (
                      <span>🎤 {session.speaker.full_name}</span>
                    )}
                    <span>👥 {session._count.attendances} hadir</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <AppButton variant="light" size="small" onClick={() => openEdit(session)}>
                    <Pencil className="size-3.5" />
                    Edit
                  </AppButton>
                  <AppButton
                    variant="destructiveSoft"
                    size="icon"
                    onClick={() => handleDelete(session.id, session.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="size-3.5" />
                  </AppButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="flex flex-col bg-white dark:bg-sevenpreneur-charcoal w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-dashboard-border">
              <h2 className="font-brand font-semibold text-lg text-sevenpreneur-coal dark:text-white">
                {editingId ? "Edit Session" : "Tambah Session"}
              </h2>
              <button onClick={closeModal} className="text-emphasis hover:text-black dark:hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex flex-col gap-4 px-6 py-5">
              <InputCMS
                inputId="session-name"
                inputName="Nama Session"
                inputType="text"
                inputPlaceholder="Contoh: Workshop AI untuk Marketing"
                value={form.name}
                onInputChange={(v) => setForm((f) => ({ ...f, name: v }))}
                required
              />
              <InputCMS
                inputId="session-description"
                inputName="Deskripsi"
                inputType="text"
                inputPlaceholder="Deskripsi singkat session"
                value={form.description}
                onInputChange={(v) => setForm((f) => ({ ...f, description: v }))}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <SelectCMS
                  selectId="session-method"
                  selectName="Metode"
                  selectPlaceholder="Pilih metode"
                  value={form.method}
                  onChange={(v) => setForm((f) => ({ ...f, method: v }))}
                  options={METHOD_OPTIONS}
                  required
                />
                <SelectCMS
                  selectId="session-status"
                  selectName="Status"
                  selectPlaceholder="Pilih status"
                  value={form.status}
                  onChange={(v) => setForm((f) => ({ ...f, status: v }))}
                  options={STATUS_OPTIONS}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold font-bodycopy pl-1">
                  Tanggal & Waktu <span className="text-destructive">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.meeting_date}
                  onChange={(e) => setForm((f) => ({ ...f, meeting_date: e.target.value }))}
                  className="flex w-full p-2 bg-white font-medium font-bodycopy text-sm rounded-md border focus:outline-none focus:border-tertiary focus:outline-primary/15 focus:outline-4"
                />
              </div>
              <InputCMS
                inputId="session-meeting-url"
                inputName="Link Meeting (opsional)"
                inputType="url"
                inputPlaceholder="https://meet.google.com/..."
                value={form.meeting_url}
                onInputChange={(v) => setForm((f) => ({ ...f, meeting_url: v }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputCMS
                  inputId="session-location-name"
                  inputName="Nama Lokasi (opsional)"
                  inputType="text"
                  inputPlaceholder="Contoh: Aula Utama"
                  value={form.location_name}
                  onInputChange={(v) => setForm((f) => ({ ...f, location_name: v }))}
                />
                <InputCMS
                  inputId="session-location-url"
                  inputName="Link Lokasi (opsional)"
                  inputType="url"
                  inputPlaceholder="https://maps.google.com/..."
                  value={form.location_url}
                  onInputChange={(v) => setForm((f) => ({ ...f, location_url: v }))}
                />
              </div>
              <InputCMS
                inputId="session-recording-url"
                inputName="Link Recording (opsional)"
                inputType="url"
                inputPlaceholder="https://youtube.com/..."
                value={form.recording_url}
                onInputChange={(v) => setForm((f) => ({ ...f, recording_url: v }))}
              />
              <InputCMS
                inputId="session-feedback-form"
                inputName="Link Feedback Form (opsional)"
                inputType="url"
                inputPlaceholder="https://forms.google.com/..."
                value={form.feedback_form}
                onInputChange={(v) => setForm((f) => ({ ...f, feedback_form: v }))}
              />
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-dashboard-border">
              <AppButton variant="light" size="medium" onClick={closeModal}>
                Batal
              </AppButton>
              <AppButton variant="primary" size="medium" onClick={handleSubmit} disabled={isPending}>
                {isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Buat Session"}
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
