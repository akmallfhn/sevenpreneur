import { Optional } from "@/lib/optional-type";
import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_OK,
} from "@/lib/status_code";
import { loggedInProcedure, roleBasedProcedure } from "@/trpc/init";
import { checkUpdateResult, readFailedNotFound } from "@/trpc/utils/errors";
import {
  numberIsID,
  stringIsTimestampTz,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const updateLMS = {
  cohort: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        image: stringNotBlank().optional(),
        status: z.enum(StatusEnum).optional(),
        slug_url: stringNotBlank().optional(),
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
      checkUpdateResult(updatedCohort.length, "cohort", "cohorts");
      return {
        code: STATUS_OK,
        message: "Success",
        cohort: updatedCohort[0],
      };
    }),

  cohortPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        amount: z.number().optional(),
        status: z.enum(StatusEnum).optional(),
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
      checkUpdateResult(
        updatedCohortPrice.length,
        "cohort price",
        "cohort prices",
        "cohortPrice"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        cohort: updatedCohortPrice[0],
      };
    }),

  cohortMember: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        user_id: stringIsUUID(),
        cohort_id: numberIsID(),
        certificate_url: stringNotBlank().nullable().optional(),
        is_scout: z.boolean().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedCohortMember =
        await opts.ctx.prisma.userCohort.updateManyAndReturn({
          data: {
            certificate_url: opts.input.certificate_url,
            is_scout: opts.input.is_scout,
          },
          where: {
            user_id: opts.input.user_id,
            cohort_id: opts.input.cohort_id,
          },
        });
      checkUpdateResult(
        updatedCohortMember.length,
        "cohort member",
        "cohort members",
        "cohortMember"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        member: updatedCohortMember[0],
      };
    }),

  module: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().nullable().optional(),
        document_url: stringNotBlank().optional(),
        status: z.enum(StatusEnum).optional(),
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
      checkUpdateResult(updatedModule.length, "module", "modules");
      return {
        code: STATUS_OK,
        message: "Success",
        module: updatedModule[0],
      };
    }),

  learning: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        method: z.enum(LearningMethodEnum).optional(),
        meeting_date: stringIsTimestampTz().optional(),
        meeting_url: stringNotBlank().nullable().optional(),
        location_name: stringNotBlank().nullable().optional(),
        location_url: stringNotBlank().nullable().optional(),
        speaker_id: stringNotBlank().nullable().optional(),
        recording_url: stringNotBlank().nullable().optional(),
        external_video_id: stringNotBlank().nullable().optional(),
        price_id: numberIsID().nullable().optional(),
        status: z.enum(StatusEnum).optional(),
        check_in: z.boolean().optional(),
        check_out: z.boolean().optional(),
        check_out_code: stringNotBlank().nullable().optional(),
        feedback_form: stringNotBlank().nullable().optional(),
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
            location_name: opts.input.location_name,
            location_url: opts.input.location_url,
            speaker_id: opts.input.speaker_id,
            recording_url: opts.input.recording_url,
            external_video_id: opts.input.external_video_id,
            price_id: opts.input.price_id,
            status: opts.input.status,
            check_in: opts.input.check_in,
            check_out: opts.input.check_out,
            check_out_code: opts.input.check_out_code,
            feedback_form: opts.input.feedback_form,
          },
          where: {
            id: opts.input.id,
            // deleted_at: null,
          },
        });
      checkUpdateResult(updatedLearning.length, "learning", "learnings");
      return {
        code: STATUS_OK,
        message: "Success",
        learning: updatedLearning[0],
      };
    }),

  material: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        learning_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().nullable().optional(),
        document_url: stringNotBlank().optional(),
        status: z.enum(StatusEnum).optional(),
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
      checkUpdateResult(updatedMaterial.length, "material", "materials");
      return {
        code: STATUS_OK,
        message: "Success",
        material: updatedMaterial[0],
      };
    }),

  discussionStarter: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
        message: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedDiscussionStarter =
        await opts.ctx.prisma.discussionStarter.updateManyAndReturn({
          data: {
            message: opts.input.message,
          },
          where: {
            id: opts.input.id,
            user_id: opts.ctx.user.id,
          },
        });
      checkUpdateResult(
        updatedDiscussionStarter.length,
        "discussion starter",
        "discussion starters",
        "discussionStarter"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        discussion: updatedDiscussionStarter[0],
      };
    }),

  discussionReply: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
        message: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedDiscussionReply =
        await opts.ctx.prisma.discussionReply.updateManyAndReturn({
          data: {
            message: opts.input.message,
          },
          where: {
            id: opts.input.id,
            user_id: opts.ctx.user.id,
          },
        });
      checkUpdateResult(
        updatedDiscussionReply.length,
        "discussion reply",
        "discussion replies",
        "discussionReply"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        discussion: updatedDiscussionReply[0],
      };
    }),

  project: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        cohort_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        document_url: stringNotBlank().nullable().optional(),
        deadline_at: stringIsTimestampTz().optional(),
        status: z.enum(StatusEnum).optional(),
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
      checkUpdateResult(updatedProject.length, "project", "projects");
      return {
        code: STATUS_OK,
        message: "Success",
        project: updatedProject[0],
      };
    }),

  submission: roleBasedProcedure(["Administrator", "Educator", "General User"])
    .input(
      z.object({
        id: numberIsID(),
        document_url: stringNotBlank().nullable().optional(),
        comment: stringNotBlank().nullable().optional(),
        is_favorite: z.boolean().optional(),
      })
    )
    .mutation(async (opts) => {
      let theDocumentUrl: Optional<string | null>;
      let theComment: Optional<string | null>;
      let isFavorite: Optional<boolean>;
      if (opts.ctx.user.role.name !== "Educator") {
        theDocumentUrl = opts.input.document_url;
      }
      if (opts.ctx.user.role.name !== "General User") {
        theComment = opts.input.comment;
        isFavorite = opts.input.is_favorite;
      }

      if (
        theDocumentUrl === undefined &&
        theComment === undefined &&
        isFavorite === undefined
      ) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Bad request",
        });
      }

      let selectedUserId: Optional<string> = undefined;
      if (opts.ctx.user.role.name === "General User") {
        selectedUserId = opts.ctx.user.id;
      }

      if (opts.ctx.user.role.name === "General User") {
        const theSubmissionDeadline =
          await opts.ctx.prisma.submission.findFirst({
            select: {
              project: {
                select: {
                  deadline_at: true,
                },
              },
            },
            where: {
              id: opts.input.id,
              submitter_id: selectedUserId,
            },
          });
        if (!theSubmissionDeadline) {
          throw readFailedNotFound("submission");
        }
        if (theSubmissionDeadline.project.deadline_at.getTime() < Date.now()) {
          throw new TRPCError({
            code: STATUS_FORBIDDEN,
            message:
              "The project relating the submission has passed the deadline.",
          });
        }
      }

      const updatedSubmission =
        await opts.ctx.prisma.submission.updateManyAndReturn({
          data: {
            document_url: theDocumentUrl,
            comment: theComment,
            is_favorite: isFavorite,
          },
          where: {
            id: opts.input.id,
            submitter_id: selectedUserId,
            // deleted_at: null,
          },
        });
      checkUpdateResult(updatedSubmission.length, "submission", "submissions");

      return {
        code: STATUS_OK,
        message: "Success",
        submission: updatedSubmission[0],
      };
    }),
};
