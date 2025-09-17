import {
  administratorProcedure,
  createTRPCRouter,
  roleBasedProcedure,
} from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsPositive,
  numberIsRoleID,
  stringIsTimestampTz,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { CategoryEnum, LearningMethodEnum, StatusEnum } from "@prisma/client";
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

  event: roleBasedProcedure(["Administrator", "Class Manager"])
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
        event_prices: z
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
      const createdEvent = await opts.ctx.prisma.event.create({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          status: opts.input.status,
          slug_url: slugUrl,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
          published_at: opts.input.published_at,
          event_prices: {
            create: opts.input.event_prices,
          },
        },
      });
      const theEvent = await opts.ctx.prisma.event.findFirst({
        include: {
          event_prices: true,
        },
        where: {
          id: createdEvent.id,
          deleted_at: null,
        },
      });
      if (!theEvent) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new cohort.",
        });
      }
      return {
        status: 200,
        message: "Success",
        event: theEvent,
      };
    }),

  playlist: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        tagline: stringNotBlank(),
        description: stringNotBlank(),
        video_preview_url: stringNotBlank(),
        image_url: stringNotBlank(),
        price: z.number(),
        status: z.nativeEnum(StatusEnum),
        slug_url: stringNotBlank().optional(),
        published_at: stringIsTimestampTz().optional(),
        educators: z.array(stringIsUUID()).optional(),
      })
    )
    .mutation(async (opts) => {
      const slugUrl =
        typeof opts.input.slug_url !== "undefined"
          ? opts.input.slug_url
          : createSlugFromTitle(opts.input.name);
      const createEducatorsPlaylist = opts.input.educators
        ? {
            createMany: {
              data: opts.input.educators.map((entry) => {
                return {
                  user_id: entry,
                };
              }),
            },
          }
        : undefined;
      const createdPlaylist = await opts.ctx.prisma.playlist.create({
        data: {
          name: opts.input.name,
          tagline: opts.input.tagline,
          description: opts.input.description,
          video_preview_url: opts.input.video_preview_url,
          image_url: opts.input.image_url,
          price: opts.input.price,
          status: opts.input.status,
          slug_url: slugUrl,
          published_at: opts.input.published_at,
          educators: createEducatorsPlaylist,
        },
      });
      const thePlaylist = await opts.ctx.prisma.playlist.findFirst({
        include: {
          educators: true,
        },
        where: {
          id: createdPlaylist.id,
          deleted_at: null,
        },
      });
      if (!thePlaylist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new playlist.",
        });
      }
      return {
        status: 200,
        message: "Success",
        playlist: thePlaylist,
      };
    }),

  educatorPlaylist: administratorProcedure
    .input(
      z.object({
        playlist_id: numberIsID(),
        user_id: stringIsUUID(),
      })
    )
    .mutation(async (opts) => {
      const createdEducatorPlaylist =
        await opts.ctx.prisma.educatorPlaylist.create({
          data: {
            playlist_id: opts.input.playlist_id,
            user_id: opts.input.user_id,
          },
        });
      const theEducatorPlaylist =
        await opts.ctx.prisma.educatorPlaylist.findFirst({
          where: {
            playlist_id: createdEducatorPlaylist.playlist_id,
            user_id: createdEducatorPlaylist.user_id,
          },
        });
      if (!theEducatorPlaylist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new educator playlist.",
        });
      }
      return {
        status: 200,
        message: "Success",
        educatorPlaylist: theEducatorPlaylist,
      };
    }),

  video: administratorProcedure
    .input(
      z.object({
        playlist_id: numberIsID(),
        name: stringNotBlank(),
        duration: numberIsPositive(),
        image_url: stringNotBlank(),
        video_url: stringNotBlank(),
        num_order: z.number().optional(),
        external_video_id: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const createdVideo = await opts.ctx.prisma.video.create({
        data: {
          playlist_id: opts.input.playlist_id,
          name: opts.input.name,
          duration: opts.input.duration,
          image_url: opts.input.image_url,
          video_url: opts.input.video_url,
          num_order: opts.input.num_order,
          external_video_id: opts.input.external_video_id,
        },
      });
      const theVideo = await opts.ctx.prisma.video.findFirst({
        where: {
          id: createdVideo.id,
        },
      });
      if (!theVideo) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new video.",
        });
      }
      return {
        status: 200,
        message: "Success",
        video: theVideo,
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

  discount: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        code: stringNotBlank(),
        category: z.nativeEnum(CategoryEnum),
        item_id: numberIsID(),
        calc_percent: z.number(),
        status: z.nativeEnum(StatusEnum),
        start_date: stringIsTimestampTz(),
        end_date: stringIsTimestampTz(),
      })
    )
    .mutation(async (opts) => {
      const createdDiscount = await opts.ctx.prisma.discount.create({
        data: {
          name: opts.input.name,
          code: opts.input.code,
          category: opts.input.category,
          item_id: opts.input.item_id,
          calc_percent: opts.input.calc_percent,
          status: opts.input.status,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
        },
      });
      const theDiscount = await opts.ctx.prisma.discount.findFirst({
        where: {
          id: createdDiscount.id,
          // deleted_at: null,
        },
      });
      if (!theDiscount) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new discount.",
        });
      }
      return {
        status: 200,
        message: "Success",
        discount: theDiscount,
      };
    }),
});
