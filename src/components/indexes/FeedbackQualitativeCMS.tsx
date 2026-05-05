"use client";
import { Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

type FeedbackTheme = {
  theme: string;
  count: number;
  example_quotes: string[];
};

type FeedbackData = {
  positive: FeedbackTheme[];
  negative: FeedbackTheme[];
  neutral: FeedbackTheme[];
};

function ThemeCard({
  theme,
  badgeClass,
  cardClass,
}: {
  theme: FeedbackTheme;
  badgeClass: string;
  cardClass: string;
}) {
  return (
    <div className={`flex flex-col gap-1 p-2.5 rounded-md border ${cardClass}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bodycopy font-semibold text-foreground capitalize leading-snug">
          {theme.theme}
        </span>
        <span
          className={`text-xs font-bodycopy font-bold px-1.5 py-0.5 rounded-full shrink-0 ${badgeClass}`}
        >
          {theme.count}×
        </span>
      </div>
      {theme.example_quotes[0] && (
        <p className="text-xs font-bodycopy text-emphasis italic line-clamp-2">
          &ldquo;{theme.example_quotes[0]}&rdquo;
        </p>
      )}
    </div>
  );
}

function EmptyTheme() {
  return (
    <p className="text-xs font-bodycopy text-emphasis">
      Tidak ada tema terdeteksi.
    </p>
  );
}

interface FeedbackQualitativeCMSProps {
  feedbackData: FeedbackData | null | undefined;
  isLoading: boolean;
}

export default function FeedbackQualitativeCMS({
  feedbackData,
  isLoading,
}: FeedbackQualitativeCMSProps) {
  return (
    <SectionContainerCMS title="Analisis Feedback Kualitatif">
      {isLoading ? (
        <AppLoadingComponents />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-success">
              <div className="flex items-center justify-center size-7 bg-success-background rounded-full">
                <ThumbsUp className="size-3.5" />
              </div>
              <span className="text-sm font-bodycopy font-semibold">
                Positif
              </span>
              <span className="text-xs text-emphasis ml-auto font-bodycopy">
                {feedbackData?.positive.length ?? 0} tema
              </span>
            </div>
            {feedbackData?.positive.length ? (
              feedbackData.positive.map((t) => (
                <ThemeCard
                  key={t.theme}
                  theme={t}
                  badgeClass="bg-success/10 text-success"
                  cardClass="bg-success/5 border-success/20"
                />
              ))
            ) : (
              <EmptyTheme />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-destructive">
              <div className="flex items-center justify-center size-7 bg-destructive-soft-background rounded-full">
                <ThumbsDown className="size-3.5" />
              </div>
              <span className="text-sm font-bodycopy font-semibold">
                Negatif
              </span>
              <span className="text-xs text-emphasis ml-auto font-bodycopy">
                {feedbackData?.negative.length ?? 0} tema
              </span>
            </div>
            {feedbackData?.negative.length ? (
              feedbackData.negative.map((t) => (
                <ThemeCard
                  key={t.theme}
                  theme={t}
                  badgeClass="bg-destructive/10 text-destructive"
                  cardClass="bg-destructive/5 border-destructive/20"
                />
              ))
            ) : (
              <EmptyTheme />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-warning">
              <div className="flex items-center justify-center size-7 bg-warning-background rounded-full">
                <Lightbulb className="size-3.5" />
              </div>
              <span className="text-sm font-bodycopy font-semibold">
                Netral / Saran
              </span>
              <span className="text-xs text-emphasis ml-auto font-bodycopy">
                {feedbackData?.neutral.length ?? 0} tema
              </span>
            </div>
            {feedbackData?.neutral.length ? (
              feedbackData.neutral.map((t) => (
                <ThemeCard
                  key={t.theme}
                  theme={t}
                  badgeClass="bg-warning/10 text-warning"
                  cardClass="bg-warning/5 border-warning/20"
                />
              ))
            ) : (
              <EmptyTheme />
            )}
          </div>
        </div>
      )}
    </SectionContainerCMS>
  );
}
