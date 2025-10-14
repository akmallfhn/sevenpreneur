import {
  administratorProcedure,
  createTRPCRouter,
  loggedInProcedure,
  roleBasedProcedure,
} from "@/trpc/init";
import { numberIsID, stringIsUUID } from "@/trpc/utils/validation";
import { z } from "zod";

export const deleteRouter = createTRPCRouter({
  user: administratorProcedure
    .input(
      z.object({
        id: stringIsUUID(),
      })
    )
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedUser: number = await opts.ctx.prisma
        .$executeRaw`UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ${opts.input.id}::uuid;`;
      if (deletedUser > 1) {
        console.error("delete.user: More-than-one users are deleted at once.");
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  cohort: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedCohort: number = await opts.ctx.prisma
        .$executeRaw`UPDATE cohorts SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ${opts.ctx.user.id} WHERE id = ${opts.input.id};`;
      if (deletedCohort > 1) {
        console.error(
          "delete.cohort: More-than-one cohorts are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  cohortPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedCohortPrice = await opts.ctx.prisma.cohortPrice.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedCohortPrice.count > 1) {
        console.error(
          "delete.cohortPrice: More-than-one cohort prices are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  learning: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedLearning = await opts.ctx.prisma.learning.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedLearning.count > 1) {
        console.error(
          "delete.learning: More-than-one learnings are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  material: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedMaterial = await opts.ctx.prisma.material.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedMaterial.count > 1) {
        console.error(
          "delete.material: More-than-one materials are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  discussionStarter: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      let selectedUserId: string | undefined = opts.ctx.user.id;
      if (opts.ctx.user.role.name === "Administrator") {
        selectedUserId = undefined;
      }
      const deletedDiscussionStarter =
        await opts.ctx.prisma.discussionStarter.deleteMany({
          where: {
            id: opts.input.id,
            user_id: selectedUserId,
          },
        });
      if (deletedDiscussionStarter.count > 1) {
        console.error(
          "delete.discussionStarter: More-than-one discussion starters are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  discussionReply: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
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
      if (deletedDiscussionReply.count > 1) {
        console.error(
          "delete.discussionReply: More-than-one discussion replies are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  module: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedModule = await opts.ctx.prisma.module.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedModule.count > 1) {
        console.error(
          "delete.module: More-than-one modules are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  project: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedProject = await opts.ctx.prisma.project.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedProject.count > 1) {
        console.error(
          "delete.project: More-than-one projects are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  submission: roleBasedProcedure(["Administrator", "General User"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      let selectedUser: string | undefined = undefined;
      if (opts.ctx.user.role.name === "General User") {
        selectedUser = opts.ctx.user.id;
      }
      const deletedSubmission = await opts.ctx.prisma.submission.deleteMany({
        where: {
          id: opts.input.id,
          submitter_id: selectedUser,
        },
      });
      if (deletedSubmission.count > 1) {
        console.error(
          "delete.submission: More-than-one submissions are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  event: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedEvent: number = await opts.ctx.prisma
        .$executeRaw`UPDATE events SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ${opts.ctx.user.id} WHERE id = ${opts.input.id};`;
      if (deletedEvent > 1) {
        console.error(
          "delete.event: More-than-one events are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  eventPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedEventPrice = await opts.ctx.prisma.eventPrice.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedEventPrice.count > 1) {
        console.error(
          "delete.eventPrice: More-than-one event prices are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  playlist: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedPlaylist: number = await opts.ctx.prisma
        .$executeRaw`UPDATE playlists SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ${opts.ctx.user.id} WHERE id = ${opts.input.id};`;
      if (deletedPlaylist > 1) {
        console.error(
          "delete.playlist: More-than-one playlists are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
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
      const deletedEducatorPlaylist =
        await opts.ctx.prisma.educatorPlaylist.deleteMany({
          where: {
            playlist_id: opts.input.playlist_id,
            user_id: opts.input.user_id,
          },
        });
      if (deletedEducatorPlaylist.count > 1) {
        console.error(
          "delete.educatorPlaylist: More-than-one educator playlists are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  video: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedVideo = await opts.ctx.prisma.video.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedVideo.count > 1) {
        console.error(
          "delete.video: More-than-one videos are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),

  discount: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const deletedDiscount = await opts.ctx.prisma.discount.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      if (deletedDiscount.count > 1) {
        console.error(
          "delete.discount: More-than-one discounts are deleted at once."
        );
      }
      return {
        code: "NO_CONTENT",
        message: "Success",
      };
    }),
});
