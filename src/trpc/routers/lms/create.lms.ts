import {
  STATUS_CREATED,
  STATUS_FORBIDDEN,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { loggedInProcedure, roleBasedProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import {
  numberIsID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z, { number, string } from "zod";

export const createLMS = {
  cohort: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        name: stringNotBlank(),
        description: stringNotBlank(),
        image: stringNotBlank(),
        status: z.enum(StatusEnum),
        slug_url: stringNotBlank().optional(),
        start_date: stringIsTimestampTz(),
        end_date: stringIsTimestampTz(),
        published_at: stringIsTimestampTz().optional(),
        cohort_prices: z
          .array(
            z.object({
              name: stringNotBlank(),
              amount: z.number(),
              status: z.enum(StatusEnum),
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new cohort.",
        });
      }
      return {
        code: STATUS_CREATED,
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
        status: z.enum(StatusEnum),
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new cohort price.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        cohortPrice: theCohortPrice,
      };
    }),

  module: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        cohort_id: numberIsID(),
        name: stringNotBlank(),
        description: stringNotBlank().nullable().optional(),
        document_url: stringNotBlank(),
        status: z.enum(StatusEnum),
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new module.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        module: theModule,
      };
    }),

  learning: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        cohort_id: numberIsID(),
        name: stringNotBlank(),
        description: stringNotBlank(),
        method: z.enum(LearningMethodEnum),
        meeting_date: stringIsTimestampTz(),
        meeting_url: stringNotBlank().nullable().optional(),
        location_name: stringNotBlank().nullable().optional(),
        location_url: stringNotBlank().nullable().optional(),
        speaker_id: stringNotBlank().nullable().optional(),
        recording_url: stringNotBlank().nullable().optional(),
        external_video_id: stringNotBlank().nullable().optional(),
        status: z.enum(StatusEnum),
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
          external_video_id: opts.input.external_video_id,
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new learning.",
        });
      }
      return {
        code: STATUS_CREATED,
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
        status: z.enum(StatusEnum),
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new material.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        material: theMaterial,
      };
    }),

  discussionStarter: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
        message: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const createdDiscussionStarter =
        await opts.ctx.prisma.discussionStarter.create({
          data: {
            user_id: opts.ctx.user.id,
            learning_id: opts.input.learning_id,
            message: opts.input.message,
          },
        });
      const theDiscussionStarter =
        await opts.ctx.prisma.discussionStarter.findFirst({
          where: {
            id: createdDiscussionStarter.id,
          },
        });
      if (!theDiscussionStarter) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new discussion starter.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        discussion: theDiscussionStarter,
      };
    }),

  discussionReply: loggedInProcedure
    .input(
      z.object({
        starter_id: numberIsID(),
        message: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const createdDiscussionReply =
        await opts.ctx.prisma.discussionReply.create({
          data: {
            user_id: opts.ctx.user.id,
            starter_id: opts.input.starter_id,
            message: opts.input.message,
          },
        });
      const theDiscussionReply =
        await opts.ctx.prisma.discussionReply.findFirst({
          where: {
            id: createdDiscussionReply.id,
          },
        });
      if (!theDiscussionReply) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new discussion reply.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        discussion: theDiscussionReply,
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
        status: z.enum(StatusEnum),
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new project.",
        });
      }
      return {
        code: STATUS_CREATED,
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new submission.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        submission: theSubmission,
      };
    }),

  checkIn: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const userId = opts.ctx.user.id;

      const existing = await opts.ctx.prisma.attendance.findFirst({
        where: {
          learning_id: opts.input.learning_id,
          user_id: userId,
        },
      });

      if (existing && !existing.check_in_at) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already checked in.",
        });
      }

      const theCheckIn = await opts.ctx.prisma.attendance.upsert({
        create: {
          learning_id: opts.input.learning_id,
          user_id: userId,
          check_in_at: new Date(),
        },
        update: {
          check_in_at: new Date(),
        },
        where: {
          learning_id_user_id: {
            learning_id: opts.input.learning_id,
            user_id: userId,
          },
        },
      });
      return {
        code: STATUS_CREATED,
        message: "Success",
        attendance: theCheckIn,
      };
    }),

  checkOut: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
        check_out_code: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const userId = opts.ctx.user.id;
      const learning = await opts.ctx.prisma.learning.findFirst({
        where: {
          id: opts.input.learning_id,
        },
      });

      if (!learning) {
        throw readFailedNotFound("learning");
      }

      if (learning.check_out_code !== opts.input.check_out_code) {
        throw new TRPCError({
          code: STATUS_FORBIDDEN,
          message: "Check Out Code is Wrong",
        });
      }

      const existing = await opts.ctx.prisma.attendance.findFirst({
        where: {
          learning_id: opts.input.learning_id,
          user_id: userId,
        },
      });

      if (existing && !existing.check_out_at) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already checked out.",
        });
      }

      const theCheckOut = await opts.ctx.prisma.attendance.upsert({
        create: {
          learning_id: opts.input.learning_id,
          user_id: userId,
          check_out_at: new Date(),
        },
        update: {
          check_out_at: new Date(),
        },
        where: {
          learning_id_user_id: {
            learning_id: opts.input.learning_id,
            user_id: userId,
          },
        },
      });
      return {
        code: STATUS_CREATED,
        message: "Success",
        attendance: theCheckOut,
      };
    }),
};
