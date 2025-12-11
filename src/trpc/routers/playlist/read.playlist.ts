import { STATUS_FORBIDDEN, STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure, publicProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const readPlaylist = {
  playlist: publicProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const whereClause = {
      id: opts.input.id,
      deleted_at: null,
      status: undefined as StatusEnum | undefined,
    };
    const videoWhereClause = { status: undefined as StatusEnum | undefined };
    const countVideoWhereClause = {
      playlist_id: opts.input.id,
      status: undefined as StatusEnum | undefined,
    };
    if (!opts.ctx.user || opts.ctx.user.role.name !== "Administrator") {
      whereClause.status = StatusEnum.ACTIVE;
      videoWhereClause.status = StatusEnum.ACTIVE;
      countVideoWhereClause.status = StatusEnum.ACTIVE;
    }

    const thePlaylist = await opts.ctx.prisma.playlist.findFirst({
      include: {
        educators: {
          include: { user: { select: { full_name: true, avatar: true } } },
          omit: { user_id: true, playlist_id: true },
        },
        videos: {
          omit: {
            playlist_id: true,
            video_url: true,
            external_video_id: true,
          },
          orderBy: [{ num_order: "asc" }, { id: "asc" }],
          where: videoWhereClause,
        },
      },
      omit: {
        deleted_at: true,
        deleted_by_id: true,
      },
      where: whereClause,
    });
    if (!thePlaylist) {
      throw readFailedNotFound("playlist");
    }

    const videosCount = await opts.ctx.prisma.video.count({
      where: countVideoWhereClause,
    });
    const durationsSumAggregate = await opts.ctx.prisma.video.aggregate({
      _sum: { duration: true },
      where: countVideoWhereClause,
    });
    const durationsTotal = durationsSumAggregate._sum.duration;
    const usersCount = await opts.ctx.prisma.userPlaylist.count({
      where: {
        playlist_id: opts.input.id,
      },
    });

    const thePlaylistWithCounts = {
      ...thePlaylist,
      total_video: videosCount,
      total_duration: durationsTotal,
      total_user_enrolled: usersCount,
    };
    return {
      code: STATUS_OK,
      message: "Success",
      playlist: thePlaylistWithCounts,
    };
  }),

  enrolledPlaylist: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const thePlaylist = await opts.ctx.prisma.userPlaylist.findFirst({
        include: {
          playlist: {
            include: {
              educators: {
                include: {
                  user: { select: { full_name: true, avatar: true } },
                },
                omit: { user_id: true, playlist_id: true },
              },
              videos: {
                omit: { playlist_id: true },
                where: {
                  status: StatusEnum.ACTIVE,
                },
                orderBy: [{ num_order: "asc" }, { id: "asc" }],
              },
            },
            omit: {
              deleted_at: true,
              deleted_by_id: true,
            },
          },
        },
        where: {
          user_id: opts.ctx.user.id,
          playlist_id: opts.input.id,
          playlist: {
            deleted_at: null,
          },
        },
      });
      if (!thePlaylist) {
        throw readFailedNotFound("playlist");
      }

      const videosCount = await opts.ctx.prisma.video.count({
        where: {
          playlist_id: opts.input.id,
        },
      });
      const durationsSumAggregate = await opts.ctx.prisma.video.aggregate({
        _sum: { duration: true },
        where: {
          playlist_id: opts.input.id,
        },
      });
      const durationsTotal = durationsSumAggregate._sum.duration;
      const usersCount = await opts.ctx.prisma.userPlaylist.count({
        where: {
          playlist_id: opts.input.id,
        },
      });

      const thePlaylistWithCounts = {
        ...thePlaylist,
        total_video: videosCount,
        total_duration: durationsTotal,
        total_user_enrolled: usersCount,
      };
      return {
        code: STATUS_OK,
        message: "Success",
        playlist: thePlaylistWithCounts,
      };
    }),

  video: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    if (opts.ctx.user.role.name === "General User") {
      const checkVideo = await opts.ctx.prisma.video.findFirst({
        select: { playlist_id: true },
        where: {
          id: opts.input.id,
          status: StatusEnum.ACTIVE,
        },
      });
      if (!checkVideo) {
        throw readFailedNotFound("video");
      }
      const theEnrolledPlaylist = await opts.ctx.prisma.userPlaylist.findFirst({
        where: {
          user_id: opts.ctx.user.id,
          playlist_id: checkVideo.playlist_id,
        },
      });
      if (!theEnrolledPlaylist) {
        throw new TRPCError({
          code: STATUS_FORBIDDEN,
          message:
            "You're not allowed to read videos of a playlist which you aren't enrolled.",
        });
      }
    }
    const theVideo = await opts.ctx.prisma.video.findFirst({
      where: {
        id: opts.input.id,
      },
    });
    if (!theVideo) {
      throw readFailedNotFound("video");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      video: theVideo,
    };
  }),
};
