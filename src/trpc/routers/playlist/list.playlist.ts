import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure, publicProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsID,
  numberIsPositive,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const listPlaylist = {
  playlists: publicProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        deleted_at: null,
        status: undefined as Optional<StatusEnum>,
        name: undefined as Optional<{ contains: string; mode: "insensitive" }>,
      };

      if (!opts.ctx.user || opts.ctx.user.role.name !== "Administrator") {
        whereClause.status = StatusEnum.ACTIVE;
      }

      if (opts.input.keyword !== undefined) {
        whereClause.name = {
          contains: opts.input.keyword,
          mode: "insensitive",
        };
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.playlist.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const playlistList = await opts.ctx.prisma.playlist.findMany({
        orderBy: [{ published_at: "desc" }],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = playlistList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          tagline: entry.tagline,
          image_url: entry.image_url,
          price: entry.price,
          status: entry.status,
          slug_url: entry.slug_url,
          published_at: entry.published_at,
        };
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        keyword: opts.input.keyword,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  educatorsPlaylist: loggedInProcedure
    .input(
      z.object({
        playlist_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const educatorsPlaylistList =
        await opts.ctx.prisma.educatorPlaylist.findMany({
          include: { user: true },
          where: { playlist_id: opts.input.playlist_id },
          orderBy: [{ user_id: "asc" }],
        });
      const returnedList = educatorsPlaylistList.map((entry) => {
        return entry.user;
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  enrolledPlaylists: loggedInProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        user_id: opts.ctx.user.id,
        playlist: {
          deleted_at: null,
          name: undefined as Optional<{
            contains: string;
            mode: "insensitive";
          }>,
        },
      };

      if (opts.input.keyword !== undefined) {
        whereClause.playlist.name = {
          contains: opts.input.keyword,
          mode: "insensitive",
        };
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.userPlaylist.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const playlistList = await opts.ctx.prisma.userPlaylist.findMany({
        include: { playlist: true },
        orderBy: [{ playlist: { published_at: "desc" } }],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = playlistList.map((entry) => {
        return {
          id: entry.playlist.id,
          name: entry.playlist.name,
          tagline: entry.playlist.tagline,
          image_url: entry.playlist.image_url,
          price: entry.playlist.price,
          status: entry.playlist.status,
          slug_url: entry.playlist.slug_url,
          published_at: entry.playlist.published_at,
        };
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        keyword: opts.input.keyword,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),
};
