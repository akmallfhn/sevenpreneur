import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  numberIsPositive,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const updatePlaylist = {
  playlist: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        tagline: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        video_preview_url: stringNotBlank().optional(),
        image_url: stringNotBlank().optional(),
        price: z.number().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        slug_url: stringNotBlank().optional(),
        published_at: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedPlaylist =
        await opts.ctx.prisma.playlist.updateManyAndReturn({
          data: {
            name: opts.input.name,
            tagline: opts.input.tagline,
            description: opts.input.description,
            video_preview_url: opts.input.video_preview_url,
            image_url: opts.input.image_url,
            price: opts.input.price,
            status: opts.input.status,
            slug_url: opts.input.slug_url,
            published_at: opts.input.published_at,
          },
          where: {
            id: opts.input.id,
            deleted_at: null,
          },
        });
      checkUpdateResult(updatedPlaylist.length, "playlist", "playlists");
      return {
        code: STATUS_OK,
        message: "Success",
        playlist: updatedPlaylist[0],
      };
    }),

  video: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        playlist_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        duration: numberIsPositive().optional(),
        image_url: stringNotBlank().optional(),
        video_url: stringNotBlank().optional(),
        num_order: z.number().optional(),
        external_video_id: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedVideo = await opts.ctx.prisma.video.updateManyAndReturn({
        data: {
          playlist_id: opts.input.playlist_id,
          name: opts.input.name,
          duration: opts.input.duration,
          image_url: opts.input.image_url,
          video_url: opts.input.video_url,
          num_order: opts.input.num_order,
          external_video_id: opts.input.external_video_id,
        },
        where: {
          id: opts.input.id,
        },
      });
      checkUpdateResult(updatedVideo.length, "video", "videos");
      return {
        code: STATUS_OK,
        message: "Success",
        video: updatedVideo[0],
      };
    }),
};
