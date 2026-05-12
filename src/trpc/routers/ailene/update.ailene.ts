import {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_OK,
} from "@/lib/status_code";
import { ailMemberProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  finalizeQuizSubmission,
  getQuizSecondsLeft,
  QUIZ_DURATION_SECONDS,
  scheduleQuizAutoSubmit,
} from "./utils.ailene";

export const updateAilene = {
  unlockLevel: ailMemberProcedure
    .input(z.object({ level_id: z.number().int() }))
    .mutation(async (opts) => {
      const member = opts.ctx.ail_member;
      const targetLevel = await opts.ctx.prisma.ailLevel.findUnique({
        where: { id: opts.input.level_id },
      });
      if (!targetLevel) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Level not found.",
        });
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

  completeMaterial: ailMemberProcedure
    .input(z.object({ material_id: z.string().min(1) }))
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const materialId = opts.input.material_id;

      const material = await opts.ctx.prisma.ailMaterial.findUnique({
        where: { id: materialId },
      });
      if (!material) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Material not found.",
        });
      }

      // Idempotent: composite PK prevents duplicate completion
      await opts.ctx.prisma.ailMaterialCompletion.upsert({
        where: {
          member_id_material_id: {
            member_id: memberId,
            material_id: materialId,
          },
        },
        create: { member_id: memberId, material_id: materialId },
        update: {},
      });

      // Award XP only on first completion
      const existingXp = await opts.ctx.prisma.ailXpEarning.findUnique({
        where: {
          member_id_learning_type_learning_id: {
            member_id: memberId,
            learning_type: "MATERIAL",
            learning_id: materialId,
          },
        },
      });
      let xpAwarded = 0;
      if (!existingXp) {
        await opts.ctx.prisma.ailXpEarning.create({
          data: {
            member_id: memberId,
            learning_type: "MATERIAL",
            learning_id: materialId,
            xp_earned: material.xp_reward,
          },
        });
        xpAwarded = material.xp_reward;
      }

      return {
        code: STATUS_OK,
        message: "Success",
        xp_awarded: xpAwarded,
      };
    }),

  completeVideo: ailMemberProcedure
    .input(z.object({ video_id: z.number().int().positive() }))
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const videoId = opts.input.video_id;

      const video = await opts.ctx.prisma.ailVideo.findUnique({
        where: { id: videoId },
      });
      if (!video) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Video not found.",
        });
      }

      // Idempotent: composite PK prevents duplicate completion
      await opts.ctx.prisma.ailVideoCompletion.upsert({
        where: {
          member_id_video_id: {
            member_id: memberId,
            video_id: videoId,
          },
        },
        create: { member_id: memberId, video_id: videoId },
        update: {},
      });

      // Award XP only on first completion (learning_id stored as string)
      const learningIdStr = String(videoId);
      const existingXp = await opts.ctx.prisma.ailXpEarning.findUnique({
        where: {
          member_id_learning_type_learning_id: {
            member_id: memberId,
            learning_type: "VIDEO",
            learning_id: learningIdStr,
          },
        },
      });
      let xpAwarded = 0;
      if (!existingXp) {
        await opts.ctx.prisma.ailXpEarning.create({
          data: {
            member_id: memberId,
            learning_type: "VIDEO",
            learning_id: learningIdStr,
            xp_earned: video.xp_reward,
          },
        });
        xpAwarded = video.xp_reward;
      }

      return {
        code: STATUS_OK,
        message: "Success",
        xp_awarded: xpAwarded,
      };
    }),

  startQuizAttempt: ailMemberProcedure
    .input(z.object({ quiz_id: z.string().min(1) }))
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { quiz_id } = opts.input;

      const quiz = await opts.ctx.prisma.ailQuiz.findUnique({
        where: { id: quiz_id },
        select: { id: true },
      });
      if (!quiz) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Quiz not found.",
        });
      }

      const existing = await opts.ctx.prisma.ailQuizSubmission.findFirst({
        where: { member_id: memberId, quiz_id, is_completed: false },
      });

      if (existing) {
        const secondsLeft = getQuizSecondsLeft(existing.started_at);
        if (secondsLeft <= 0) {
          await finalizeQuizSubmission(opts.ctx.prisma, existing.id);
          return {
            code: STATUS_OK,
            message: "Attempt finalized due to timeout",
            status: "finalized" as const,
          };
        }
        return {
          code: STATUS_OK,
          message: "Resumed",
          status: "active" as const,
          submission_id: existing.id,
          started_at: existing.started_at,
          server_now: new Date(),
          seconds_left: secondsLeft,
          answers: existing.answers as Record<string, string | null>,
        };
      }

      const maxAttempt = await opts.ctx.prisma.ailQuizSubmission.aggregate({
        _max: { attempt_number: true },
        where: { member_id: memberId, quiz_id },
      });
      const nextAttempt = (maxAttempt._max.attempt_number ?? 0) + 1;

      const startedAt = new Date();
      const created = await opts.ctx.prisma.ailQuizSubmission.create({
        data: {
          member_id: memberId,
          quiz_id,
          attempt_number: nextAttempt,
          answers: {},
          score: 0,
          is_completed: false,
          started_at: startedAt,
        },
      });

      await scheduleQuizAutoSubmit(created.id, QUIZ_DURATION_SECONDS);

      return {
        code: STATUS_OK,
        message: "Attempt started",
        status: "active" as const,
        submission_id: created.id,
        started_at: startedAt,
        server_now: new Date(),
        seconds_left: QUIZ_DURATION_SECONDS,
        answers: {} as Record<string, string | null>,
      };
    }),

  saveQuizDraft: ailMemberProcedure
    .input(
      z.object({
        quiz_id: z.string().min(1),
        answers: z.record(z.string(), z.string().nullable()),
      })
    )
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { quiz_id, answers } = opts.input;

      const draft = await opts.ctx.prisma.ailQuizSubmission.findFirst({
        where: { member_id: memberId, quiz_id, is_completed: false },
      });

      if (!draft) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "No active attempt. Start an attempt first.",
        });
      }

      const secondsLeft = getQuizSecondsLeft(draft.started_at);
      if (secondsLeft <= 0) {
        await finalizeQuizSubmission(opts.ctx.prisma, draft.id);
        return {
          code: STATUS_OK,
          message: "Attempt finalized due to timeout",
          status: "finalized" as const,
        };
      }

      await opts.ctx.prisma.ailQuizSubmission.update({
        where: { id: draft.id },
        data: { answers },
      });

      return {
        code: STATUS_OK,
        message: "Draft saved",
        status: "active" as const,
      };
    }),

  submitQuiz: ailMemberProcedure
    .input(
      z.object({
        quiz_id: z.string().min(1),
        answers: z.record(z.string(), z.string().nullable()),
      })
    )
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { quiz_id, answers } = opts.input;

      const draft = await opts.ctx.prisma.ailQuizSubmission.findFirst({
        where: { member_id: memberId, quiz_id, is_completed: false },
      });

      let submissionId: number;
      let attemptNumber: number;
      if (draft) {
        submissionId = draft.id;
        attemptNumber = draft.attempt_number;
      } else {
        const quiz = await opts.ctx.prisma.ailQuiz.findUnique({
          where: { id: quiz_id },
          select: { id: true },
        });
        if (!quiz) {
          throw new TRPCError({
            code: STATUS_NOT_FOUND,
            message: "Quiz not found.",
          });
        }
        const maxAttempt = await opts.ctx.prisma.ailQuizSubmission.aggregate({
          _max: { attempt_number: true },
          where: { member_id: memberId, quiz_id },
        });
        attemptNumber = (maxAttempt._max.attempt_number ?? 0) + 1;
        const created = await opts.ctx.prisma.ailQuizSubmission.create({
          data: {
            member_id: memberId,
            quiz_id,
            attempt_number: attemptNumber,
            answers: {},
            score: 0,
            is_completed: false,
          },
        });
        submissionId = created.id;
      }

      const result = await finalizeQuizSubmission(
        opts.ctx.prisma,
        submissionId,
        answers
      );

      return {
        code: STATUS_OK,
        message: "Success",
        score: result.score,
        xp_awarded: result.xp_awarded,
        attempt_number: attemptNumber,
      };
    }),
};
