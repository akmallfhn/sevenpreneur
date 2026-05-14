import { STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { ailMemberProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";

export const readAilene = {
  preAssessment: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;
    const pa = await opts.ctx.prisma.ailPreAssessment.findUnique({
      where: { member_id: memberId },
    });
    return {
      code: STATUS_OK,
      message: "Success",
      pre_assessment: pa,
    };
  }),

  materialDetail: ailMemberProcedure
    .input(z.object({ material_id: z.string().min(1) }))
    .query(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { material_id } = opts.input;

      const material = await opts.ctx.prisma.ailMaterial.findUnique({
        where: { id: material_id },
        include: { chapter: { select: { id: true, name: true } } },
      });
      if (!material) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Material not found.",
        });
      }

      const [completion, xp] = await Promise.all([
        opts.ctx.prisma.ailMaterialCompletion.findUnique({
          where: {
            member_id_material_id: {
              member_id: memberId,
              material_id: material.id,
            },
          },
        }),
        opts.ctx.prisma.ailXpEarning.findUnique({
          where: {
            member_id_learning_type_learning_id: {
              member_id: memberId,
              learning_type: "MATERIAL",
              learning_id: material.id,
            },
          },
        }),
      ]);

      return {
        code: STATUS_OK,
        message: "Success",
        material: {
          id: material.id,
          title: material.title,
          description: material.description,
          content: material.content,
          file_url: material.file_url,
          xp_reward: material.xp_reward,
          chapter: material.chapter,
          created_at: material.created_at,
          updated_at: material.updated_at,
        },
        completed: !!completion,
        completed_at: completion?.completed_at ?? null,
        xp_earned: xp?.xp_earned ?? 0,
      };
    }),

  quizResult: ailMemberProcedure
    .input(z.object({ quiz_id: z.string().min(1) }))
    .query(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { quiz_id } = opts.input;

      const quiz = await opts.ctx.prisma.ailQuiz.findUnique({
        where: { id: quiz_id },
        include: {
          chapter: { select: { id: true, name: true } },
          questions: {
            orderBy: { order_index: "asc" },
            include: { options: { orderBy: { id: "asc" } } },
          },
        },
      });
      if (!quiz) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Quiz not found.",
        });
      }

      const [latestCompleted, xp] = await Promise.all([
        opts.ctx.prisma.ailQuizSubmission.findFirst({
          where: { member_id: memberId, quiz_id, is_completed: true },
          orderBy: { attempt_number: "desc" },
        }),
        opts.ctx.prisma.ailXpEarning.findUnique({
          where: {
            member_id_learning_type_learning_id: {
              member_id: memberId,
              learning_type: "QUIZ",
              learning_id: quiz_id,
            },
          },
        }),
      ]);

      if (!latestCompleted) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Quiz submission not found.",
        });
      }

      return {
        code: STATUS_OK,
        message: "Success",
        quiz: {
          id: quiz.id,
          name: quiz.name,
          description: quiz.description,
          chapter: quiz.chapter,
        },
        questions: quiz.questions,
        submission: {
          attempt_number: latestCompleted.attempt_number,
          score: latestCompleted.score,
          answers: latestCompleted.answers,
          submitted_at: latestCompleted.submitted_at,
        },
        xp_earned: xp?.xp_earned ?? 0,
      };
    }),

  todayFocus: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;
    const currentLevelNumber =
      opts.ctx.ail_member.current_level?.level_number ?? 0;

    const [chapters, quizSubs, videoComps, materialComps] = await Promise.all([
      opts.ctx.prisma.ailChapter.findMany({
        where: { status: "ACTIVE" },
        orderBy: { session_date: "asc" },
        include: {
          level: true,
          quizzes: {
            where: { status: "ACTIVE" },
            orderBy: { order_index: "asc" },
          },
          videos: {
            where: { status: "ACTIVE" },
            orderBy: { order_index: "asc" },
          },
          materials: {
            where: { status: "ACTIVE" },
            orderBy: { order_index: "asc" },
          },
        },
      }),
      opts.ctx.prisma.ailQuizSubmission.findMany({
        where: { member_id: memberId, is_completed: true },
        select: { quiz_id: true },
      }),
      opts.ctx.prisma.ailVideoCompletion.findMany({
        where: { member_id: memberId },
        select: { video_id: true },
      }),
      opts.ctx.prisma.ailMaterialCompletion.findMany({
        where: { member_id: memberId },
        select: { material_id: true },
      }),
    ]);

    const completedQuizIds = new Set(quizSubs.map((s) => s.quiz_id));
    const completedVideoIds = new Set(videoComps.map((v) => v.video_id));
    const completedMaterialIds = new Set(
      materialComps.map((m) => m.material_id)
    );

    type Focus = {
      kind: "Quiz" | "Video" | "Material";
      task_id: string;
      task_title: string;
      chapter_id: number;
      chapter_name: string;
      href: string;
    };
    let focus: Focus | null = null;

    for (const ch of chapters) {
      if (ch.level.level_number > currentLevelNumber) continue;
      if (dayjs(ch.session_date).isAfter(dayjs())) continue;

      const q = ch.quizzes.find((x) => !completedQuizIds.has(x.id));
      if (q) {
        focus = {
          kind: "Quiz",
          task_id: q.id,
          task_title: q.name,
          chapter_id: ch.id,
          chapter_name: ch.name,
          href: `/student/quizzes/${q.id}`,
        };
        break;
      }
      const v = ch.videos.find((x) => !completedVideoIds.has(x.id));
      if (v) {
        focus = {
          kind: "Video",
          task_id: String(v.id),
          task_title: v.title,
          chapter_id: ch.id,
          chapter_name: ch.name,
          href: v.video_url,
        };
        break;
      }
      const m = ch.materials.find((x) => !completedMaterialIds.has(x.id));
      if (m) {
        focus = {
          kind: "Material",
          task_id: m.id,
          task_title: m.title,
          chapter_id: ch.id,
          chapter_name: ch.name,
          href: m.file_url ?? `/student/materials/${m.id}`,
        };
        break;
      }
    }

    return { code: STATUS_OK, message: "Success", focus };
  }),

  levelProgress: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;
    const currentLevel = opts.ctx.ail_member.current_level;

    const [xpAgg, levels] = await Promise.all([
      opts.ctx.prisma.ailXpEarning.aggregate({
        _sum: { xp_earned: true },
        where: { member_id: memberId },
      }),
      opts.ctx.prisma.ailLevel.findMany({
        where: { status: "ACTIVE" },
        orderBy: { level_number: "asc" },
        select: {
          id: true,
          level_number: true,
          name: true,
          icon: true,
          min_xp: true,
        },
      }),
    ]);

    const total_xp = xpAgg._sum.xp_earned ?? 0;
    const max_min_xp = levels.reduce((m, l) => Math.max(m, l.min_xp), 0);

    return {
      code: STATUS_OK,
      message: "Success",
      total_xp,
      max_min_xp,
      levels,
      current_level_number: currentLevel?.level_number ?? 0,
    };
  }),

  streak: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;

    // Current week starts on Monday. dayjs().day() returns 0=Sun..6=Sat.
    // Distance from today back to Monday: ((dow + 6) % 7).
    const today = dayjs().startOf("day");
    const daysFromMonday = (today.day() + 6) % 7;
    const weekStart = today.subtract(daysFromMonday, "day");
    const weekEnd = weekStart.add(6, "day").endOf("day");

    // For the consecutive-streak counter we need history beyond just this
    // week, but bounded — last ~60 days is plenty.
    const consecutiveSince = today.subtract(60, "day").toDate();

    const [quizSubs, videoComps, materialComps] = await Promise.all([
      opts.ctx.prisma.ailQuizSubmission.findMany({
        where: {
          member_id: memberId,
          is_completed: true,
          submitted_at: { gte: consecutiveSince },
        },
        select: { submitted_at: true },
      }),
      opts.ctx.prisma.ailVideoCompletion.findMany({
        where: { member_id: memberId, completed_at: { gte: consecutiveSince } },
        select: { completed_at: true },
      }),
      opts.ctx.prisma.ailMaterialCompletion.findMany({
        where: { member_id: memberId, completed_at: { gte: consecutiveSince } },
        select: { completed_at: true },
      }),
    ]);

    const completionDays = [
      ...quizSubs.map((s) => dayjs(s.submitted_at).startOf("day")),
      ...videoComps.map((v) => dayjs(v.completed_at).startOf("day")),
      ...materialComps.map((m) => dayjs(m.completed_at).startOf("day")),
    ];

    const countByDay = new Map<string, number>();
    for (const d of completionDays) {
      const k = d.format("YYYY-MM-DD");
      countByDay.set(k, (countByDay.get(k) ?? 0) + 1);
    }

    // 7 days Mon → Sun for the current week
    const days: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = weekStart.add(i, "day");
      const k = day.format("YYYY-MM-DD");
      days.push({ date: k, count: countByDay.get(k) ?? 0 });
    }

    // Consecutive streak ending today (or yesterday if today is still empty)
    let current_streak = 0;
    let cursor = today;
    if ((countByDay.get(cursor.format("YYYY-MM-DD")) ?? 0) === 0) {
      cursor = cursor.subtract(1, "day");
    }
    while ((countByDay.get(cursor.format("YYYY-MM-DD")) ?? 0) > 0) {
      current_streak += 1;
      cursor = cursor.subtract(1, "day");
    }

    return {
      code: STATUS_OK,
      message: "Success",
      week_start: weekStart.format("YYYY-MM-DD"),
      week_end: weekEnd.format("YYYY-MM-DD"),
      days,
      current_streak,
    };
  }),

  groupLeaderboard: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;

    const primary = await opts.ctx.prisma.ailGroupMember.findFirst({
      where: { member_id: memberId },
      orderBy: { joined_at: "asc" },
      include: {
        group: {
          include: {
            members: {
              include: {
                member: {
                  include: {
                    user: {
                      select: { id: true, full_name: true, avatar: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!primary) {
      return {
        code: STATUS_OK,
        message: "Success",
        group: null,
        my_rank: 0,
        total: 0,
        leaderboard: [],
      };
    }

    const memberIds = primary.group.members.map((gm) => gm.member.id);
    const xpAgg = await opts.ctx.prisma.ailXpEarning.groupBy({
      by: ["member_id"],
      _sum: { xp_earned: true },
      where: { member_id: { in: memberIds } },
    });
    const xpByMember = new Map<number, number>(
      xpAgg.map((x) => [x.member_id, x._sum.xp_earned ?? 0])
    );

    const leaderboard = primary.group.members
      .map((gm) => ({
        member_id: gm.member.id,
        full_name: gm.member.user.full_name,
        avatar: gm.member.user.avatar,
        total_xp: xpByMember.get(gm.member.id) ?? 0,
        is_me: gm.member.id === memberId,
      }))
      .sort((a, b) => b.total_xp - a.total_xp)
      .map((r, i) => ({ rank: i + 1, ...r }));

    const myEntry = leaderboard.find((r) => r.is_me);

    return {
      code: STATUS_OK,
      message: "Success",
      group: { id: primary.group.id, name: primary.group.name },
      my_rank: myEntry?.rank ?? leaderboard.length,
      total: leaderboard.length,
      leaderboard,
    };
  }),
};
