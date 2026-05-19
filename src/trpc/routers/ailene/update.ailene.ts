import {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_OK,
} from "@/lib/status_code";
import { ailMemberProcedure, championProcedure } from "@/trpc/init";
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
      if (targetLevel.level_number !== currentLevelNumber + 1) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Levels must be unlocked sequentially.",
        });
      }

      // Gate: all quizzes + materials at the current level must be completed
      // (videos don't count).
      const currentLevelChapters = await opts.ctx.prisma.ailChapter.findMany({
        where: {
          status: "ACTIVE",
          level: { level_number: currentLevelNumber },
        },
        select: {
          quizzes: { where: { status: "ACTIVE" }, select: { id: true } },
          materials: { where: { status: "ACTIVE" }, select: { id: true } },
        },
      });
      const requiredQuizIds = currentLevelChapters.flatMap((c) =>
        c.quizzes.map((q) => q.id)
      );
      const requiredMaterialIds = currentLevelChapters.flatMap((c) =>
        c.materials.map((m) => m.id)
      );
      const totalRequired = requiredQuizIds.length + requiredMaterialIds.length;

      if (totalRequired > 0) {
        const [doneQuizzes, doneMaterials] = await Promise.all([
          requiredQuizIds.length === 0
            ? []
            : opts.ctx.prisma.ailQuizSubmission.findMany({
                where: {
                  member_id: member.id,
                  quiz_id: { in: requiredQuizIds },
                  is_completed: true,
                },
                select: { quiz_id: true },
                distinct: ["quiz_id"],
              }),
          requiredMaterialIds.length === 0
            ? []
            : opts.ctx.prisma.ailMaterialCompletion.findMany({
                where: {
                  member_id: member.id,
                  material_id: { in: requiredMaterialIds },
                },
                select: { material_id: true },
              }),
        ]);
        const totalDone = doneQuizzes.length + doneMaterials.length;
        if (totalDone < totalRequired) {
          throw new TRPCError({
            code: STATUS_BAD_REQUEST,
            message: `Selesaikan semua quiz dan materi di level ini dulu (${totalDone}/${totalRequired}).`,
          });
        }
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

  submitPromptAssignment: ailMemberProcedure
    .input(
      z.object({
        prompt_id: z.number().int().positive(),
        input: z.string().min(1).max(5000),
        output: z.string().min(1).max(10000),
      })
    )
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const { prompt_id, input, output } = opts.input;

      const existing = await opts.ctx.prisma.ailPromptSubmission.findUnique({
        where: {
          member_id_prompt_id: { member_id: memberId, prompt_id },
        },
        select: { id: true, assigned_by_id: true, is_accepted: true },
      });

      if (!existing || !existing.assigned_by_id) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Assignment not found.",
        });
      }
      if (existing.is_accepted) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Assignment already accepted, cannot resubmit.",
        });
      }

      await opts.ctx.prisma.ailPromptSubmission.update({
        where: { id: existing.id },
        data: {
          input,
          output,
          submitted_at: new Date(),
        },
      });

      return { code: STATUS_OK, message: "Submitted" };
    }),

  reviewPromptSubmission: championProcedure
    .input(
      z.object({
        submission_id: z.number().int().positive(),
        is_accepted: z.boolean(),
        comment: z.string().max(2000).nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const championId = opts.ctx.ail_member.id;
      const { submission_id, is_accepted, comment } = opts.input;

      const existing = await opts.ctx.prisma.ailPromptSubmission.findUnique({
        where: { id: submission_id },
        select: {
          assigned_by_id: true,
          submitted_at: true,
          is_accepted: true,
        },
      });
      if (!existing || existing.assigned_by_id !== championId) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Submission not found.",
        });
      }
      if (!existing.submitted_at) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Student has not submitted yet.",
        });
      }
      if (existing.is_accepted) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Submission already accepted.",
        });
      }
      if (!is_accepted && !comment?.trim()) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Comment required when sending back for revision.",
        });
      }

      await opts.ctx.prisma.ailPromptSubmission.update({
        where: { id: submission_id },
        data: {
          reviewed_by_id: championId,
          reviewed_at: new Date(),
          comment: comment?.trim() ?? null,
          is_accepted,
        },
      });

      return { code: STATUS_OK, message: "Review saved" };
    }),

  reviewUseCaseSubmission: championProcedure
    .input(
      z.object({
        submission_id: z.number().int().positive(),
        is_accepted: z.boolean(),
        comment: z.string().max(2000).nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const championId = opts.ctx.ail_member.id;
      const { submission_id, is_accepted, comment } = opts.input;

      const existing = await opts.ctx.prisma.ailUseCaseSubmission.findUnique({
        where: { id: submission_id },
        select: {
          assigned_by_id: true,
          submitted_at: true,
          is_accepted: true,
        },
      });
      if (!existing || existing.assigned_by_id !== championId) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Submission not found.",
        });
      }
      if (!existing.submitted_at) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Student has not submitted yet.",
        });
      }
      if (existing.is_accepted) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Submission already accepted.",
        });
      }
      if (!is_accepted && !comment?.trim()) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Comment required when sending back for revision.",
        });
      }

      await opts.ctx.prisma.ailUseCaseSubmission.update({
        where: { id: submission_id },
        data: {
          reviewed_by_id: championId,
          reviewed_at: new Date(),
          comment: comment?.trim() ?? null,
          is_accepted,
        },
      });

      return { code: STATUS_OK, message: "Review saved" };
    }),

  submitUseCaseAssignment: ailMemberProcedure
    .input(
      z.object({
        use_case_id: z.number().int().positive(),
        outcome_proof: z.string().min(1).max(500),
        hours_saved: z.number().min(0).max(9999.99),
        description: z.string().min(1).max(5000),
        ai_tool: z.string().min(1).max(255),
        frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "OCCASIONALLY"]),
      })
    )
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;
      const {
        use_case_id,
        outcome_proof,
        hours_saved,
        description,
        ai_tool,
        frequency,
      } = opts.input;

      const existing = await opts.ctx.prisma.ailUseCaseSubmission.findUnique({
        where: {
          member_id_use_case_id: { member_id: memberId, use_case_id },
        },
        select: { id: true, assigned_by_id: true, is_accepted: true },
      });

      if (!existing || !existing.assigned_by_id) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Assignment not found.",
        });
      }
      if (existing.is_accepted) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Assignment already accepted, cannot resubmit.",
        });
      }

      await opts.ctx.prisma.ailUseCaseSubmission.update({
        where: { id: existing.id },
        data: {
          outcome_proof,
          hours_saved,
          description,
          ai_tool,
          frequency,
          submitted_at: new Date(),
        },
      });

      return { code: STATUS_OK, message: "Submitted" };
    }),
};
