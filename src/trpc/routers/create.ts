import {
  administratorProcedure,
  createTRPCRouter,
  roleBasedProcedure,
} from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsRoleID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createRouter = createTRPCRouter({
  user: administratorProcedure
    .input(
      z.object({
        full_name: stringNotBlank(),
        email: stringNotBlank(),
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
        avatar: stringNotBlank().nullable().optional(),
        role_id: numberIsRoleID(),
        status: z.nativeEnum(StatusEnum),
        date_of_birth: z.string().date().nullable().optional(),
        learning_goal: stringNotBlank().nullable().optional(),
        entrepreneur_stage_id: numberIsID().nullable().optional(),
        business_name: stringNotBlank().nullable().optional(),
        industry_id: numberIsID().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const dateOfBirth = stringToDate(opts.input.date_of_birth);
      const createdUser = await opts.ctx.prisma.user.create({
        data: {
          full_name: opts.input.full_name,
          email: opts.input.email,
          phone_country_id: opts.input.phone_country_id,
          phone_number: opts.input.phone_number,
          avatar: opts.input.avatar,
          role_id: opts.input.role_id,
          status: opts.input.status,
          date_of_birth: dateOfBirth,
          learning_goal: opts.input.learning_goal,
          entrepreneur_stage_id: opts.input.entrepreneur_stage_id,
          business_name: opts.input.business_name,
          industry_id: opts.input.industry_id,
        },
      });
      const theUser = await opts.ctx.prisma.user.findFirst({
        include: {
          phone_country: true,
          role: true,
          entrepreneur_stage: true,
          industry: true,
        },
        where: { id: createdUser.id },
      });
      if (!theUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new user.",
        });
      }
      return {
        status: 200,
        message: "Success",
        user: theUser,
      };
    }),

  cohort: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        name: stringNotBlank(),
        description: stringNotBlank(),
        image: stringNotBlank(),
        status: z.nativeEnum(StatusEnum),
        slug_url: stringNotBlank().optional(),
        start_date: stringIsTimestampTz(),
        end_date: stringIsTimestampTz(),
        published_at: stringIsTimestampTz().optional(),
        cohort_prices: z
          .array(
            z.object({
              name: stringNotBlank(),
              amount: z.number(),
              status: z.nativeEnum(StatusEnum),
            })
          )
          .min(1),
      })
    )
    .mutation(async (opts) => {
      const slugUrl =
        typeof opts.input.slug_url !== "undefined"
          ? opts.input.slug_url
          : createSlugFromTitle(opts.input.name);
      const createdCohort = await opts.ctx.prisma.cohort.create({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          status: opts.input.status,
          slug_url: slugUrl,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
          published_at: opts.input.published_at,
          cohort_prices: {
            create: opts.input.cohort_prices,
          },
        },
      });
      const theCohort = await opts.ctx.prisma.cohort.findFirst({
        include: {
          cohort_prices: true,
        },
        where: {
          id: createdCohort.id,
          deleted_at: null,
        },
      });
      if (!theCohort) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new cohort.",
        });
      }
      return {
        status: 200,
        message: "Success",
        cohort: theCohort,
      };
    }),

  cohortPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        cohort_id: numberIsID(),
        name: stringNotBlank(),
        amount: z.number(),
        status: z.nativeEnum(StatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdCohortPrice = await opts.ctx.prisma.cohortPrice.create({
        data: {
          cohort_id: opts.input.cohort_id,
          name: opts.input.name,
          amount: opts.input.amount,
          status: opts.input.status,
        },
      });
      const theCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
        where: {
          id: createdCohortPrice.id,
          // deleted_at: null,
        },
      });
      if (!theCohortPrice) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new cohort price.",
        });
      }
      return {
        status: 200,
        message: "Success",
        cohortPrice: theCohortPrice,
      };
    }),

  learning: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        cohort_id: numberIsID(),
        name: stringNotBlank(),
        description: stringNotBlank(),
        method: z.nativeEnum(LearningMethodEnum),
        meeting_date: stringIsTimestampTz(),
        meeting_url: stringNotBlank().nullable().optional(),
        location_name: stringNotBlank().nullable().optional(),
        location_url: stringNotBlank().nullable().optional(),
        speaker_id: stringNotBlank().nullable().optional(),
        recording_url: stringNotBlank().nullable().optional(),
        status: z.nativeEnum(StatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdLearning = await opts.ctx.prisma.learning.create({
        data: {
          cohort_id: opts.input.cohort_id,
          name: opts.input.name,
          description: opts.input.description,
          method: opts.input.method,
          meeting_date: opts.input.meeting_date,
          meeting_url: opts.input.meeting_url,
          location_name: opts.input.location_name,
          location_url: opts.input.location_url,
          speaker_id: opts.input.speaker_id,
          recording_url: opts.input.recording_url,
          status: opts.input.status,
        },
      });
      const theLearning = await opts.ctx.prisma.learning.findFirst({
        where: {
          id: createdLearning.id,
          // deleted_at: null,
        },
      });
      if (!theLearning) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new learning.",
        });
      }
      return {
        status: 200,
        message: "Success",
        learning: theLearning,
      };
    }),

  material: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        learning_id: numberIsID(),
        name: stringNotBlank(),
        description: stringNotBlank().nullable().optional(),
        document_url: stringNotBlank(),
        status: z.nativeEnum(StatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdMaterial = await opts.ctx.prisma.material.create({
        data: {
          learning_id: opts.input.learning_id,
          name: opts.input.name,
          description: opts.input.description,
          document_url: opts.input.document_url,
          status: opts.input.status,
        },
      });
      const theMaterial = await opts.ctx.prisma.material.findFirst({
        where: {
          id: createdMaterial.id,
          // deleted_at: null,
        },
      });
      if (!theMaterial) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new material.",
        });
      }
      return {
        status: 200,
        message: "Success",
        material: theMaterial,
      };
    }),

  module: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        cohort_id: numberIsID(),
        name: stringNotBlank(),
        description: stringNotBlank().nullable().optional(),
        document_url: stringNotBlank(),
        status: z.nativeEnum(StatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdModule = await opts.ctx.prisma.module.create({
        data: {
          cohort_id: opts.input.cohort_id,
          name: opts.input.name,
          description: opts.input.description,
          document_url: opts.input.document_url,
          status: opts.input.status,
        },
      });
      const theModule = await opts.ctx.prisma.module.findFirst({
        where: {
          id: createdModule.id,
          // deleted_at: null,
        },
      });
      if (!theModule) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new module.",
        });
      }
      return {
        status: 200,
        message: "Success",
        module: theModule,
      };
    }),

  project: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        cohort_id: numberIsID(),
        name: stringNotBlank(),
        description: stringNotBlank(),
        document_url: stringNotBlank().nullable().optional(),
        deadline_at: stringIsTimestampTz(),
        status: z.nativeEnum(StatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdProject = await opts.ctx.prisma.project.create({
        data: {
          cohort_id: opts.input.cohort_id,
          name: opts.input.name,
          description: opts.input.description,
          document_url: opts.input.document_url,
          deadline_at: opts.input.deadline_at,
          status: opts.input.status,
        },
      });
      const theProject = await opts.ctx.prisma.project.findFirst({
        where: {
          id: createdProject.id,
          // deleted_at: null,
        },
      });
      if (!theProject) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new project.",
        });
      }
      return {
        status: 200,
        message: "Success",
        project: theProject,
      };
    }),

  submission: roleBasedProcedure(["Administrator", "General User"])
    .input(
      z.object({
        project_id: numberIsID(),
        document_url: stringNotBlank().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const createdSubmission = await opts.ctx.prisma.submission.create({
        data: {
          project_id: opts.input.project_id,
          submitter_id: opts.ctx.user.id,
          document_url: opts.input.document_url,
        },
      });
      const theSubmission = await opts.ctx.prisma.submission.findFirst({
        where: {
          id: createdSubmission.id,
          // deleted_at: null,
        },
      });
      if (!theSubmission) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new submission.",
        });
      }
      return {
        status: 200,
        message: "Success",
        submission: theSubmission,
      };
    }),
});
