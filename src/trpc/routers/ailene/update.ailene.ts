import { STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { ailMemberProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateAilene = {
  unlockLevel: ailMemberProcedure
    .input(z.object({ level_id: z.number().int() }))
    .mutation(async (opts) => {
      const member = opts.ctx.ail_member;
      const targetLevel = await opts.ctx.prisma.ailLevel.findUnique({
        where: { id: opts.input.level_id },
      });
      if (!targetLevel) {
        throw new TRPCError({ code: STATUS_NOT_FOUND, message: "Level not found." });
      }

      const currentLevelNumber = member.current_level?.level_number ?? 0;
      if (targetLevel.level_number <= currentLevelNumber) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Level already unlocked.",
        });
      }

      const xpAgg = await opts.ctx.prisma.ailXpEarning.aggregate({
        _sum: { xp_earned: true },
        where: { member_id: member.id },
      });
      const totalXp = xpAgg._sum.xp_earned ?? 0;
      if (totalXp < targetLevel.min_xp) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: `Not enough XP. Need ${targetLevel.min_xp}, have ${totalXp}.`,
        });
      }

      const history = Array.isArray(member.level_history)
        ? [...(member.level_history as unknown[])]
        : [];
      history.push({
        level_id: targetLevel.id,
        unlocked_at: new Date().toISOString(),
      });

      await opts.ctx.prisma.ailMember.update({
        where: { id: member.id },
        data: {
          current_level_id: targetLevel.id,
          level_history: history as object[],
        },
      });

      return {
        code: STATUS_OK,
        message: "Level unlocked",
        level_id: targetLevel.id,
      };
    }),

  submitQuiz: ailMemberProcedure
    .input(
      z.object({
        quiz_id: z.number().int().positive(),
        answers: z.record(z.string(), z.string().nullable()),
      })
    )
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { quiz_id, answers } = opts.input;

      const quiz = await opts.ctx.prisma.ailQuiz.findUnique({
        where: { id: quiz_id },
        include: { questions: { include: { options: true } } },
      });
      if (!quiz) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Quiz not found.",
        });
      }

      let correct = 0;
      let xpFromCorrect = 0;
      for (const q of quiz.questions) {
        const sel = answers[String(q.id)];
        const corr = q.options.find((o) => o.is_correct);
        if (corr && sel === corr.option_code) {
          correct += 1;
          xpFromCorrect += q.xp_reward;
        }
      }
      const score =
        quiz.questions.length > 0
          ? Math.round((correct / quiz.questions.length) * 100)
          : 0;

      const maxAttempt = await opts.ctx.prisma.ailQuizSubmission.aggregate({
        _max: { attempt_number: true },
        where: { member_id: memberId, quiz_id },
      });
      const nextAttempt = (maxAttempt._max.attempt_number ?? 0) + 1;

      await opts.ctx.prisma.ailQuizSubmission.create({
        data: {
          member_id: memberId,
          quiz_id,
          attempt_number: nextAttempt,
          answers,
          score,
        },
      });

      const existingXp = await opts.ctx.prisma.ailXpEarning.findUnique({
        where: {
          member_id_learning_type_learning_id: {
            member_id: memberId,
            learning_type: "QUIZ",
            learning_id: quiz_id,
          },
        },
      });
      const previousXp = existingXp?.xp_earned ?? 0;
      const finalXp = Math.max(previousXp, xpFromCorrect);
      if (!existingXp || finalXp > previousXp) {
        await opts.ctx.prisma.ailXpEarning.upsert({
          where: {
            member_id_learning_type_learning_id: {
              member_id: memberId,
              learning_type: "QUIZ",
              learning_id: quiz_id,
            },
          },
          create: {
            member_id: memberId,
            learning_type: "QUIZ",
            learning_id: quiz_id,
            xp_earned: finalXp,
          },
          update: { xp_earned: finalXp, earned_at: new Date() },
        });
      }
      const xpAwarded = finalXp - previousXp;

      return {
        code: STATUS_OK,
        message: "Success",
        score,
        xp_awarded: xpAwarded,
        attempt_number: nextAttempt,
      };
    }),
};
