import { STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { ailMemberProcedure, championProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { type ChapterProgress } from "./utils.ailene";

export const listAilene = {
  levels: ailMemberProcedure.query(async (opts) => {
    const list = await opts.ctx.prisma.ailLevel.findMany({
      where: { status: "ACTIVE" },
      orderBy: { level_number: "asc" },
    });
    return { code: STATUS_OK, message: "Success", list };
  }),

  chapters: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;

    const [chapters, quizSubs, videoComps, materialComps] = await Promise.all([
      opts.ctx.prisma.ailChapter.findMany({
        where: { status: "ACTIVE" },
        orderBy: { session_date: "asc" },
        include: {
          level: true,
          _count: {
            select: {
              quizzes: { where: { status: "ACTIVE" } },
              videos: { where: { status: "ACTIVE" } },
              materials: { where: { status: "ACTIVE" } },
            },
          },
        },
      }),
      opts.ctx.prisma.ailQuizSubmission.findMany({
        where: {
          member_id: memberId,
          quiz: { status: "ACTIVE" },
          is_completed: true,
        },
        select: { quiz_id: true, quiz: { select: { chapter_id: true } } },
      }),
      opts.ctx.prisma.ailVideoCompletion.findMany({
        where: { member_id: memberId, video: { status: "ACTIVE" } },
        select: { video_id: true, video: { select: { chapter_id: true } } },
      }),
      opts.ctx.prisma.ailMaterialCompletion.findMany({
        where: { member_id: memberId, material: { status: "ACTIVE" } },
        select: {
          material_id: true,
          material: { select: { chapter_id: true } },
        },
      }),
    ]);

    // Build per-chapter sets of unique completed task IDs
    const quizDone = new Map<number, Set<string>>();
    for (const s of quizSubs) {
      const cid = s.quiz.chapter_id;
      if (!quizDone.has(cid)) quizDone.set(cid, new Set());
      quizDone.get(cid)!.add(s.quiz_id);
    }
    const videoDone = new Map<number, Set<number>>();
    for (const v of videoComps) {
      const cid = v.video.chapter_id;
      if (!videoDone.has(cid)) videoDone.set(cid, new Set());
      videoDone.get(cid)!.add(v.video_id);
    }
    const materialDone = new Map<number, Set<string>>();
    for (const m of materialComps) {
      const cid = m.material.chapter_id;
      if (!materialDone.has(cid)) materialDone.set(cid, new Set());
      materialDone.get(cid)!.add(m.material_id);
    }

    const list = chapters.map((ch) => {
      const totalTasks =
        ch._count.quizzes + ch._count.videos + ch._count.materials;
      const doneTasks =
        (quizDone.get(ch.id)?.size ?? 0) +
        (videoDone.get(ch.id)?.size ?? 0) +
        (materialDone.get(ch.id)?.size ?? 0);

      let progress: ChapterProgress;
      if (totalTasks === 0 || doneTasks === 0) {
        progress = "not_started";
      } else if (doneTasks >= totalTasks) {
        progress = "completed";
      } else {
        progress = "in_progress";
      }

      return {
        ...ch,
        progress,
        done_tasks: doneTasks,
        total_tasks: totalTasks,
      };
    });

    return { code: STATUS_OK, message: "Success", list };
  }),

  tasks: ailMemberProcedure
    .input(z.object({ chapter_id: z.number().int().positive() }))
    .query(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { chapter_id } = opts.input;

      const [
        quizzes,
        videos,
        materials,
        submissions,
        vidDone,
        matDone,
        xpRows,
      ] = await Promise.all([
        opts.ctx.prisma.ailQuiz.findMany({
          where: { chapter_id, status: "ACTIVE" },
          orderBy: { order_index: "asc" },
          include: { questions: { select: { xp_reward: true } } },
        }),
        opts.ctx.prisma.ailVideo.findMany({
          where: { chapter_id, status: "ACTIVE" },
          orderBy: { order_index: "asc" },
        }),
        opts.ctx.prisma.ailMaterial.findMany({
          where: { chapter_id, status: "ACTIVE" },
          orderBy: { order_index: "asc" },
        }),
        opts.ctx.prisma.ailQuizSubmission.findMany({
          where: {
            member_id: memberId,
            quiz: { chapter_id },
            is_completed: true,
          },
        }),
        opts.ctx.prisma.ailVideoCompletion.findMany({
          where: { member_id: memberId, video: { chapter_id } },
        }),
        opts.ctx.prisma.ailMaterialCompletion.findMany({
          where: { member_id: memberId, material: { chapter_id } },
        }),
        opts.ctx.prisma.ailXpEarning.findMany({
          where: { member_id: memberId },
        }),
      ]);

      const xpByKey = new Map<string, number>();
      for (const x of xpRows)
        xpByKey.set(`${x.learning_type}:${x.learning_id}`, x.xp_earned);

      const quizMeta = new Map<
        string,
        { best_score: number; attempts: number }
      >();
      for (const s of submissions) {
        const existing = quizMeta.get(s.quiz_id);
        quizMeta.set(s.quiz_id, {
          best_score: Math.max(existing?.best_score ?? 0, s.score),
          attempts: (existing?.attempts ?? 0) + 1,
        });
      }
      const vidDoneSet = new Set(
        vidDone.map((c: { video_id: number }) => c.video_id)
      );
      const matDoneSet = new Set(
        matDone.map((c: { material_id: string }) => c.material_id)
      );

      return {
        code: STATUS_OK,
        message: "Success",
        quizzes: quizzes.map((q: (typeof quizzes)[number]) => {
          const meta = quizMeta.get(q.id);
          const xp_reward = q.questions.reduce(
            (s: number, qn: { xp_reward: number }) => s + qn.xp_reward,
            0
          );
          return {
            id: q.id,
            name: q.name,
            description: q.description,
            order_index: q.order_index,
            question_count: q.questions.length,
            xp_reward,
            xp_earned: xpByKey.get(`quiz:${q.id}`) ?? 0,
            best_score: meta?.best_score ?? null,
            attempts: meta?.attempts ?? 0,
          };
        }),
        videos: videos.map((v: (typeof videos)[number]) => ({
          id: v.id,
          title: v.title,
          description: v.description,
          video_url: v.video_url,
          xp_reward: v.xp_reward,
          order_index: v.order_index,
          xp_earned: xpByKey.get(`video:${v.id}`) ?? 0,
          completed: vidDoneSet.has(v.id),
        })),
        materials: materials.map((m: (typeof materials)[number]) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          content: m.content,
          file_url: m.file_url,
          xp_reward: m.xp_reward,
          order_index: m.order_index,
          xp_earned: xpByKey.get(`material:${m.id}`) ?? 0,
          completed: matDoneSet.has(m.id),
        })),
      };
    }),

  quizQuestions: ailMemberProcedure
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

      const [latestCompleted, draft, xp] = await Promise.all([
        opts.ctx.prisma.ailQuizSubmission.findFirst({
          where: { member_id: memberId, quiz_id, is_completed: true },
          orderBy: { attempt_number: "desc" },
        }),
        opts.ctx.prisma.ailQuizSubmission.findFirst({
          where: { member_id: memberId, quiz_id, is_completed: false },
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
        progress: latestCompleted
          ? {
              attempt_number: latestCompleted.attempt_number,
              score: latestCompleted.score,
              answers: latestCompleted.answers,
              submitted_at: latestCompleted.submitted_at,
            }
          : null,
        draft: draft
          ? {
              attempt_number: draft.attempt_number,
              answers: draft.answers,
              started_at: draft.started_at,
              updated_at: draft.submitted_at,
            }
          : null,
        xp_earned: xp?.xp_earned ?? 0,
      };
    }),

  championMembers: championProcedure
    .input(
      z.object({
        group_id: z.number().int().optional(),
      })
    )
    .query(async (opts) => {
      const champion = opts.ctx.ail_member;

      const members = await opts.ctx.prisma.ailMember.findMany({
        where: {
          group: { champion_id: champion.id },
          ...(opts.input.group_id ? { group_id: opts.input.group_id } : {}),
        },
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
      });

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
          where: { member_id: { in: memberIds }, is_completed: true },
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

  promptLibrary: championProcedure.query(async (opts) => {
    const prompts = await opts.ctx.prisma.ailPrompt.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ level: { level_number: "asc" } }, { name: "asc" }],
      include: {
        level: {
          select: { id: true, level_number: true, name: true },
        },
        categories: {
          include: {
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    const list = prompts.map((p) => ({
      id: p.id,
      name: p.name,
      scenario: p.scenario,
      expected_output: p.expected_output,
      level: p.level,
      categories: p.categories.map((c) => c.category),
      created_at: p.created_at,
    }));

    return { code: STATUS_OK, message: "Success", list };
  }),

  useCaseLibrary: championProcedure.query(async (opts) => {
    const useCases = await opts.ctx.prisma.ailUseCase.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ level: { level_number: "asc" } }, { name: "asc" }],
      include: {
        level: {
          select: { id: true, level_number: true, name: true },
        },
        categories: {
          include: {
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    const list = useCases.map((u) => ({
      id: u.id,
      name: u.name,
      description: u.description,
      level: u.level,
      categories: u.categories.map((c) => c.category),
      created_at: u.created_at,
    }));

    return { code: STATUS_OK, message: "Success", list };
  }),

  myAssignedPrompts: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;
    const rows = await opts.ctx.prisma.ailPromptSubmission.findMany({
      where: {
        member_id: memberId,
        assigned_by_id: { not: null },
      },
      orderBy: [{ is_accepted: "asc" }, { deadline: "asc" }],
      include: {
        prompt: {
          select: {
            id: true,
            name: true,
            scenario: true,
            expected_output: true,
            level: { select: { id: true, level_number: true, name: true } },
            categories: {
              include: { category: { select: { id: true, name: true } } },
            },
          },
        },
        assigned_by: {
          select: {
            id: true,
            user: { select: { full_name: true, avatar: true } },
          },
        },
      },
    });

    const list = rows.map((r) => ({
      id: r.id,
      prompt: {
        id: r.prompt.id,
        name: r.prompt.name,
        scenario: r.prompt.scenario,
        expected_output: r.prompt.expected_output,
        level: r.prompt.level,
        categories: r.prompt.categories.map((c) => c.category),
      },
      assigned_by: r.assigned_by
        ? {
            id: r.assigned_by.id,
            full_name: r.assigned_by.user.full_name,
            avatar: r.assigned_by.user.avatar,
          }
        : null,
      deadline: r.deadline,
      message: r.message,
      submitted_at: r.submitted_at,
      reviewed_at: r.reviewed_at,
      comment: r.comment,
      is_accepted: r.is_accepted,
    }));

    return { code: STATUS_OK, message: "Success", list };
  }),

  championPromptSubmissions: championProcedure.query(async (opts) => {
    const championId = opts.ctx.ail_member.id;
    const rows = await opts.ctx.prisma.ailPromptSubmission.findMany({
      where: { assigned_by_id: championId },
      orderBy: [{ is_accepted: "asc" }, { submitted_at: "desc" }],
      include: {
        prompt: {
          select: {
            id: true,
            name: true,
            level: { select: { id: true, level_number: true, name: true } },
          },
        },
        member: {
          select: {
            id: true,
            user: { select: { full_name: true, avatar: true } },
          },
        },
      },
    });

    const list = rows.map((r) => ({
      id: r.id,
      prompt: r.prompt,
      member: {
        id: r.member.id,
        full_name: r.member.user.full_name,
        avatar: r.member.user.avatar,
      },
      deadline: r.deadline,
      submitted_at: r.submitted_at,
      reviewed_at: r.reviewed_at,
      is_accepted: r.is_accepted,
    }));

    return { code: STATUS_OK, message: "Success", list };
  }),

  championUseCaseSubmissions: championProcedure.query(async (opts) => {
    const championId = opts.ctx.ail_member.id;
    const rows = await opts.ctx.prisma.ailUseCaseSubmission.findMany({
      where: { assigned_by_id: championId },
      orderBy: [{ is_accepted: "asc" }, { submitted_at: "desc" }],
      include: {
        use_case: {
          select: {
            id: true,
            name: true,
            level: { select: { id: true, level_number: true, name: true } },
          },
        },
        member: {
          select: {
            id: true,
            user: { select: { full_name: true, avatar: true } },
          },
        },
      },
    });

    const list = rows.map((r) => ({
      id: r.id,
      use_case: r.use_case,
      member: {
        id: r.member.id,
        full_name: r.member.user.full_name,
        avatar: r.member.user.avatar,
      },
      deadline: r.deadline,
      submitted_at: r.submitted_at,
      reviewed_at: r.reviewed_at,
      is_accepted: r.is_accepted,
    }));

    return { code: STATUS_OK, message: "Success", list };
  }),

  myAssignedUseCases: ailMemberProcedure.query(async (opts) => {
    const memberId = opts.ctx.ail_member.id;
    const rows = await opts.ctx.prisma.ailUseCaseSubmission.findMany({
      where: {
        member_id: memberId,
        assigned_by_id: { not: null },
      },
      orderBy: [{ is_accepted: "asc" }, { deadline: "asc" }],
      include: {
        use_case: {
          select: {
            id: true,
            name: true,
            description: true,
            level: { select: { id: true, level_number: true, name: true } },
            categories: {
              include: { category: { select: { id: true, name: true } } },
            },
          },
        },
        assigned_by: {
          select: {
            id: true,
            user: { select: { full_name: true, avatar: true } },
          },
        },
      },
    });

    const list = rows.map((r) => ({
      id: r.id,
      use_case: {
        id: r.use_case.id,
        name: r.use_case.name,
        description: r.use_case.description,
        level: r.use_case.level,
        categories: r.use_case.categories.map((c) => c.category),
      },
      assigned_by: r.assigned_by
        ? {
            id: r.assigned_by.id,
            full_name: r.assigned_by.user.full_name,
            avatar: r.assigned_by.user.avatar,
          }
        : null,
      deadline: r.deadline,
      message: r.message,
      submitted_at: r.submitted_at,
      reviewed_at: r.reviewed_at,
      comment: r.comment,
      is_accepted: r.is_accepted,
    }));

    return { code: STATUS_OK, message: "Success", list };
  }),
};
