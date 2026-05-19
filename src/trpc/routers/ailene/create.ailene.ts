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

const aiUseFrequencyEnum = z.enum([
  "NEVER",
  "TRIED",
  "WEEKLY",
  "DAILY",
  "INTENSIVE",
]);
const understandingEnum = z.enum([
  "NONE",
  "AWARE",
  "BASIC",
  "EXPLAIN",
  "EXPERT",
]);
const outputReviewEnum = z.enum([
  "NO_CHECK",
  "SOMETIMES",
  "ALWAYS",
  "CROSS_CHECK",
  "NO_USE",
]);
const teamAdoptionEnum = z.enum([
  "NONE",
  "PERSONAL",
  "PILOT",
  "POLICY",
  "INTEGRATED",
]);
const promptSkillEnum = z.enum([
  "NONE",
  "BASIC",
  "DECENT",
  "STRUCTURED",
  "EXPERT",
]);
const attitudeEnum = z.enum([
  "TOO_RISKY",
  "CAUTIOUS",
  "NEUTRAL",
  "SUPPORTIVE",
  "ESSENTIAL",
]);
const motivationEnum = z.enum([
  "MANDATORY",
  "CURIOUS",
  "TENTATIVE",
  "READY",
  "EAGER",
]);

const preAssessmentInputSchema = z.object({
  q1_ai_use_frequency: aiUseFrequencyEnum,
  q2_ai_tools_used: z.array(z.string().min(1)).min(1),
  q3_job_role: z.string().min(1).max(255),
  q4_ai_understanding: understandingEnum,
  q5_ai_limitations: z.array(z.string().min(1)).min(1),
  q6_output_review: outputReviewEnum,
  q7_use_cases: z.array(z.string().min(1)).min(1),
  q8_team_adoption: teamAdoptionEnum,
  q9_concrete_example: z.string().max(255).nullable().optional(),
  q10_prompt_comfort: promptSkillEnum,
  q11_safety_practices: z.array(z.string().min(1)).min(1),
  q12_professional_attitude: attitudeEnum,
  q13_biggest_challenge: z.string().min(1),
  q14_training_expectation: z.string().min(1),
  q15_motivation: motivationEnum,
});

export const createAilene = {
  preAssessment: ailMemberProcedure
    .input(preAssessmentInputSchema)
    .mutation(async (opts) => {
      const memberId = opts.ctx.ail_member.id;

      const existing = await opts.ctx.prisma.ailPreAssessment.findUnique({
        where: { member_id: memberId },
        select: { id: true },
      });
      if (existing) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Pre-assessment already submitted.",
        });
      }

      const data = opts.input;
      const created = await opts.ctx.prisma.ailPreAssessment.create({
        data: {
          member_id: memberId,
          q1_ai_use_frequency: data.q1_ai_use_frequency,
          q2_ai_tools_used: data.q2_ai_tools_used,
          q3_job_role: data.q3_job_role,
          q4_ai_understanding: data.q4_ai_understanding,
          q5_ai_limitations: data.q5_ai_limitations,
          q6_output_review: data.q6_output_review,
          q7_use_cases: data.q7_use_cases,
          q8_team_adoption: data.q8_team_adoption,
          q9_concrete_example: data.q9_concrete_example ?? null,
          q10_prompt_comfort: data.q10_prompt_comfort,
          q11_safety_practices: data.q11_safety_practices,
          q12_professional_attitude: data.q12_professional_attitude,
          q13_biggest_challenge: data.q13_biggest_challenge,
          q14_training_expectation: data.q14_training_expectation,
          q15_motivation: data.q15_motivation,
        },
      });

      return {
        code: STATUS_OK,
        message: "Pre-assessment submitted",
        id: created.id,
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
};
