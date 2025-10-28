import { STATUS_FORBIDDEN, STATUS_NO_CONTENT } from "@/lib/status_code";
import { loggedInProcedure, roleBasedProcedure } from "@/trpc/init";
import { checkDeleteResult, readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";
import { TRPCError } from "@trpc/server";

export const deleteLMS = {
  cohort: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedCohortCount: number = await opts.ctx.prisma
        .$executeRaw`UPDATE cohorts SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ${opts.ctx.user.id} WHERE id = ${opts.input.id};`;
      checkDeleteResult(deletedCohortCount, "cohorts", "cohort");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  cohortPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedCohortPrice = await opts.ctx.prisma.cohortPrice.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(
        deletedCohortPrice.count,
        "cohort prices",
        "cohortPrice"
      );
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  module: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedModule = await opts.ctx.prisma.module.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedModule.count, "modules", "module");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  learning: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedLearning = await opts.ctx.prisma.learning.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedLearning.count, "learnings", "learning");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  material: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedMaterial = await opts.ctx.prisma.material.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedMaterial.count, "materials", "material");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  discussionStarter: loggedInProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      let selectedUserId: string | undefined = opts.ctx.user.id;
      if (opts.ctx.user.role.name === "Administrator") {
        selectedUserId = undefined;
      }
      await opts.ctx.prisma.$transaction(async (tx) => {
        await opts.ctx.prisma.discussionReply.deleteMany({
          where: {
            starter_id: opts.input.id,
          },
        });
        const deletedDiscussionStarter =
          await opts.ctx.prisma.discussionStarter.deleteMany({
            where: {
              id: opts.input.id,
              user_id: selectedUserId,
            },
          });
        checkDeleteResult(
          deletedDiscussionStarter.count,
          "discussion starters",
          "discussionStarter"
        );
      });
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  discussionReply: loggedInProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      let selectedUserId: string | undefined = opts.ctx.user.id;
      if (opts.ctx.user.role.name === "Administrator") {
        selectedUserId = undefined;
      }
      const deletedDiscussionReply =
        await opts.ctx.prisma.discussionReply.deleteMany({
          where: {
            id: opts.input.id,
            user_id: selectedUserId,
          },
        });
      checkDeleteResult(
        deletedDiscussionReply.count,
        "discussion replies",
        "discussionReply"
      );
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  project: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedProject = await opts.ctx.prisma.project.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedProject.count, "projects", "project");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  submission: roleBasedProcedure(["Administrator", "General User"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      let selectedUserId: string | undefined = undefined;
      if (opts.ctx.user.role.name === "General User") {
        selectedUserId = opts.ctx.user.id;

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

      const deletedSubmission = await opts.ctx.prisma.submission.deleteMany({
        where: {
          id: opts.input.id,
          submitter_id: selectedUserId,
        },
      });
      checkDeleteResult(deletedSubmission.count, "submissions", "submission");

      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
