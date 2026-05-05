"use client";
import { setSessionToken, trpc } from "@/trpc/client";
import { Star } from "lucide-react";
import { useEffect } from "react";
import PageContainerCMS from "./PageContainerCMS";
import PageHeaderCMS from "../titles/PageHeaderCMS";

const BADGE_META: Record<string, { label: string; desc: string; emoji: string }> = {
  first_use_case: { label: "First Step", desc: "Logged your first AI use case", emoji: "🌱" },
  streak_7: { label: "7-Day Streak", desc: "Active for 7 days in a row", emoji: "🔥" },
  top_scorer: { label: "Top Scorer", desc: "Highest competency score in the team", emoji: "🏆" },
  approved_5: { label: "Impact Maker", desc: "5 use cases approved by your champion", emoji: "⭐" },
  obstacle_resolved: { label: "Problem Solver", desc: "Resolved your first obstacle", emoji: "✅" },
};

interface AchievementsLabProps {
  sessionToken: string;
}

export default function AchievementsLab({ sessionToken }: AchievementsLabProps) {
  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  return (
    <PageContainerCMS>
      <div className="container w-full flex flex-col gap-4">
        <PageHeaderCMS
          name="Achievements"
          desc="Badges and milestones earned on your AI adoption journey"
          icon={Star}
        />
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Star className="size-10 text-muted-foreground" />
          <p className="font-bodycopy font-semibold text-foreground">Coming Soon</p>
          <p className="font-bodycopy text-sm text-muted-foreground text-center max-w-64">
            Achievement badges will be awarded as you progress in your AI adoption journey
          </p>
        </div>
      </div>
    </PageContainerCMS>
  );
}
