import { STATUS_OK } from "@/lib/status_code";
import { championProcedure } from "@/trpc/init";
import { z } from "zod";

export const championAilene = {
  listGroups: championProcedure.query(async (opts) => {
    const champion = opts.ctx.ail_member;
    const list = await opts.ctx.prisma.ailGroup.findMany({
      where: { champion_id: champion.id },
      include: { _count: { select: { members: true } } },
      orderBy: { created_at: "asc" },
    });
    return { code: STATUS_OK, message: "Success", list };
  }),

  listMembers: championProcedure
    .input(
      z.object({
        group_id: z.number().int().optional(),
      })
    )
    .query(async (opts) => {
      const champion = opts.ctx.ail_member;

      const groupMembers = await opts.ctx.prisma.ailGroupMember.findMany({
        where: {
          group: { champion_id: champion.id },
          ...(opts.input.group_id ? { group_id: opts.input.group_id } : {}),
        },
        include: {
          member: {
            include: {
              user: {
                select: {
                  id: true,
                  full_name: true,
                  email: true,
                  avatar: true,
                },
              },
              current_level: true,
            },
          },
        },
      });

      // Dedupe (member could appear in multiple groups)
      const memberMap = new Map<number, (typeof groupMembers)[number]["member"]>();
      for (const gm of groupMembers) memberMap.set(gm.member.id, gm.member);
      const members = Array.from(memberMap.values());

      if (members.length === 0) {
        return {
          code: STATUS_OK,
          message: "Success",
          stats: { total: 0, on_track: 0, at_risk: 0, behind: 0 },
          list: [],
        };
      }

      const memberIds = members.map((m) => m.id);

      const [levels, xpAgg, quizSubs, videoComps, materialComps] = await Promise.all([
        opts.ctx.prisma.ailLevel.findMany({
          where: { status: "ACTIVE" },
          orderBy: { level_number: "asc" },
        }),
        opts.ctx.prisma.ailXpEarning.groupBy({
          by: ["member_id"],
          _sum: { xp_earned: true },
          where: { member_id: { in: memberIds } },
        }),
        opts.ctx.prisma.ailQuizSubmission.findMany({
          where: { member_id: { in: memberIds } },
          orderBy: { submitted_at: "desc" },
          distinct: ["member_id"],
          include: { quiz: { include: { chapter: true } } },
        }),
        opts.ctx.prisma.ailVideoCompletion.findMany({
          where: { member_id: { in: memberIds } },
          orderBy: { completed_at: "desc" },
          distinct: ["member_id"],
          include: { video: { include: { chapter: true } } },
        }),
        opts.ctx.prisma.ailMaterialCompletion.findMany({
          where: { member_id: { in: memberIds } },
          orderBy: { completed_at: "desc" },
          distinct: ["member_id"],
          include: { material: { include: { chapter: true } } },
        }),
      ]);

      type ChapterRef = { id: number; name: string };
      const xpByMember = new Map<number, number>(
        xpAgg.map((x) => [x.member_id, x._sum.xp_earned ?? 0])
      );

      // Latest activity per member across 3 sources
      const latestByMember = new Map<
        number,
        { at: Date; chapter: ChapterRef }
      >();
      const consider = (
        member_id: number,
        at: Date,
        chapter: { id: number; name: string }
      ) => {
        const existing = latestByMember.get(member_id);
        if (!existing || at > existing.at) {
          latestByMember.set(member_id, { at, chapter });
        }
      };
      for (const s of quizSubs)
        consider(s.member_id, s.submitted_at, {
          id: s.quiz.chapter.id,
          name: s.quiz.chapter.name,
        });
      for (const v of videoComps)
        consider(v.member_id, v.completed_at, {
          id: v.video.chapter.id,
          name: v.video.chapter.name,
        });
      for (const m of materialComps)
        consider(m.member_id, m.completed_at, {
          id: m.material.chapter.id,
          name: m.material.chapter.name,
        });

      const now = Date.now();
      const DAY = 24 * 60 * 60 * 1000;

      const list = members.map((m) => {
        const total_xp = xpByMember.get(m.id) ?? 0;
        const currentLevel = m.current_level;
        const nextLevel = levels.find(
          (l) => l.level_number === currentLevel.level_number + 1
        );

        let progress_percent = 100;
        if (nextLevel) {
          const span = nextLevel.min_xp - currentLevel.min_xp;
          progress_percent =
            span <= 0
              ? 100
              : Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(
                      ((total_xp - currentLevel.min_xp) / span) * 100
                    )
                  )
                );
        }

        const latest = latestByMember.get(m.id);
        const last_active_at = m.last_active_at ?? latest?.at ?? null;

        let status: "on_track" | "at_risk" | "behind" = "on_track";
        if (!last_active_at) {
          status = "behind";
        } else {
          const daysAgo = (now - last_active_at.getTime()) / DAY;
          if (daysAgo > 14) status = "behind";
          else if (daysAgo > 7) status = "at_risk";
        }

        return {
          member_id: m.id,
          user: {
            id: m.user.id,
            full_name: m.user.full_name,
            email: m.user.email,
            avatar: m.user.avatar,
          },
          current_level: {
            id: currentLevel.id,
            level_number: currentLevel.level_number,
            name: currentLevel.name,
            icon: currentLevel.icon,
          },
          total_xp,
          progress_percent,
          current_chapter: latest?.chapter ?? null,
          last_active_at,
          status,
        };
      });

      const stats = {
        total: list.length,
        on_track: list.filter((l) => l.status === "on_track").length,
        at_risk: list.filter((l) => l.status === "at_risk").length,
        behind: list.filter((l) => l.status === "behind").length,
      };

      return { code: STATUS_OK, message: "Success", stats, list };
    }),
};
