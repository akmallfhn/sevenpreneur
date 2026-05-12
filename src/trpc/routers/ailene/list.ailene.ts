import { STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { ailMemberProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const listAilene = {
  myGroups: ailMemberProcedure.query(async (opts) => {
    const groupMembers = await opts.ctx.prisma.ailGroupMember.findMany({
      where: { member_id: opts.ctx.ail_member.id },
      include: { group: true },
      orderBy: { joined_at: "asc" },
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: groupMembers.map((gm) => gm.group),
    };
  }),

  levels: ailMemberProcedure.query(async (opts) => {
    const list = await opts.ctx.prisma.ailLevel.findMany({
      where: { status: "ACTIVE" },
      orderBy: { level_number: "asc" },
    });
    return { code: STATUS_OK, message: "Success", list };
  }),

  chapters: ailMemberProcedure.query(async (opts) => {
    const list = await opts.ctx.prisma.ailChapter.findMany({
      where: { status: "ACTIVE" },
      orderBy: { session_date: "asc" },
      include: { level: true },
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
          where: { member_id: memberId, quiz: { chapter_id } },
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
        number,
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
        matDone.map((c: { material_id: number }) => c.material_id)
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
    .input(z.object({ quiz_id: z.number().int().positive() }))
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

      const [latest, xp] = await Promise.all([
        opts.ctx.prisma.ailQuizSubmission.findFirst({
          where: { member_id: memberId, quiz_id },
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
        progress: latest
          ? {
              attempt_number: latest.attempt_number,
              score: latest.score,
              answers: latest.answers,
              submitted_at: latest.submitted_at,
            }
          : null,
        xp_earned: xp?.xp_earned ?? 0,
      };
    }),
};
