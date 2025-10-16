import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  objectHasOnlyID,
  stringIsUUID,
} from "@/trpc/utils/validation";
import z from "zod";

export const deletePlaylist = {
  playlist: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedPlaylistCount: number = await opts.ctx.prisma
        .$executeRaw`UPDATE playlists SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ${opts.ctx.user.id} WHERE id = ${opts.input.id};`;
      checkDeleteResult(deletedPlaylistCount, "playlists", "playlist");
      return {
        code: STATUS_NO_CONTENT,
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
      checkDeleteResult(
        deletedEducatorPlaylist.count,
        "educator playlists",
        "educatorPlaylist"
      );
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  video: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedVideo = await opts.ctx.prisma.video.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedVideo.count, "videos", "video");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
