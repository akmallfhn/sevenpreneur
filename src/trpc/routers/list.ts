import {
  createTRPCRouter,
  loggedInProcedure,
  publicProcedure,
} from "@/trpc/init";
import {
  numberIsID,
  numberIsPositive,
  numberIsRoleID,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { CategoryEnum, StatusEnum, TStatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

function calculatePage(
  input: { page?: number; page_size?: number },
  aggregation: { _count: number }
) {
  let pageSize: number | undefined;
  let totalPage: number | undefined;
  let currentPage: number | undefined;
  let prismaSkip: number | undefined;

  if (input.page_size) {
    pageSize = input.page_size || 1;
    totalPage = Math.ceil(aggregation._count / pageSize);
    currentPage = Math.max(input.page || 1, 1);
    prismaSkip = (currentPage - 1) * pageSize;
  }

  return {
    prisma: {
      skip: prismaSkip,
      take: pageSize,
    },
    metapaging: {
      total_data: aggregation._count,
      total_page: totalPage,
      current_page: currentPage,
      page_size: pageSize,
    },
  };
}

export const listRouter = createTRPCRouter({
  industries: loggedInProcedure.query(async (opts) => {
    const industryList = await opts.ctx.prisma.industry.findMany({
      orderBy: [{ industry_name: "asc" }, { id: "asc" }],
    });
    const returnedList = industryList.map((entry) => {
      return {
        id: entry.id,
        name: entry.industry_name,
      };
    });
    return {
      status: 200,
      message: "Success",
      list: returnedList,
    };
  }),

  entrepreneurStages: loggedInProcedure.query(async (opts) => {
    const stageList = await opts.ctx.prisma.entrepreneurStage.findMany({
      orderBy: [{ id: "asc" }],
    });
    const returnedList = stageList.map((entry) => {
      return {
        id: entry.id,
        name: entry.stage_name,
      };
    });
    return {
      status: 200,
      message: "Success",
      list: returnedList,
    };
  }),

  roles: loggedInProcedure.query(async (opts) => {
    const roleList = await opts.ctx.prisma.role.findMany({
      orderBy: [{ id: "asc" }],
    });
    const returnedList = roleList.map((entry) => {
      return {
        id: entry.id,
        name: entry.name,
      };
    });
    return {
      status: 200,
      message: "Success",
      list: returnedList,
    };
  }),

  phoneCountryCodes: loggedInProcedure.query(async (opts) => {
    const codeList = await opts.ctx.prisma.phoneCountryCode.findMany();
    const returnedList = codeList.map((entry) => {
      return {
        id: entry.id,
        country_name: entry.country_name,
        phone_code: entry.phone_code,
        emoji: entry.emoji,
      };
    });
    return {
      status: 200,
      message: "Success",
      list: returnedList,
    };
  }),

  paymentChannels: loggedInProcedure
    .input(z.object({ method: stringNotBlank().optional() }).optional())
    .query(async (opts) => {
      const channelList = await opts.ctx.prisma.paymentChannel.findMany({
        where: {
          method: opts.input?.method,
          status: StatusEnum.ACTIVE,
        },
      });
      return {
        status: 200,
        message: "Success",
        list: channelList,
      };
    }),

  users: loggedInProcedure
    .input(
      z.object({
        role_id: numberIsRoleID().optional(),
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        role_id: opts.input.role_id,
        deleted_at: null,
      };

      if (opts.input.keyword !== undefined) {
        Object.assign(whereClause, {
          full_name: {
            contains: opts.input.keyword,
            mode: "insensitive",
          },
        });
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.user.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const userList = await opts.ctx.prisma.user.findMany({
        include: { role: true },
        orderBy: [{ role_id: "asc" }, { full_name: "asc" }],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = userList.map((entry) => {
        return {
          id: entry.id,
          full_name: entry.full_name,
          email: entry.email,
          avatar: entry.avatar,
          role_id: entry.role_id,
          role_name: entry.role.name,
          status: entry.status,
          created_at: entry.created_at,
          last_login: entry.last_login,
        };
      });

      if (opts.input.keyword !== undefined) {
        Object.assign(paging.metapaging, {
          keyword: opts.input.keyword,
        });
      }

      return {
        status: 200,
        message: "Success",
        list: returnedList,
        metapaging: paging.metapaging,
      };
    }),

  cohorts: publicProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = { deleted_at: null };

      if (!opts.ctx.user || opts.ctx.user.role.name !== "Administrator") {
        Object.assign(whereClause, {
          status: StatusEnum.ACTIVE,
          published_at: {
            lte: new Date(),
          },
        });
      }

      if (opts.input.keyword !== undefined) {
        Object.assign(whereClause, {
          name: {
            contains: opts.input.keyword,
            mode: "insensitive",
          },
        });
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.cohort.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const cohortList = await opts.ctx.prisma.cohort.findMany({
        orderBy: [
          { end_date: "desc" },
          { start_date: "desc" },
          { published_at: "desc" },
        ],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = cohortList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          image: entry.image,
          status: entry.status,
          slug_url: entry.slug_url,
          start_date: entry.start_date,
          end_date: entry.end_date,
        };
      });

      if (opts.input.keyword !== undefined) {
        Object.assign(paging.metapaging, {
          keyword: opts.input.keyword,
        });
      }

      return {
        status: 200,
        message: "Success",
        list: returnedList,
        metapaging: paging.metapaging,
      };
    }),

  cohortMembers: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const cohortMemberList = await opts.ctx.prisma.userCohort.findMany({
        include: { user: { include: { phone_country: true } } },
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ user: { role_id: "asc" } }, { user: { full_name: "asc" } }],
      });
      const returnedList = cohortMemberList.map((entry) => {
        return {
          id: entry.user_id,
          full_name: entry.user.full_name,
          email: entry.user.email,
          phone_country: entry.user.phone_country,
          phone_number: entry.user.phone_number,
          avatar: entry.user.avatar,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  cohortPrices: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const cohortPricesList = await opts.ctx.prisma.cohortPrice.findMany({
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ amount: "asc" }, { created_at: "asc" }],
      });
      const returnedList = cohortPricesList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          amount: entry.amount,
          status: entry.status,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  learnings: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const learningsList = await opts.ctx.prisma.learning.findMany({
        include: { speaker: true },
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ meeting_date: "desc" }, { created_at: "desc" }],
      });
      const returnedList = learningsList.map((entry) => {
        return {
          id: entry.id,
          cohort_id: entry.cohort_id,
          name: entry.name,
          method: entry.method,
          meeting_date: entry.meeting_date,
          meeting_url: entry.meeting_url,
          location_name: entry.location_name,
          location_url: entry.location_url,
          speaker: entry.speaker,
          status: entry.status,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  learnings_public: publicProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const learningsList = await opts.ctx.prisma.learning.findMany({
        include: { speaker: true },
        where: {
          cohort_id: opts.input.cohort_id,
          status: StatusEnum.ACTIVE,
        },
        orderBy: [{ meeting_date: "desc" }, { created_at: "desc" }],
      });
      const returnedList = learningsList.map((entry) => {
        return {
          name: entry.name,
          method: entry.method,
          speaker_name: entry.speaker?.full_name || null,
          speaker_avatar: entry.speaker?.avatar || null,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  materials: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const materialsList = await opts.ctx.prisma.material.findMany({
        where: { learning_id: opts.input.learning_id },
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
      });
      const returnedList = materialsList.map((entry) => {
        return {
          id: entry.id,
          learning_id: entry.learning_id,
          name: entry.name,
          document_url: entry.document_url,
          status: entry.status,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  modules: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const modulesList = await opts.ctx.prisma.module.findMany({
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
      });
      const returnedList = modulesList.map((entry) => {
        return {
          id: entry.id,
          cohort_id: entry.cohort_id,
          name: entry.name,
          document_url: entry.document_url,
          status: entry.status,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  projects: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const projectsList = await opts.ctx.prisma.project.findMany({
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
      });
      const returnedList = projectsList.map((entry) => {
        return {
          id: entry.id,
          cohort_id: entry.cohort_id,
          name: entry.name,
          deadline_at: entry.deadline_at,
          status: entry.status,
          submission_percentage: Math.round(Math.random() * 100), // TODO: Use the actual data
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  submissions: loggedInProcedure
    .input(
      z.object({
        project_id: numberIsID(),
        submitter_id: stringIsUUID().optional(),
      })
    )
    .query(async (opts) => {
      let selectedUserId = opts.input.submitter_id;
      if (opts.ctx.user.role.name === "General User") {
        if (!selectedUserId) {
          selectedUserId = opts.ctx.user.id;
        }
        if (opts.ctx.user.id !== selectedUserId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You're not allowed to read another user's submissions list.",
          });
        }
      }
      const submissionsList = await opts.ctx.prisma.submission.findMany({
        include: { submitter: true },
        where: {
          project_id: opts.input.project_id,
          submitter_id: selectedUserId,
        },
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
      });
      const returnedList = submissionsList.map((entry) => {
        return {
          id: entry.id,
          project_id: entry.project_id,
          submitter_id: entry.submitter_id,
          full_name: entry.submitter.full_name,
          avatar: entry.submitter.avatar,
          created_at: entry.created_at,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  playlists: publicProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = { deleted_at: null };

      if (!opts.ctx.user || opts.ctx.user.role.name !== "Administrator") {
        Object.assign(whereClause, {
          status: StatusEnum.ACTIVE,
          published_at: {
            lte: new Date(),
          },
        });
      }

      if (opts.input.keyword !== undefined) {
        Object.assign(whereClause, {
          name: {
            contains: opts.input.keyword,
            mode: "insensitive",
          },
        });
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

      if (opts.input.keyword !== undefined) {
        Object.assign(paging.metapaging, {
          keyword: opts.input.keyword,
        });
      }

      return {
        status: 200,
        message: "Success",
        list: returnedList,
        metapaging: paging.metapaging,
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
        },
      };

      if (opts.input.keyword !== undefined) {
        Object.assign(whereClause.playlist, {
          name: {
            contains: opts.input.keyword,
            mode: "insensitive",
          },
        });
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

      if (opts.input.keyword !== undefined) {
        Object.assign(paging.metapaging, {
          keyword: opts.input.keyword,
        });
      }

      return {
        status: 200,
        message: "Success",
        list: returnedList,
        metapaging: paging.metapaging,
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
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  transactions: loggedInProcedure
    .input(
      z.object({
        user_id: stringIsUUID().optional(),
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
      })
    )
    .query(async (opts) => {
      let selectedUserId = opts.input.user_id;
      if (opts.ctx.user.role.name !== "Administrator") {
        if (!selectedUserId) {
          selectedUserId = opts.ctx.user.id;
        }
        if (opts.ctx.user.id !== selectedUserId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You're not allowed to read another user's transactions list.",
          });
        }
      }
      const whereClause = { user_id: selectedUserId };

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.transaction.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const transactionsList = await opts.ctx.prisma.transaction.findMany({
        where: whereClause,
        orderBy: [{ created_at: "desc" }],
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      const cohortIdList: Set<number> = new Set();
      const playlistIdList: Set<number> = new Set();
      transactionsList.forEach((entry) => {
        if (entry.category === CategoryEnum.COHORT) {
          cohortIdList.add(entry.item_id);
        } else if (entry.category === CategoryEnum.PLAYLIST) {
          playlistIdList.add(entry.item_id);
        }
      });

      const cohortPriceList = await opts.ctx.prisma.cohortPrice.findMany({
        include: { cohort: true },
        where: { id: { in: Array.from(cohortIdList) } },
      });
      const cohortPriceMap = new Map(
        cohortPriceList.map((entry) => [entry.id, entry])
      );

      const playlistList = await opts.ctx.prisma.playlist.findMany({
        where: { id: { in: Array.from(playlistIdList) } },
      });
      const videosCountList = await opts.ctx.prisma.video.groupBy({
        by: ["playlist_id"],
        _count: true,
        where: {
          playlist_id: { in: Array.from(playlistIdList) },
        },
      });
      const videosCountMap = new Map(
        videosCountList.map((entry) => [entry.playlist_id, entry._count])
      );
      const playlistMap = new Map(
        playlistList.map((entry) => {
          const videosCount = videosCountMap.get(entry.id) || 0;
          return [entry.id, { entry, videosCount }];
        })
      );

      let checkoutPrefix = "https://checkout.xendit.co/web/";
      if (process.env.XENDIT_MODE === "test") {
        checkoutPrefix = "https://checkout-staging.xendit.co/v2/";
      }

      const returnedList = transactionsList.map((entry) => {
        let invoiceUrl: string | undefined;
        if (entry.status === TStatusEnum.PENDING) {
          invoiceUrl = `${checkoutPrefix}${entry.invoice_number}`;
        }

        let cohortId: number | undefined;
        let cohortName: string | undefined;
        let cohortImage: string | undefined;
        let cohortSlugUrl: string | undefined;
        let cohortPriceName: string | undefined;
        if (entry.category === CategoryEnum.COHORT) {
          const selectedCohortPrice = cohortPriceMap.get(entry.item_id);
          if (selectedCohortPrice) {
            cohortId = selectedCohortPrice.cohort.id;
            cohortName = selectedCohortPrice.cohort.name;
            cohortImage = selectedCohortPrice.cohort.image;
            cohortSlugUrl = selectedCohortPrice.cohort.slug_url;
            cohortPriceName = selectedCohortPrice.name;
          }
        }

        let playlistId: number | undefined;
        let playlistName: string | undefined;
        let playlistImage: string | undefined;
        let playlistSlugUrl: string | undefined;
        let playlistTotalVideo: number | undefined;
        if (entry.category === CategoryEnum.PLAYLIST) {
          const selectedPlaylist = playlistMap.get(entry.item_id);
          if (selectedPlaylist) {
            playlistId = selectedPlaylist.entry.id;
            playlistName = selectedPlaylist.entry.name;
            playlistImage = selectedPlaylist.entry.image_url;
            playlistSlugUrl = selectedPlaylist.entry.slug_url;
            playlistTotalVideo = selectedPlaylist.videosCount;
          }
        }

        return {
          id: entry.id,
          category: entry.category,
          item_id: entry.item_id,
          total_amount: entry.amount.plus(entry.admin_fee),
          currency: entry.currency,
          status: entry.status,
          paid_at: entry.paid_at,
          created_at: entry.created_at,
          invoice_url: invoiceUrl,
          cohort_id: cohortId,
          cohort_name: cohortName,
          cohort_image: cohortImage,
          cohort_slug: cohortSlugUrl,
          cohort_price_name: cohortPriceName,
          playlist_id: playlistId,
          playlist_name: playlistName,
          playlist_image: playlistImage,
          playlist_slug_url: playlistSlugUrl,
          playlist_total_video: playlistTotalVideo,
        };
      });

      return {
        status: 200,
        message: "Success",
        list: returnedList,
        metapaging: paging.metapaging,
      };
    }),
});
