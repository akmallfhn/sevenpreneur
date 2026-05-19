"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import AppInput from "@/components/fields/AppInput";
import AppNumberInput from "@/components/fields/AppNumberInput";
import AppSelect from "@/components/fields/AppSelect";
import AppTextArea from "@/components/fields/AppTextArea";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppPageState from "@/components/states/AppPageState";
import { supabase } from "@/lib/supabase";
import { setSessionToken, trpc } from "@/trpc/client";
import { AilUseCaseFrequency } from "@prisma/client";
import dayjs from "dayjs";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock,
  FileText,
  FileUp,
  Layers,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
  Send,
  SquarePen,
  Tag,
  UploadCloud,
  Wand2,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const OUTCOME_MAX_BYTES = 20 * 1024 * 1024;
const OUTCOME_ACCEPT = ".pdf,.png,.jpg,.jpeg,.mp4";
const OUTCOME_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "video/mp4",
];

function FieldRow({
  icon,
  label,
  helper,
  required,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="size-9 shrink-0 rounded-md border border-dashboard-border bg-card-inside-bg flex items-center justify-center text-foreground dark:text-gray-300">
        {icon}
      </div>
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <label className="flex items-center gap-0.5 text-sm font-semibold font-read text-foreground dark:text-white">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
        {children}
        {helper && (
          <p className="text-xs font-read text-gray-500 dark:text-gray-400">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}

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

export default function SubmitUseCaseAILN({
  sessionToken,
  useCaseId,
}: {
  sessionToken: string;
  useCaseId: number;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const utils = trpc.useUtils();
  const assignmentQ = trpc.ailene.read.useCaseAssignment.useQuery({
    use_case_id: useCaseId,
  });
  const submitM = trpc.ailene.update.submitUseCaseAssignment.useMutation();

  const a = assignmentQ.data?.assignment;

  const [formData, setFormData] = useState<{
    outcomeProof: string;
    outcomeFileName: string | null;
    outcomeLinkInput: string;
    hoursSaved: string;
    aiTool: string;
    frequency: AilUseCaseFrequency | "";
    description: string;
  }>({
    outcomeProof: "",
    outcomeFileName: null,
    outcomeLinkInput: "",
    hoursSaved: "",
    aiTool: "",
    frequency: "",
    description: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!a) return;
    const existing = a.outcome_proof ?? "";
    // Heuristic: if URL is from our Supabase storage, treat as uploaded file
    // (show file chip). Otherwise treat as pasted link.
    const isUploaded =
      !!existing && existing.includes("/storage/v1/object/public/");
    setFormData({
      outcomeProof: existing,
      outcomeFileName: isUploaded
        ? decodeURIComponent(existing.split("/").pop() ?? "uploaded file")
        : null,
      outcomeLinkInput: isUploaded ? "" : existing,
      hoursSaved:
        a.hours_saved !== null && a.hours_saved !== undefined
          ? String(a.hours_saved)
          : "",
      aiTool: a.ai_tool ?? "",
      frequency: a.frequency ?? "",
      description: a.description ?? "",
    });
  }, [a]);

  const handleUploadFile = async (file: File) => {
    if (file.size < 1) return;
    if (file.size > OUTCOME_MAX_BYTES) {
      toast.error("Ukuran file maksimal 20MB.");
      return;
    }
    if (!OUTCOME_MIME_TYPES.includes(file.type)) {
      toast.error("Format tidak didukung. Gunakan PDF, PNG, JPG, atau MP4.");
      return;
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `ailene/use-case-outcomes/${useCaseId}-${Date.now()}-${safeName}`;

    setIsUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("sevenpreneur")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        toast.error("Gagal upload file.", { description: uploadError.message });
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("sevenpreneur")
        .getPublicUrl(filePath);
      const url = publicUrlData?.publicUrl;
      if (!url) {
        toast.error("Gagal ambil URL file.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        outcomeProof: url,
        outcomeFileName: file.name,
        outcomeLinkInput: "",
      }));
    } catch (err) {
      toast.error("Error upload", { description: `${err}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleUploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLocked || isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void handleUploadFile(file);
  };

  const handleLinkChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      outcomeProof: val,
      outcomeLinkInput: val,
      outcomeFileName: null,
    }));
  };

  const handleClearOutcomeFile = () => {
    setFormData((prev) => ({
      ...prev,
      outcomeProof: "",
      outcomeFileName: null,
    }));
  };

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
    if (!formData.outcomeProof.trim()) {
      toast.error("Outcome / bukti hasil wajib diisi.");
      return;
    }
    const hoursNum = Number(formData.hoursSaved);
    if (!Number.isFinite(hoursNum) || hoursNum < 0) {
      toast.error("Hours saved harus angka non-negatif.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Deskripsi wajib diisi.");
      return;
    }
    if (!formData.aiTool.trim()) {
      toast.error("AI tool wajib diisi.");
      return;
    }
    if (!formData.frequency) {
      toast.error("Pilih frekuensi pemakaian.");
      return;
    }

    submitM.mutate(
      {
        use_case_id: useCaseId,
        outcome_proof: formData.outcomeProof.trim(),
        hours_saved: hoursNum,
        description: formData.description.trim(),
        ai_tool: formData.aiTool.trim(),
        frequency: formData.frequency as AilUseCaseFrequency,
      },
      {
        onSuccess: () => {
          toast.success("Tugas berhasil dikirim.");
          utils.ailene.read.useCaseAssignment.invalidate({
            use_case_id: useCaseId,
          });
          utils.ailene.list.assignedUseCases.invalidate();
        },
        onError: (err) => {
          toast.error("Gagal kirim", { description: err.message });
        },
      }
    );
  };

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6 py-4">
        {/* Header — MaterialDetailsAILN-style: big title + badge row */}
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold leading-tight font-read text-sevenpreneur-coal dark:text-white">
            {a.use_case.name}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300">
              <Layers className="h-3 w-3 text-red-500" />
              <span className="font-medium">
                Level {a.use_case.level.level_number}
              </span>
            </span>

            {a.use_case.categories.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-dashboard-border bg-white px-2 py-1 dark:bg-card-bg dark:text-gray-300"
              >
                <Tag className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">{c.name}</span>
              </span>
            ))}

            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-semibold ${meta.cls}`}
            >
              <StatusIcon className="h-3 w-3" />
              {meta.label}
            </span>
          </div>

          {a.message && (
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MessageSquare className="size-3.5 shrink-0 mt-0.5" />
              <span className="italic">&ldquo;{a.message}&rdquo;</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.8fr] lg:items-start">
          {/* LEFT: Deskripsi use case + champion review notes */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-5 dark:bg-card-bg">
              <div className="size-10 rounded-full bg-black flex items-center justify-center text-white dark:bg-white dark:text-black">
                <FileText className="size-5" />
              </div>
              <h2 className="text-lg font-bold font-read text-foreground dark:text-white">
                Deskripsi Use Case
              </h2>
              <p className="text-sm whitespace-pre-wrap font-read text-gray-700 dark:text-gray-200">
                {a.use_case.description}
              </p>

              <div className="flex items-center gap-2 border-t border-dashboard-border pt-3 text-xs font-read">
                <CalendarClock
                  className={`size-3.5 shrink-0 ${
                    deadlineOverdue
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span
                  className={
                    deadlineOverdue
                      ? "font-semibold text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-300"
                  }
                >
                  Deadline: {deadlineDate.format("ddd, D MMM YYYY · HH:mm")}
                  {deadlineOverdue ? " (lewat)" : ""}
                </span>
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
          </div>

          {/* RIGHT: Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-lg border border-dashboard-border bg-white p-4 dark:bg-card-bg"
          >
            <h2 className="text-base font-bold font-read text-foreground dark:text-white">
              {isLocked ? "Submission kamu" : "Laporkan use case-mu"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldRow
                icon={<Clock className="size-4" />}
                label="Hours Saved (Jam)"
                helper="Estimasi waktu yang berhasil dihemat."
                required
              >
                <AppNumberInput
                  inputId="uc-hours"
                  inputConfig="decimal"
                  inputPlaceholder="e.g. 3.5"
                  value={formData.hoursSaved}
                  onInputChange={(v) =>
                    setFormData((prev) => ({ ...prev, hoursSaved: v }))
                  }
                  variant="AILN"
                  disabled={isLocked}
                  required
                />
              </FieldRow>
              <FieldRow
                icon={<Wand2 className="size-4" />}
                label="AI Tool yang Dipakai"
                helper="Sebutkan semua tool utama yang digunakan."
                required
              >
                <AppInput
                  inputId="uc-tool"
                  inputType="text"
                  inputPlaceholder="e.g. ChatGPT, Claude, Gemini, NotebookLM"
                  value={formData.aiTool}
                  onInputChange={(v) =>
                    setFormData((prev) => ({ ...prev, aiTool: v }))
                  }
                  characterLength={255}
                  variant="AILN"
                  disabled={isLocked}
                  required
                />
              </FieldRow>
            </div>

            <FieldRow
              icon={<BarChart3 className="size-4" />}
              label="Frekuensi Pemakaian"
              helper="Seberapa sering use case ini kamu gunakan dalam pekerjaan."
              required
            >
              <AppSelect
                selectId="uc-frequency"
                selectPlaceholder="Pilih frekuensi…"
                value={formData.frequency || null}
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    frequency: (v as AilUseCaseFrequency | null) ?? "",
                  }))
                }
                variant="AILN"
                disabled={isLocked}
                required
                options={FREQUENCY_OPTIONS.map((o) => ({
                  label: o.label,
                  value: o.value,
                }))}
              />
            </FieldRow>

            <FieldRow
              icon={<SquarePen className="size-4" />}
              label="Deskripsi Penerapan"
              required
            >
              <div className="flex flex-col gap-1">
                <AppTextArea
                  textAreaId="uc-description"
                  textAreaPlaceholder="Ceritakan gimana kamu pakai AI di pekerjaanmu, langkah-langkahnya, dan dampak konkret yang kamu rasakan."
                  value={formData.description}
                  onTextAreaChange={(v) =>
                    setFormData((prev) => ({ ...prev, description: v }))
                  }
                  characterLength={5000}
                  textAreaHeight="min-h-[160px]"
                  variant="AILN"
                  disabled={isLocked}
                  required
                />
                <div className="self-end text-xs font-read text-gray-400">
                  {formData.description.length}/5000 karakter
                </div>
              </div>
            </FieldRow>

            {/* Bukti Outcome — upload file OR paste link, both write to outcome_proof */}
            <FieldRow
              icon={<UploadCloud className="size-4" />}
              label="Bukti Outcome"
              helper="Upload bukti hasil kerja atau link yang menunjukkan dampak nyata."
              required
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
                {/* Upload zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!isLocked && !isUploading) setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!isLocked && !isUploading)
                      fileInputRef.current?.click();
                  }}
                  className={`relative flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed px-4 py-6 text-center transition ${
                    isLocked || isUploading
                      ? "cursor-not-allowed opacity-60 border-dashboard-border bg-card-inside-bg"
                      : isDragOver
                        ? "border-black bg-black/5 cursor-pointer dark:border-white dark:bg-white/5"
                        : "border-dashboard-border bg-card-inside-bg cursor-pointer hover:border-foreground/40"
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="size-5 animate-spin text-gray-500" />
                  ) : (
                    <FileUp className="size-5 text-gray-500 dark:text-gray-400" />
                  )}
                  <p className="text-sm font-medium font-read text-foreground dark:text-gray-200">
                    {isUploading
                      ? "Mengupload…"
                      : "Upload file atau drag & drop di sini"}
                  </p>
                  <p className="text-[11px] font-read text-gray-500 dark:text-gray-400">
                    PDF, PNG, JPG, MP4 · Maks. 20MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={OUTCOME_ACCEPT}
                    className="hidden"
                    onChange={handleFilePick}
                    disabled={isLocked || isUploading}
                  />
                </div>

                {/* "atau" separator */}
                <div className="flex items-center justify-center text-xs font-medium font-read text-gray-400 md:flex-col md:gap-1">
                  <span className="hidden h-full w-px bg-dashboard-border md:block" />
                  <span>atau</span>
                  <span className="hidden h-full w-px bg-dashboard-border md:block" />
                </div>

                {/* Link input */}
                <div className="flex flex-col justify-center">
                  <AppInput
                    inputId="uc-outcome-link"
                    inputType="url"
                    inputIcon={<LinkIcon className="size-4" />}
                    inputPlaceholder="Tempel link (Google Drive, Notion, dll)"
                    value={formData.outcomeLinkInput}
                    onInputChange={handleLinkChange}
                    characterLength={500}
                    variant="AILN"
                    disabled={isLocked || isUploading}
                  />
                </div>
              </div>

              {/* Uploaded file chip */}
              {formData.outcomeFileName && (
                <div className="flex items-center justify-between gap-2 rounded-md border border-dashboard-border bg-card-inside-bg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileUp className="size-4 shrink-0 text-foreground dark:text-gray-300" />
                    <span className="truncate text-xs font-medium font-read text-foreground dark:text-gray-200">
                      {formData.outcomeFileName}
                    </span>
                  </div>
                  {!isLocked && (
                    <button
                      type="button"
                      onClick={handleClearOutcomeFile}
                      className="rounded p-1 text-gray-500 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5 dark:hover:text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              )}
            </FieldRow>

            {!isLocked && (
              <ButtonAILN
                type="submit"
                variant="primary"
                disabled={submitM.isPending}
                className="w-fit self-end"
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
      </div>
    </PageContainerAILN>
  );
}
