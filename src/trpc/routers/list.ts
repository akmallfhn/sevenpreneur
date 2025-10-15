import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
} from "@/lib/status_code";
import {
  administratorProcedure,
  createTRPCRouter,
  loggedInProcedure,
  publicProcedure,
  roleBasedProcedure,
} from "@/trpc/init";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsPositive,
  numberIsRoleID,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import {
  CategoryEnum,
  Prisma,
  PrismaClient,
  StatusEnum,
  TStatusEnum,
} from "@prisma/client";
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

async function fetchItems(
  prisma: PrismaClient,
  list: { category: CategoryEnum; item_id: number }[],
  useCohortPrice: boolean,
  useEventPrice: boolean
) {
  const cohortIdList: Set<number> = new Set();
  const eventIdList: Set<number> = new Set();
  const playlistIdList: Set<number> = new Set();
  list.forEach((entry) => {
    if (entry.category === CategoryEnum.COHORT) {
      cohortIdList.add(entry.item_id);
    } else if (entry.category === CategoryEnum.EVENT) {
      eventIdList.add(entry.item_id);
    } else if (entry.category === CategoryEnum.PLAYLIST) {
      playlistIdList.add(entry.item_id);
    }
  });

  type Cohort = Prisma.CohortGetPayload<{}>;
  let cohortMap: Map<number, Cohort> | undefined;
  if (!useCohortPrice) {
    const cohortList = await prisma.cohort.findMany({
      where: { id: { in: Array.from(cohortIdList) } },
    });
    cohortMap = new Map(cohortList.map((entry) => [entry.id, entry]));
  }

  type CohortPrice = Prisma.CohortPriceGetPayload<{
    include: { cohort: true };
  }>;
  let cohortPriceMap: Map<number, CohortPrice> | undefined;
  if (useCohortPrice) {
    const cohortPriceList = await prisma.cohortPrice.findMany({
      include: { cohort: true },
      where: { id: { in: Array.from(cohortIdList) } },
    });
    cohortPriceMap = new Map(cohortPriceList.map((entry) => [entry.id, entry]));
  }

  type Event = Prisma.EventGetPayload<{}>;
  let eventMap: Map<number, Event> | undefined;
  if (!useEventPrice) {
    const eventList = await prisma.event.findMany({
      where: { id: { in: Array.from(eventIdList) } },
    });
    eventMap = new Map(eventList.map((entry) => [entry.id, entry]));
  }

  type EventPrice = Prisma.EventPriceGetPayload<{ include: { event: true } }>;
  let eventPriceMap: Map<number, EventPrice> | undefined;
  if (useEventPrice) {
    const eventPriceList = await prisma.eventPrice.findMany({
      include: { event: true },
      where: { id: { in: Array.from(eventIdList) } },
    });
    eventPriceMap = new Map(eventPriceList.map((entry) => [entry.id, entry]));
  }

  const playlistList = await prisma.playlist.findMany({
    where: { id: { in: Array.from(playlistIdList) } },
  });
  const videosCountList = await prisma.video.groupBy({
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

  return { cohortMap, cohortPriceMap, eventMap, eventPriceMap, playlistMap };
}

type CohortBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
};

type CohortBadgeWithPrice = CohortBadge & {
  priceName: string | undefined;
};

type EventBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
};

type EventBadgeWithPrice = EventBadge & {
  priceName: string | undefined;
};

type PlaylistBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
  totalVideo: number | undefined;
};

async function isEnrolledCohort(
  prisma: PrismaClient,
  user_id: string,
  cohort_id: number,
  error_message: string
) {
  const theEnrolledCohort = await prisma.userCohort.findFirst({
    where: {
      user_id: user_id,
      cohort_id: cohort_id,
    },
  });
  if (!theEnrolledCohort) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
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
      code: STATUS_OK,
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
      code: STATUS_OK,
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
      code: STATUS_OK,
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
      code: STATUS_OK,
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
        code: STATUS_OK,
        message: "Success",
        list: channelList,
      };
    }),

  users: roleBasedProcedure(["Administrator", "Educator", "Class Manager"])
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

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        keyword: opts.input.keyword,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
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
          cohort_prices: {
            status: StatusEnum.ACTIVE,
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
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
          slug_url: true,
          start_date: true,
          end_date: true,
          cohort_prices: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
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
          prices: entry.cohort_prices,
        };
      });

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        keyword: opts.input.keyword,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  enrolledCohorts: loggedInProcedure
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
        cohort: {
          deleted_at: null,
        },
      };

      if (opts.input.keyword !== undefined) {
        Object.assign(whereClause.cohort, {
          name: {
            contains: opts.input.keyword,
            mode: "insensitive",
          },
        });
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.userCohort.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const cohortList = await opts.ctx.prisma.userCohort.findMany({
        select: {
          cohort: {
            select: {
              id: true,
              name: true,
              image: true,
              status: true,
              slug_url: true,
              start_date: true,
              end_date: true,
            },
          },
        },
        orderBy: [
          { cohort: { end_date: "desc" } },
          { cohort: { start_date: "desc" } },
          { cohort: { published_at: "desc" } },
        ],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = cohortList.map((entry) => {
        return {
          id: entry.cohort.id,
          name: entry.cohort.name,
          image: entry.cohort.image,
          status: entry.cohort.status,
          slug_url: entry.cohort.slug_url,
          start_date: entry.cohort.start_date,
          end_date: entry.cohort.end_date,
        };
      });

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        keyword: opts.input.keyword,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  cohortMembers: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name == "General User") {
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.cohort_id,
          "You're not allowed to read members of a cohort which you aren't enrolled."
        );
      }
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
        code: STATUS_OK,
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
        code: STATUS_OK,
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
        code: STATUS_OK,
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
        code: STATUS_OK,
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
      if (opts.ctx.user.role.name == "General User") {
        const theLearning = await opts.ctx.prisma.learning.findFirst({
          select: { cohort_id: true },
          where: { id: opts.input.learning_id },
        });
        if (!theLearning) {
          throw new TRPCError({
            code: STATUS_NOT_FOUND,
            message: "The learning with the given ID is not found.",
          });
        }
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          theLearning.cohort_id,
          "You're not allowed to read materials of a cohort which you aren't enrolled."
        );
      }
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
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  discussionStarters: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name == "General User") {
        const theLearning = await opts.ctx.prisma.learning.findFirst({
          select: { cohort_id: true },
          where: { id: opts.input.learning_id },
        });
        if (!theLearning) {
          throw new TRPCError({
            code: STATUS_NOT_FOUND,
            message: "The learning with the given ID is not found.",
          });
        }
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          theLearning.cohort_id,
          "You're not allowed to read learning discussions of a cohort which you aren't enrolled."
        );
      }
      const discussionStartersList =
        await opts.ctx.prisma.discussionStarter.findMany({
          include: {
            user: {
              select: {
                full_name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
          where: { learning_id: opts.input.learning_id },
          orderBy: [{ created_at: "desc" }],
        });
      const returnedList = discussionStartersList.map((entry) => {
        return {
          id: entry.id,
          learning_id: entry.learning_id,
          full_name: entry.user.full_name,
          avatar: entry.user.avatar,
          message: entry.message,
          reply_count: entry._count.replies,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  discussionReplies: loggedInProcedure
    .input(
      z.object({
        starter_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name == "General User") {
        const theLearning = await opts.ctx.prisma.learning.findFirst({
          select: { cohort_id: true },
          where: {
            discussions: {
              some: {
                id: opts.input.starter_id,
              },
            },
          },
        });
        if (!theLearning) {
          throw new TRPCError({
            code: STATUS_NOT_FOUND,
            message: "The learning with the given ID is not found.",
          });
        }
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          theLearning.cohort_id,
          "You're not allowed to read learning discussions of a cohort which you aren't enrolled."
        );
      }
      const discussionRepliesList =
        await opts.ctx.prisma.discussionReply.findMany({
          include: {
            user: {
              select: {
                full_name: true,
                avatar: true,
              },
            },
          },
          where: { starter_id: opts.input.starter_id },
          orderBy: [{ created_at: "desc" }],
        });
      const returnedList = discussionRepliesList.map((entry) => {
        return {
          id: entry.id,
          starter_id: entry.starter_id,
          full_name: entry.user.full_name,
          avatar: entry.user.avatar,
          message: entry.message,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        };
      });
      return {
        code: STATUS_OK,
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
      if (opts.ctx.user.role.name == "General User") {
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.cohort_id,
          "You're not allowed to read modules of a cohort which you aren't enrolled."
        );
      }
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
        code: STATUS_OK,
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
      if (opts.ctx.user.role.name == "General User") {
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.cohort_id,
          "You're not allowed to read projects of a cohort which you aren't enrolled."
        );
      }
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
        code: STATUS_OK,
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
            code: STATUS_FORBIDDEN,
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
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  events: publicProcedure
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
          event_prices: {
            status: StatusEnum.ACTIVE,
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
        await opts.ctx.prisma.event.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const eventList = await opts.ctx.prisma.event.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
          slug_url: true,
          start_date: true,
          end_date: true,
          method: true,
          location_name: true,
          event_prices: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
        orderBy: [
          { end_date: "desc" },
          { start_date: "desc" },
          { published_at: "desc" },
        ],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = eventList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          image: entry.image,
          status: entry.status,
          slug_url: entry.slug_url,
          start_date: entry.start_date,
          end_date: entry.end_date,
          prices: entry.event_prices,
        };
      });

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        keyword: opts.input.keyword,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  eventPrices: loggedInProcedure
    .input(
      z.object({
        event_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const eventPricesList = await opts.ctx.prisma.eventPrice.findMany({
        where: { event_id: opts.input.event_id },
        orderBy: [{ amount: "asc" }, { created_at: "asc" }],
      });
      const returnedList = eventPricesList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          amount: entry.amount,
          status: entry.status,
        };
      });
      return {
        code: STATUS_OK,
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

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        keyword: opts.input.keyword,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
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

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        keyword: opts.input.keyword,
      });

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

  discounts: administratorProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
      })
    )
    .query(async (opts) => {
      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.discount.aggregate({ _count: true })
      );

      const discountList = await opts.ctx.prisma.discount.findMany({
        orderBy: [{ created_at: "desc" }],
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      const { cohortMap, playlistMap, eventMap } = await fetchItems(
        opts.ctx.prisma,
        discountList,
        false, // uses cohort ID
        false
      );

      const returnedList = discountList.map((entry) => {
        let cohortBadge: CohortBadge | undefined;
        if (entry.category === CategoryEnum.COHORT) {
          const selectedCohortPrice = cohortMap!.get(entry.item_id);
          if (selectedCohortPrice) {
            cohortBadge = {
              id: selectedCohortPrice.id,
              name: selectedCohortPrice.name,
              image: selectedCohortPrice.image,
              slugUrl: selectedCohortPrice.slug_url,
            };
          }
        }

        let playlistBadge: PlaylistBadge | undefined;
        if (entry.category === CategoryEnum.PLAYLIST) {
          const selectedPlaylist = playlistMap.get(entry.item_id);
          if (selectedPlaylist) {
            playlistBadge = {
              id: selectedPlaylist.entry.id,
              name: selectedPlaylist.entry.name,
              image: selectedPlaylist.entry.image_url,
              slugUrl: selectedPlaylist.entry.slug_url,
              totalVideo: selectedPlaylist.videosCount,
            };
          }
        }

        return {
          id: entry.id,
          name: entry.name,
          code: entry.code,
          category: entry.category,
          item_id: entry.item_id,
          calc_percent: entry.calc_percent,
          status: entry.status,
          start_date: entry.start_date,
          end_date: entry.end_date,
          cohort_id: cohortBadge?.id,
          cohort_name: cohortBadge?.name,
          cohort_image: cohortBadge?.image,
          cohort_slug: cohortBadge?.slugUrl,
          playlist_id: playlistBadge?.id,
          playlist_name: playlistBadge?.name,
          playlist_image: playlistBadge?.image,
          playlist_slug_url: playlistBadge?.slugUrl,
          playlist_total_video: playlistBadge?.totalVideo,
        };
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: paging.metapaging,
      };
    }),

  transactions: loggedInProcedure
    .input(
      z.object({
        user_id: stringIsUUID().optional(),
        cohort_id: numberIsID().optional(),
        playlist_id: numberIsID().optional(),
        event_id: numberIsID().optional(),
        start_date: z.string().date().optional(),
        end_date: z.string().date().optional(),
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
            code: STATUS_FORBIDDEN,
            message:
              "You're not allowed to read another user's transactions list.",
          });
        }
      }

      const whereClause = {
        user_id: selectedUserId,
        created_at: {},
      };

      const providedFilters = [
        opts.input.cohort_id,
        opts.input.playlist_id,
        opts.input.event_id,
      ].filter(Boolean);

      if (providedFilters.length > 1) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Provide only one of cohort_id, playlist_id, or event_id.",
        });
      }

      if (opts.input.cohort_id) {
        Object.assign(whereClause, {
          category: CategoryEnum.COHORT,
          item_id: opts.input.cohort_id,
        });
      }
      if (opts.input.event_id) {
        Object.assign(whereClause, {
          category: CategoryEnum.EVENT,
          item_id: opts.input.event_id,
        });
      }
      if (opts.input.playlist_id) {
        Object.assign(whereClause, {
          category: CategoryEnum.PLAYLIST,
          item_id: opts.input.playlist_id,
        });
      }

      if (opts.input.start_date) {
        Object.assign(whereClause.created_at, {
          gte: stringToDate(opts.input.start_date),
        });
      }
      if (opts.input.end_date) {
        const endDate = stringToDate(opts.input.end_date);
        if (endDate) {
          endDate.setDate(endDate.getDate() + 1);
          Object.assign(whereClause.created_at, {
            lt: endDate, // exclusive less than
          });
        }
      }

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

      const { cohortPriceMap, playlistMap, eventPriceMap } = await fetchItems(
        opts.ctx.prisma,
        transactionsList,
        true, // uses cohort price ID
        true
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

        let cohortBadge: CohortBadgeWithPrice | undefined;
        if (entry.category === CategoryEnum.COHORT) {
          const selectedCohortPrice = cohortPriceMap!.get(entry.item_id);
          if (selectedCohortPrice) {
            cohortBadge = {
              id: selectedCohortPrice.cohort.id,
              name: selectedCohortPrice.cohort.name,
              image: selectedCohortPrice.cohort.image,
              slugUrl: selectedCohortPrice.cohort.slug_url,
              priceName: selectedCohortPrice.name,
            };
          }
        }

        let eventBadge: EventBadgeWithPrice | undefined;
        if (entry.category === CategoryEnum.EVENT) {
          const selectedEventPrice = eventPriceMap!.get(entry.item_id);
          if (selectedEventPrice) {
            eventBadge = {
              id: selectedEventPrice.event.id,
              name: selectedEventPrice.event.name,
              image: selectedEventPrice.event.image,
              slugUrl: selectedEventPrice.event.slug_url,
              priceName: selectedEventPrice.name,
            };
          }
        }

        let playlistBadge: PlaylistBadge | undefined;
        if (entry.category === CategoryEnum.PLAYLIST) {
          const selectedPlaylist = playlistMap.get(entry.item_id);
          if (selectedPlaylist) {
            playlistBadge = {
              id: selectedPlaylist.entry.id,
              name: selectedPlaylist.entry.name,
              image: selectedPlaylist.entry.image_url,
              slugUrl: selectedPlaylist.entry.slug_url,
              totalVideo: selectedPlaylist.videosCount,
            };
          }
        }

        return {
          id: entry.id,
          category: entry.category,
          item_id: entry.item_id,
          total_amount: entry.amount
            .sub(entry.discount_amount)
            .plus(entry.admin_fee)
            .plus(entry.vat),
          net_amount: entry.amount.sub(entry.discount_amount),
          currency: entry.currency,
          status: entry.status,
          paid_at: entry.paid_at,
          created_at: entry.created_at,
          invoice_url: invoiceUrl,
          cohort_id: cohortBadge?.id,
          cohort_name: cohortBadge?.name,
          cohort_image: cohortBadge?.image,
          cohort_slug: cohortBadge?.slugUrl,
          cohort_price_name: cohortBadge?.priceName,
          event_id: eventBadge?.id,
          event_name: eventBadge?.name,
          event_image: eventBadge?.image,
          event_slug: eventBadge?.slugUrl,
          event_price_name: eventBadge?.priceName,
          playlist_id: playlistBadge?.id,
          playlist_name: playlistBadge?.name,
          playlist_image: playlistBadge?.image,
          playlist_slug_url: playlistBadge?.slugUrl,
          playlist_total_video: playlistBadge?.totalVideo,
        };
      });

      const wherePaid = Object.assign(
        { status: TStatusEnum.PAID },
        whereClause
      );
      const wherePending = Object.assign(
        { status: TStatusEnum.PENDING },
        whereClause
      );
      const whereFailed = Object.assign(
        { status: TStatusEnum.FAILED },
        whereClause
      );

      const totalAmounts = await opts.ctx.prisma.transaction.aggregate({
        _sum: { amount: true, discount_amount: true },
        where: wherePaid, // only sum paid transactions
      });
      const ZERO = new Prisma.Decimal(0);
      const totalAmount = totalAmounts._sum.amount || ZERO;
      const totalDiscountAmount = totalAmounts._sum.discount_amount || ZERO;

      const totalPaid = await opts.ctx.prisma.transaction.aggregate({
        _count: true,
        where: wherePaid,
      });
      const totalPending = await opts.ctx.prisma.transaction.aggregate({
        _count: true,
        where: wherePending,
      });
      const totalFailed = await opts.ctx.prisma.transaction.aggregate({
        _count: true,
        where: whereFailed,
      });

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        total_revenue: totalAmount.sub(totalDiscountAmount),
        total_paid: totalPaid._count,
        total_pending: totalPending._count,
        total_failed: totalFailed._count,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),
});
