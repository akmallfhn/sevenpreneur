import { STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { ailMemberProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const readAilene = {
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
};
