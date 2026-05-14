import { STATUS_BAD_REQUEST, STATUS_OK } from "@/lib/status_code";
import { ailMemberProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
};
