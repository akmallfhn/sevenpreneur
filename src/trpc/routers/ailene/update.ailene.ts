import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
} from "@/lib/status_code";
import { ailMemberProcedure, championProcedure } from "@/trpc/init";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  finalizeQuizSubmission,
  getQuizSecondsLeft,
  QUIZ_DURATION_SECONDS,
  scheduleQuizAutoSubmit,
} from "./utils.ailene";

const assignInputSchema = z.object({
  library_id: z.number().int().positive(),
  target_type: z.enum(["MEMBER", "GROUP"]),
  target_ids: z.array(z.number().int().positive()).min(1),
  deadline: z.string().datetime(),
  message: z.string().max(500).nullable().optional(),
});

async function resolveAssignmentTargets(
  prisma: PrismaClient,
  championId: number,
  targetType: "MEMBER" | "GROUP",
  targetIds: number[]
): Promise<number[]> {
  if (targetType === "GROUP") {
    const groups = await prisma.ailGroup.findMany({
      where: { id: { in: targetIds }, champion_id: championId },
      include: { members: { select: { id: true } } },
    });
    if (groups.length !== targetIds.length) {
      throw new TRPCError({
        code: STATUS_FORBIDDEN,
        message: "Some groups are not yours.",
      });
    }
    return Array.from(
      new Set(groups.flatMap((g) => g.members.map((m) => m.id)))
    );
  }
  const members = await prisma.ailMember.findMany({
    where: {
      id: { in: targetIds },
      group: { champion_id: championId },
    },
    select: { id: true },
  });
  if (members.length !== targetIds.length) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: "Some members are not in your team.",
    });
  }
  return members.map((m) => m.id);
}

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
      const totalRequired =
        requiredQuizIds.length + requiredMaterialIds.length;

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

  assignPrompt: championProcedure
    .input(assignInputSchema)
    .mutation(async (opts) => {
      const championId = opts.ctx.ail_member.id;
      const { library_id, target_type, target_ids, deadline, message } =
        opts.input;

      const deadlineDate = new Date(deadline);
      if (deadlineDate.getTime() <= Date.now()) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Deadline must be in the future.",
        });
      }

      const prompt = await opts.ctx.prisma.ailPrompt.findFirst({
        where: { id: library_id, status: "ACTIVE" },
        select: { id: true },
      });
      if (!prompt) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Prompt not found.",
        });
      }

      const memberIds = await resolveAssignmentTargets(
        opts.ctx.prisma,
        championId,
        target_type,
        target_ids
      );
      if (memberIds.length === 0) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "No target members.",
        });
      }

      const result = await opts.ctx.prisma.ailPromptSubmission.createMany({
        data: memberIds.map((mid) => ({
          member_id: mid,
          prompt_id: library_id,
          assigned_by_id: championId,
          deadline: deadlineDate,
          message: message ?? null,
        })),
        skipDuplicates: true,
      });

      return {
        code: STATUS_OK,
        message: "Assignments created",
        assigned_count: result.count,
        target_total: memberIds.length,
        skipped: memberIds.length - result.count,
      };
    }),

  assignUseCase: championProcedure
    .input(assignInputSchema)
    .mutation(async (opts) => {
      const championId = opts.ctx.ail_member.id;
      const { library_id, target_type, target_ids, deadline, message } =
        opts.input;

      const deadlineDate = new Date(deadline);
      if (deadlineDate.getTime() <= Date.now()) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Deadline must be in the future.",
        });
      }

      const useCase = await opts.ctx.prisma.ailUseCase.findFirst({
        where: { id: library_id, status: "ACTIVE" },
        select: { id: true },
      });
      if (!useCase) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "Use case not found.",
        });
      }

      const memberIds = await resolveAssignmentTargets(
        opts.ctx.prisma,
        championId,
        target_type,
        target_ids
      );
      if (memberIds.length === 0) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "No target members.",
        });
      }

      const result = await opts.ctx.prisma.ailUseCaseSubmission.createMany({
        data: memberIds.map((mid) => ({
          member_id: mid,
          use_case_id: library_id,
          assigned_by_id: championId,
          deadline: deadlineDate,
          message: message ?? null,
        })),
        skipDuplicates: true,
      });

      return {
        code: STATUS_OK,
        message: "Assignments created",
        assigned_count: result.count,
        target_total: memberIds.length,
        skipped: memberIds.length - result.count,
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
