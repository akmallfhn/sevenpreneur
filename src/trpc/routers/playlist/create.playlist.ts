import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import {
  numberIsID,
  numberIsPositive,
  stringIsTimestampTz,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createPlaylist = {
  playlist: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        tagline: stringNotBlank(),
        description: stringNotBlank(),
        video_preview_url: stringNotBlank(),
        image_url: stringNotBlank(),
        price: z.number(),
        status: z.enum(StatusEnum),
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new playlist.",
        });
      }
      return {
        code: STATUS_CREATED,
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
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new educator playlist.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        educatorPlaylist: theEducatorPlaylist,
      };
    }),

  video: administratorProcedure
    .input(
      z.object({
        playlist_id: numberIsID(),
        name: stringNotBlank(),
        description: stringNotBlank().nullable().optional(),
        duration: numberIsPositive(),
        image_url: stringNotBlank(),
        video_url: stringNotBlank(),
        num_order: z.number().optional(),
        external_video_id: stringNotBlank(),
        status: z.enum(StatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdVideo = await opts.ctx.prisma.video.create({
        data: {
          playlist_id: opts.input.playlist_id,
          name: opts.input.name,
          description: opts.input.description,
          duration: opts.input.duration,
          image_url: opts.input.image_url,
          video_url: opts.input.video_url,
          num_order: opts.input.num_order,
          external_video_id: opts.input.external_video_id,
          status: opts.input.status,
        },
      });
      const theVideo = await opts.ctx.prisma.video.findFirst({
        where: {
          id: createdVideo.id,
        },
      });
      if (!theVideo) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new video.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        video: theVideo,
      };
    }),
};
