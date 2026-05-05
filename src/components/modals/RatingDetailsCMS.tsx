"use client";
import { trpc } from "@/trpc/client";
import Image from "next/image";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import AppSheet from "./AppSheet";

const RATING_DIMENSIONS = [
  {
    key: "coach_clarity" as const,
    label: "Kejelasan Penyampaian",
    group: "Coach",
  },
  { key: "coach_mastery" as const, label: "Penguasaan Materi", group: "Coach" },
  {
    key: "coach_responsiveness" as const,
    label: "Responsivitas",
    group: "Coach",
  },
  {
    key: "coach_engagement" as const,
    label: "Engagement & Interaktif",
    group: "Coach",
  },
  {
    key: "material_relevance" as const,
    label: "Relevansi Materi",
    group: "Material",
  },
  {
    key: "material_flow" as const,
    label: "Alur Penyampaian",
    group: "Material",
  },
  {
    key: "material_depth" as const,
    label: "Kedalaman Materi",
    group: "Material",
  },
  {
    key: "learning_value" as const,
    label: "Nilai Pembelajaran",
    group: "Material",
  },
];

const QUALITATIVE_FIELDS = [
  { key: "favorite_material" as const, label: "Materi Favorit" },
  { key: "missing_topics" as const, label: "Topik yang Kurang" },
  { key: "disliked_material" as const, label: "Yang Tidak Disukai" },
  { key: "improvement_suggestion" as const, label: "Saran Perbaikan" },
];

function RatingBar({ value }: { value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted-background/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFB21D] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bodycopy font-semibold w-7 text-right text-foreground">
        {value.toFixed(2)}
      </span>
    </div>
  );
}

interface RatingDetailsCMSProps {
  sessionToken: string;
  learningId: number;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RatingDetailsCMS({
  sessionToken,
  learningId,
  userId,
  isOpen,
  onClose,
}: RatingDetailsCMSProps) {
  const { data, isLoading, isError } = trpc.read.userRating.useQuery(
    { learning_id: learningId, user_id: userId },
    { enabled: !!sessionToken && isOpen }
  );

  const r = data?.rating;

  const overallAvg = r
    ? (r.coach_clarity +
        r.coach_mastery +
        r.coach_responsiveness +
        r.coach_engagement +
        r.material_relevance +
        r.material_flow +
        r.material_depth +
        r.learning_value) /
      8
    : null;

  const hasQualitative = r ? QUALITATIVE_FIELDS.some((f) => !!r[f.key]) : false;

  return (
    <AppSheet
      sheetName={"Rating Details"}
      sheetDescription="Individual rating breakdown"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-5">
        {isLoading && <AppLoadingComponents />}
        {isError && <AppErrorComponents />}

        {data && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card-inside-bg border border-dashboard-border">
              <Image
                src={
                  data.avatar ||
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                }
                alt={data.full_name}
                width={32}
                height={32}
                className="rounded-full object-cover size-10 shrink-0"
              />
              <div className="flex flex-col">
                <p className="text-sm font-bodycopy font-semibold text-foreground">
                  {data.full_name}
                </p>
                {overallAvg !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="font-bodycopy font-bold text-base text-foreground">
                      {overallAvg.toFixed(2)}
                    </span>
                    <span className="text-emphasis font-bodycopy text-xs">
                      / 5
                    </span>
                  </div>
                ) : (
                  <p className="text-xs font-bodycopy text-emphasis">
                    No rating submitted
                  </p>
                )}
              </div>
            </div>

            {r && (
              <>
                {/* Quantitative */}
                {(["Coach", "Material"] as const).map((group) => (
                  <div key={group} className="flex flex-col gap-2">
                    <p className="text-xs font-bodycopy font-semibold uppercase tracking-wider text-emphasis">
                      {group}
                    </p>
                    {RATING_DIMENSIONS.filter((d) => d.group === group).map(
                      (d) => (
                        <div
                          key={d.key}
                          className="flex flex-col gap-1.5 p-2.5 rounded-md border border-dashboard-border bg-card-inside-bg"
                        >
                          <span className="text-xs font-bodycopy text-emphasis">
                            {d.label}
                          </span>
                          <RatingBar value={r[d.key]} />
                        </div>
                      )
                    )}
                  </div>
                ))}

                {/* Qualitative */}
                {hasQualitative && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-bodycopy font-semibold uppercase tracking-wider text-emphasis">
                      Written Feedback
                    </p>
                    {QUALITATIVE_FIELDS.filter((f) => !!r[f.key]).map((f) => (
                      <div
                        key={f.key}
                        className="flex flex-col gap-1 p-2.5 rounded-md border border-dashboard-border bg-card-inside-bg"
                      >
                        <span className="text-xs font-bodycopy font-semibold text-emphasis">
                          {f.label}
                        </span>
                        <p className="text-sm font-bodycopy text-foreground">
                          {r[f.key]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppSheet>
  );
}
