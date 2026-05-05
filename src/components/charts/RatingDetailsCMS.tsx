"use client";
import { Star } from "lucide-react";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

const RATING_DIMENSIONS_LEFT = [
  { key: "coach_clarity", label: "Kejelasan Penyampaian" },
  { key: "coach_mastery", label: "Penguasaan Materi" },
  { key: "coach_responsiveness", label: "Responsivitas" },
  { key: "coach_engagement", label: "Engagement & Interaktif" },
];

const RATING_DIMENSIONS_RIGHT = [
  { key: "material_relevance", label: "Relevansi Materi" },
  { key: "material_flow", label: "Alur Penyampaian" },
  { key: "material_depth", label: "Kedalaman Materi" },
  { key: "learning_value", label: "Nilai Pembelajaran" },
];

function RatingBar({ value }: { value: number | null | undefined }) {
  const v = value ?? 0;
  const pct = (v / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted-background/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFB21D] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bodycopy font-semibold w-7 text-right text-foreground">
        {v.toFixed(1)}
      </span>
    </div>
  );
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="size-5"
          fill={value >= i - 0.5 ? "#FFB21D" : "none"}
          stroke="#FFB21D"
        />
      ))}
    </div>
  );
}

interface RatingDetailsCMSProps {
  overallAvg: number | null | undefined;
  ratingCount: number;
  avgScores: Partial<Record<string, number | null | undefined>> | undefined;
  isLoading: boolean;
}

export default function RatingDetailsCMS({
  overallAvg,
  ratingCount,
  avgScores,
  isLoading,
}: RatingDetailsCMSProps) {
  return (
    <>
      <SectionContainerCMS title="Rating Overview">
        {isLoading ? (
          <AppLoadingComponents />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-brand font-bold text-4xl text-foreground">
                {overallAvg != null ? overallAvg.toFixed(2) : "0.00"}
              </span>
              <span className="font-bodycopy font-medium text-emphasis text-lg">
                / 5
              </span>
            </div>
            <StarDisplay value={overallAvg ?? 0} />
            <p className="text-sm font-bodycopy text-emphasis mt-1">
              Dari {ratingCount} feedback
            </p>
          </div>
        )}
      </SectionContainerCMS>

      <SectionContainerCMS title="Rating by Aspect">
        {isLoading ? (
          <AppLoadingComponents />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex flex-col gap-3">
              {RATING_DIMENSIONS_LEFT.map((d) => (
                <div key={d.key} className="flex flex-col gap-1">
                  <span className="text-xs font-bodycopy text-emphasis">
                    {d.label}
                  </span>
                  <RatingBar value={avgScores?.[d.key] as number | null} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {RATING_DIMENSIONS_RIGHT.map((d) => (
                <div key={d.key} className="flex flex-col gap-1">
                  <span className="text-xs font-bodycopy text-emphasis">
                    {d.label}
                  </span>
                  <RatingBar value={avgScores?.[d.key] as number | null} />
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionContainerCMS>
    </>
  );
}
