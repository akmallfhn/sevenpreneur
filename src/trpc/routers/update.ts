import { administratorProcedure, createTRPCRouter } from "@/trpc/init";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsRoleID,
  stringIsTimestampTz,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateRouter = createTRPCRouter({
  user: administratorProcedure
    .input(
      z.object({
        id: stringIsUUID(),
        full_name: stringNotBlank().optional(),
        email: stringNotBlank().optional(),
        avatar: stringNotBlank().nullable().optional(),
        role_id: numberIsRoleID().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        date_of_birth: z.string().date().nullable().optional(),
        learning_goal: stringNotBlank().nullable().optional(),
        entrepreneur_stage_id: numberIsID().nullable().optional(),
        business_name: stringNotBlank().nullable().optional(),
        industry_id: numberIsID().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const dateOfBirth = stringToDate(opts.input.date_of_birth);
      const updatedUser = await opts.ctx.prisma.user.updateManyAndReturn({
        data: {
          full_name: opts.input.full_name,
          email: opts.input.email,
          avatar: opts.input.avatar,
          role_id: opts.input.role_id,
          status: opts.input.status,
          date_of_birth: dateOfBirth,
          learning_goal: opts.input.learning_goal,
          entrepreneur_stage_id: opts.input.entrepreneur_stage_id,
          business_name: opts.input.business_name,
          industry_id: opts.input.industry_id,
        },
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      if (updatedUser.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected user is not found.",
        });
      } else if (updatedUser.length > 1) {
        console.error("update.user: More-than-one users are updated at once.");
      }
      return {
        status: 200,
        message: "Success",
        user: updatedUser[0],
      };
    }),

  cohort: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        image: stringNotBlank().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        slug_url: stringNotBlank().optional().optional(),
        start_date: stringIsTimestampTz().optional(),
        end_date: stringIsTimestampTz().optional(),
        published_at: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedCohort = await opts.ctx.prisma.cohort.updateManyAndReturn({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          status: opts.input.status,
          slug_url: opts.input.slug_url,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
          published_at: opts.input.published_at,
        },
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      if (updatedCohort.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected cohort is not found.",
        });
      } else if (updatedCohort.length > 1) {
        console.error(
          "update.cohort: More-than-one cohorts are updated at once."
        );
      }
      return {
        status: 200,
        message: "Success",
        cohort: updatedCohort[0],
      };
    }),

  cohortPrice: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        amount: z.number().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedCohortPrice =
        await opts.ctx.prisma.cohortPrice.updateManyAndReturn({
          data: {
            cohort_id: opts.input.cohort_id,
            name: opts.input.name,
            amount: opts.input.amount,
            status: opts.input.status,
          },
          where: {
            id: opts.input.id,
            // deleted_at: null,
          },
        });
      if (updatedCohortPrice.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected cohort price is not found.",
        });
      } else if (updatedCohortPrice.length > 1) {
        console.error(
          "update.cohortPrice: More-than-one cohort prices are updated at once."
        );
      }
      return {
        status: 200,
        message: "Success",
        cohort: updatedCohortPrice[0],
      };
    }),

  learning: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        method: z.nativeEnum(LearningMethodEnum).optional(),
        meeting_date: stringIsTimestampTz().optional(),
        meeting_url: stringNotBlank().nullable().optional(),
        meeting_location: stringNotBlank().nullable().optional(),
        speaker_id: stringNotBlank().nullable().optional(),
        recording_url: stringNotBlank().nullable().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedLearning =
        await opts.ctx.prisma.learning.updateManyAndReturn({
          data: {
            cohort_id: opts.input.cohort_id,
            name: opts.input.name,
            description: opts.input.description,
            method: opts.input.method,
            meeting_date: opts.input.meeting_date,
            meeting_url: opts.input.meeting_url,
            meeting_location: opts.input.meeting_location,
            speaker_id: opts.input.speaker_id,
            recording_url: opts.input.recording_url,
            status: opts.input.status,
          },
          where: {
            id: opts.input.id,
            // deleted_at: null,
          },
        });
      if (updatedLearning.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected learning is not found.",
        });
      } else if (updatedLearning.length > 1) {
        console.error(
          "update.learning: More-than-one learnings are updated at once."
        );
      }
      return {
        status: 200,
        message: "Success",
        learning: updatedLearning[0],
      };
    }),

  material: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        learning_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().nullable().optional(),
        document_url: stringNotBlank().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedMaterial =
        await opts.ctx.prisma.material.updateManyAndReturn({
          data: {
            learning_id: opts.input.learning_id,
            name: opts.input.name,
            description: opts.input.description,
            document_url: opts.input.document_url,
            status: opts.input.status,
          },
          where: {
            id: opts.input.id,
            // deleted_at: null,
          },
        });
      if (updatedMaterial.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected material is not found.",
        });
      } else if (updatedMaterial.length > 1) {
        console.error(
          "update.material: More-than-one materials are updated at once."
        );
      }
      return {
        status: 200,
        message: "Success",
        material: updatedMaterial[0],
      };
    }),

  module: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().nullable().optional(),
        document_url: stringNotBlank().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedModule = await opts.ctx.prisma.module.updateManyAndReturn({
        data: {
          cohort_id: opts.input.cohort_id,
          name: opts.input.name,
          description: opts.input.description,
          document_url: opts.input.document_url,
          status: opts.input.status,
        },
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (updatedModule.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected module is not found.",
        });
      } else if (updatedModule.length > 1) {
        console.error(
          "update.module: More-than-one modules are updated at once."
        );
      }
      return {
        status: 200,
        message: "Success",
        module: updatedModule[0],
      };
    }),

  project: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        document_url: stringNotBlank().nullable().optional(),
        deadline_at: stringIsTimestampTz().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedProject = await opts.ctx.prisma.project.updateManyAndReturn({
        data: {
          cohort_id: opts.input.cohort_id,
          name: opts.input.name,
          description: opts.input.description,
          document_url: opts.input.document_url,
          deadline_at: opts.input.deadline_at,
          status: opts.input.status,
        },
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (updatedProject.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The selected project is not found.",
        });
      } else if (updatedProject.length > 1) {
        console.error(
          "update.project: More-than-one projects are updated at once."
        );
      }
      return {
        status: 200,
        message: "Success",
        project: updatedProject[0],
      };
    }),
});
