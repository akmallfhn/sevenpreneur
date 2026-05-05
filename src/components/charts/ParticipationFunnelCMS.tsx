"use client";
import SectionContainerCMS from "../cards/SectionContainerCMS";

const FUNNEL_BANDS = [
  { clip: "polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)", bg: "bg-primary" },
  {
    clip: "polygon(8% 0%, 92% 0%, 84% 100%, 16% 100%)",
    bg: "bg-primary/[.85]",
  },
  {
    clip: "polygon(16% 0%, 84% 0%, 76% 100%, 24% 100%)",
    bg: "bg-primary/[.75]",
  },
  {
    clip: "polygon(24% 0%, 76% 0%, 68% 100%, 32% 100%)",
    bg: "bg-primary/[.65]",
  },
];

interface ParticipationFunnelCMSProps {
  registeredCount: number;
  checkInCount: number;
  checkOutCount: number;
  ratingCount: number;
}

export default function ParticipationFunnelCMS({
  registeredCount,
  checkInCount,
  checkOutCount,
  ratingCount,
}: ParticipationFunnelCMSProps) {
  const funnelSteps = [
    { label: "Terdaftar", count: registeredCount },
    { label: "Check-in", count: checkInCount },
    { label: "Check-out", count: checkOutCount },
    { label: "Feedback", count: ratingCount },
  ];
  const funnelMax = registeredCount > 0 ? registeredCount : checkInCount;

  return (
    <SectionContainerCMS title="Participation Funnel">
      <div className="flex gap-4 items-center">
        <div className="flex flex-col w-24 shrink-0">
          {FUNNEL_BANDS.map((band, i) => (
            <div
              key={i}
              className={`h-10 ${band.bg}`}
              style={{ clipPath: band.clip }}
            />
          ))}
        </div>
        <div
          className="flex flex-col justify-around flex-1"
          style={{ height: 160 }}
        >
          {funnelSteps.map((step) => {
            const pct =
              funnelMax > 0 && step.count != null
                ? Math.round((step.count / funnelMax) * 100)
                : null;
            return (
              <div
                key={step.label}
                className="flex items-center justify-between font-bodycopy text-sm"
              >
                <span className="text-emphasis font-medium">{step.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-foreground">
                    {step.count ?? "—"}
                  </span>
                  {pct !== null && (
                    <span className="text-emphasis text-xs">{pct}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainerCMS>
  );
}
