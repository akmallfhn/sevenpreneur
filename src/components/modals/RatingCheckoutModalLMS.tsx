"use client";
import { trpc } from "@/trpc/client";
import {
  BookOpen,
  GraduationCap,
  Loader2,
  MessageSquare,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppTextArea from "../fields/AppTextArea";

interface RatingCheckoutModalLMSProps {
  learningId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RatingForm {
  coach_clarity: number;
  coach_mastery: number;
  coach_responsiveness: number;
  coach_engagement: number;
  material_relevance: number;
  material_flow: number;
  material_depth: number;
  learning_value: number;
  missing_topics: string;
  favorite_material: string;
  disliked_material: string;
  improvement_suggestion: string;
}

const EMPTY_FORM: RatingForm = {
  coach_clarity: 0,
  coach_mastery: 0,
  coach_responsiveness: 0,
  coach_engagement: 0,
  material_relevance: 0,
  material_flow: 0,
  material_depth: 0,
  learning_value: 0,
  missing_topics: "",
  favorite_material: "",
  disliked_material: "",
  improvement_suggestion: "",
};

type LikertKey = keyof Pick<
  RatingForm,
  | "coach_clarity"
  | "coach_mastery"
  | "coach_responsiveness"
  | "coach_engagement"
  | "material_relevance"
  | "material_flow"
  | "material_depth"
  | "learning_value"
>;

type TextKey = keyof Pick<
  RatingForm,
  | "missing_topics"
  | "favorite_material"
  | "disliked_material"
  | "improvement_suggestion"
>;

const SECTIONS: {
  title: string;
  description: string;
  icon: React.ElementType;
  likertFields?: { key: LikertKey; label: string }[];
  textFields?: { key: TextKey; label: string; placeholder: string }[];
}[] = [
  {
    title: "Tentang Coach",
    description: "Nilai performa coach sesi ini",
    icon: GraduationCap,
    likertFields: [
      { key: "coach_clarity", label: "Seberapa jelas penjelasan coach?" },
      {
        key: "coach_mastery",
        label: "Seberapa dalam penguasaan materi coach?",
      },
      {
        key: "coach_responsiveness",
        label: "Seberapa responsif coach dalam menjawab pertanyaan?",
      },
      {
        key: "coach_engagement",
        label: "Seberapa engaging dan interaktif sesi bersama coach?",
      },
    ],
  },
  {
    title: "Tentang Materi",
    description: "Nilai kualitas materi yang disampaikan",
    icon: BookOpen,
    likertFields: [
      {
        key: "material_relevance",
        label: "Seberapa relevan materi dengan kebutuhan bisnismu?",
      },
      { key: "material_flow", label: "Seberapa baik alur penyampaian materi?" },
      {
        key: "material_depth",
        label: "Seberapa mendalam materi yang disampaikan?",
      },
      {
        key: "learning_value",
        label: "Secara keseluruhan, seberapa berharga sesi ini untukmu?",
      },
    ],
  },
  {
    title: "Feedback Tambahan",
    description: "Ceritakan pengalamanmu lebih lanjut",
    icon: MessageSquare,
    textFields: [
      {
        key: "favorite_material",
        label: "Apa bagian yang paling kamu sukai?",
        placeholder: "Ceritakan bagian yang paling berkesan atau bermanfaat...",
      },
      {
        key: "missing_topics",
        label: "Topik apa yang perlu ditambahkan?",
        placeholder:
          "Misalnya: studi kasus lebih banyak, latihan praktik, dsb...",
      },
      {
        key: "disliked_material",
        label: "Bagian mana yang perlu diperbaiki?",
        placeholder: "Feedback kamu sangat membantu kami berkembang...",
      },
      {
        key: "improvement_suggestion",
        label: "Ada saran lain untuk meningkatkan kualitas sesi?",
        placeholder: "Bebas tulis apapun yang terlintas di pikiranmu...",
      },
    ],
  },
];

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className="size-7"
              fill={active >= star ? "#FFB21D" : "none"}
              stroke={active >= star ? "#FFB21D" : "#D1D5DB"}
            />
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] font-bodycopy text-emphasis px-0.5">
        <span>Sangat Buruk</span>
        <span>Sangat Baik</span>
      </div>
    </div>
  );
}

function ModalContent(props: RatingCheckoutModalLMSProps) {
  const [form, setForm] = useState<RatingForm>(EMPTY_FORM);

  const submitMutation = trpc.create.submitRating.useMutation({
    onSuccess: () => {
      toast.success("Terima kasih! Feedback kamu sudah diterima.");
      props.onSuccess();
      props.onClose();
    },
    onError: (err) => {
      toast.error(err.message || "Gagal submit. Coba lagi.");
    },
  });

  const setLikert = (key: LikertKey, value: number) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allLikertKeys: LikertKey[] = [
      "coach_clarity",
      "coach_mastery",
      "coach_responsiveness",
      "coach_engagement",
      "material_relevance",
      "material_flow",
      "material_depth",
      "learning_value",
    ];
    const missingLikert = allLikertKeys.find((k) => form[k] === 0);
    if (missingLikert) {
      toast.warning("Mohon isi semua penilaian bintang terlebih dahulu.");
      return;
    }

    const allTextKeys: TextKey[] = [
      "favorite_material",
      "missing_topics",
      "disliked_material",
      "improvement_suggestion",
    ];
    const missingText = allTextKeys.find((k) => !form[k].trim());
    if (missingText) {
      toast.warning("Mohon isi semua pertanyaan feedback terlebih dahulu.");
      return;
    }

    submitMutation.mutate({
      learning_id: props.learningId,
      coach_clarity: form.coach_clarity,
      coach_mastery: form.coach_mastery,
      coach_responsiveness: form.coach_responsiveness,
      coach_engagement: form.coach_engagement,
      material_relevance: form.material_relevance,
      material_flow: form.material_flow,
      material_depth: form.material_depth,
      learning_value: form.learning_value,
      missing_topics: form.missing_topics,
      favorite_material: form.favorite_material,
      disliked_material: form.disliked_material,
      improvement_suggestion: form.improvement_suggestion,
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/65 z-[999] p-4"
      onClick={props.onClose}
    >
      <div
        className="relative bg-white dark:bg-card-bg w-full max-w-[820px] max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sb-bg sm:w-[220px] sm:shrink-0 flex flex-col p-5 gap-5 sm:overflow-y-auto">
          {/* Header */}
          <div>
            <p className="text-[10px] font-bold font-bodycopy uppercase tracking-widest text-[#7C3AED]/60 mb-1">
              Checkout & Feedback
            </p>
            <p className="text-sm font-bold font-bodycopy text-[#111] dark:text-foreground">
              Isi semua pertanyaan di bawah ini
            </p>
          </div>
          <div className="hidden sm:flex flex-col gap-3">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="size-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold font-bodycopy text-[#111] dark:text-foreground leading-tight">
                      {section.title}
                    </p>
                    <p className="text-[11px] font-bodycopy text-emphasis mt-0.5 leading-tight">
                      {section.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational card — desktop only */}
          <div className="hidden sm:block mt-auto">
            <div className="bg-white dark:bg-card-inside-bg rounded-xl p-3.5 border border-[#EDE9FE] dark:border-dashboard-border">
              <p className="text-xl mb-1">⭐</p>
              <p className="text-xs font-bold font-bodycopy text-[#111] dark:text-foreground">
                Feedback-mu berarti!
              </p>
              <p className="text-[11px] text-emphasis font-bodycopy mt-1 leading-relaxed">
                Bantu kami jadi lebih baik untuk semua peserta Sevenpreneur.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right Panel ────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-dashboard-border px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-[#FEF9C3] dark:bg-yellow-950 flex items-center justify-center shrink-0">
                <Star className="size-5 fill-[#FFB21D] stroke-[#FFB21D]" />
              </div>
              <div>
                <h2 className="font-bodycopy font-bold text-[15px] text-[#111] dark:text-foreground">
                  Checkout &amp; Feedback
                </h2>
                <p className="font-bodycopy text-[12px] text-emphasis">
                  Bantu kami meningkatkan kualitas program
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={props.onClose}
              className="text-emphasis hover:text-foreground transition-colors ml-4 shrink-0"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.title} className="flex flex-col gap-3">
                  {/* Section header */}
                  <div className="flex items-center gap-3 bg-[#F5F3FF] dark:bg-[#1a1640] rounded-xl p-4">
                    <div className="size-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                      <Icon className="size-5 text-[#7C3AED]" />
                    </div>
                    <div>
                      <h3 className="font-bold font-bodycopy text-[#111] dark:text-foreground text-sm">
                        {section.title}
                      </h3>
                      <p className="text-[12px] text-emphasis font-bodycopy">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Likert cards */}
                  {section.likertFields && section.likertFields.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {section.likertFields.map((field, index) => (
                        <div
                          key={field.key}
                          className="bg-white dark:bg-card-inside-bg border border-gray-200 dark:border-dashboard-border rounded-xl p-4 flex flex-col gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <span className="size-6 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold font-bodycopy flex items-center justify-center shrink-0 mt-0.5">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <p className="text-sm font-medium font-bodycopy text-[#111] dark:text-foreground">
                              {field.label}
                            </p>
                          </div>
                          <StarRating
                            value={form[field.key] as number}
                            onChange={(v) => setLikert(field.key, v)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text fields */}
                  {section.textFields && section.textFields.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {section.textFields.map((field) => (
                        <AppTextArea
                          variant="LMS"
                          key={field.key}
                          textAreaId={field.key}
                          textAreaName={field.label}
                          textAreaPlaceholder={field.placeholder}
                          textAreaHeight="min-h-[80px]"
                          value={form[field.key] as string}
                          onTextAreaChange={(v) =>
                            setForm((p) => ({ ...p, [field.key]: v }))
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-dashboard-border px-5 py-3.5 flex items-center justify-between shrink-0 bg-white dark:bg-card-bg">
            <AppButton
              type="button"
              variant="destructiveSoft"
              onClick={props.onClose}
            >
              Batal
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending && (
                <Loader2 className="animate-spin size-4" />
              )}
              Submit &amp; Check Out
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RatingCheckoutModalLMS(
  props: RatingCheckoutModalLMSProps
) {
  useEffect(() => {
    document.body.style.overflow = props.isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

  if (!props.isOpen) return null;
  return <ModalContent {...props} />;
}
