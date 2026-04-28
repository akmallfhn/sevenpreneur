"use client";
import { trpc } from "@/trpc/client";
import { Loader2, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import TextAreaSVP from "../fields/TextAreaSVP";

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

const LIKERT_FIELDS: {
  key: keyof Pick<
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
  label: string;
  section: "coach" | "material" | "overall";
}[] = [
  {
    key: "coach_clarity",
    label: "Seberapa jelas penjelasan coach?",
    section: "coach",
  },
  {
    key: "coach_mastery",
    label: "Seberapa dalam penguasaan materi coach?",
    section: "coach",
  },
  {
    key: "coach_responsiveness",
    label: "Seberapa responsif coach dalam menjawab pertanyaan?",
    section: "coach",
  },
  {
    key: "coach_engagement",
    label: "Seberapa engaging dan interaktif sesi bersama coach?",
    section: "coach",
  },
  {
    key: "material_relevance",
    label: "Seberapa relevan materi dengan kebutuhan bisnismu?",
    section: "material",
  },
  {
    key: "material_flow",
    label: "Seberapa baik alur penyampaian materi?",
    section: "material",
  },
  {
    key: "material_depth",
    label: "Seberapa mendalam materi yang disampaikan?",
    section: "material",
  },
  {
    key: "learning_value",
    label: "Secara keseluruhan, seberapa berharga sesi ini untukmu?",
    section: "overall",
  },
];

const TEXT_FIELDS: {
  key: keyof Pick<
    RatingForm,
    | "missing_topics"
    | "favorite_material"
    | "disliked_material"
    | "improvement_suggestion"
  >;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "favorite_material",
    label: "Apa bagian yang paling kamu sukai dari sesi ini?",
    placeholder: "Ceritakan bagian yang paling berkesan atau bermanfaat...",
  },
  {
    key: "missing_topics",
    label: "Topik apa yang menurutmu perlu ditambahkan?",
    placeholder: "Misalnya: studi kasus lebih banyak, latihan praktik, dsb...",
  },
  {
    key: "disliked_material",
    label: "Bagian mana yang menurutmu perlu diperbaiki?",
    placeholder: "Feedback kamu sangat membantu kami berkembang...",
  },
  {
    key: "improvement_suggestion",
    label: "Ada saran lain untuk meningkatkan kualitas sesi ini?",
    placeholder: "Bebas tulis apapun yang terlintas di pikiranmu...",
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
  return (
    <div className="flex items-center gap-1">
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
            fill={(hovered || value) >= star ? "#FFB21D" : "none"}
            stroke={(hovered || value) >= star ? "#FFB21D" : "#D1D5DB"}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs font-bodycopy text-emphasis">
          {
            ["", "Sangat Buruk", "Kurang", "Cukup", "Baik", "Sangat Baik"][
              value
            ]
          }
        </span>
      )}
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

  const setLikert = (key: keyof RatingForm, value: number) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const likertFields = LIKERT_FIELDS.map((f) => f.key);
    const missing = likertFields.find((k) => (form[k] as number) === 0);
    if (missing) {
      toast.warning("Mohon isi semua penilaian bintang terlebih dahulu.");
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
      missing_topics: form.missing_topics || undefined,
      favorite_material: form.favorite_material || undefined,
      disliked_material: form.disliked_material || undefined,
      improvement_suggestion: form.improvement_suggestion || undefined,
    });
  };

  const coachFields = LIKERT_FIELDS.filter((f) => f.section === "coach");
  const materialFields = LIKERT_FIELDS.filter((f) => f.section === "material");
  const overallFields = LIKERT_FIELDS.filter((f) => f.section === "overall");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/65 z-[999] p-4"
      onClick={props.onClose}
    >
      <div
        className="relative bg-white dark:bg-surface-black w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-surface-black border-b px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="font-bodycopy font-bold text-lg">
              Checkout & Feedback
            </h2>
            <p className="font-bodycopy text-sm text-emphasis mt-0.5">
              Bantu kami meningkatkan kualitas program dengan mengisi feedback
              berikut.
            </p>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="ml-4 shrink-0 text-emphasis hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          {/* Section: Coach */}
          <div className="px-6 py-5 flex flex-col gap-4 border-b">
            <h3 className="font-bodycopy font-bold text-sm uppercase tracking-widest text-emphasis">
              Tentang Coach
            </h3>
            {coachFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="font-bodycopy text-sm font-medium text-[#111111] dark:text-white">
                  {field.label}
                </label>
                <StarRating
                  value={form[field.key] as number}
                  onChange={(v) => setLikert(field.key, v)}
                />
              </div>
            ))}
          </div>

          {/* Section: Materi */}
          <div className="px-6 py-5 flex flex-col gap-4 border-b">
            <h3 className="font-bodycopy font-bold text-sm uppercase tracking-widest text-emphasis">
              Tentang Materi
            </h3>
            {materialFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="font-bodycopy text-sm font-medium text-[#111111] dark:text-white">
                  {field.label}
                </label>
                <StarRating
                  value={form[field.key] as number}
                  onChange={(v) => setLikert(field.key, v)}
                />
              </div>
            ))}
          </div>

          {/* Section: Overall */}
          <div className="px-6 py-5 flex flex-col gap-4 border-b">
            <h3 className="font-bodycopy font-bold text-sm uppercase tracking-widest text-emphasis">
              Penilaian Keseluruhan
            </h3>
            {overallFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="font-bodycopy text-sm font-medium text-[#111111] dark:text-white">
                  {field.label}
                </label>
                <StarRating
                  value={form[field.key] as number}
                  onChange={(v) => setLikert(field.key, v)}
                />
              </div>
            ))}
          </div>

          {/* Section: Pertanyaan Terbuka */}
          <div className="px-6 py-5 flex flex-col gap-4 border-b">
            <h3 className="font-bodycopy font-bold text-sm uppercase tracking-widest text-emphasis">
              Pertanyaan Terbuka
              <span className="normal-case font-normal ml-1">(opsional)</span>
            </h3>
            {TEXT_FIELDS.map((field) => (
              <TextAreaSVP
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

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-end gap-3">
            <AppButton
              type="button"
              variant="destructiveSoft"
              onClick={props.onClose}
            >
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              variant="primary"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending && (
                <Loader2 className="animate-spin size-4" />
              )}
              Submit & Check Out
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
