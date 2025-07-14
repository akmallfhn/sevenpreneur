import {
  baseProcedure,
  createTRPCRouter,
  loggedInProcedure,
} from "@/trpc/init";
import {
  numberIsID,
  numberIsRoleID,
  stringIsUUID,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { z } from "zod";

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

  phone_country_codes: loggedInProcedure.query(async (opts) => {
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

  payment_channels: loggedInProcedure.query(async (opts) => {
    const channelList = await opts.ctx.prisma.paymentChannel.findMany();
    const returnedList = channelList.map((entry) => {
      return {
        id: entry.id,
        label: entry.label,
        image: entry.image,
      };
    });
    return {
      status: 200,
      message: "Success",
      list: returnedList,
    };
  }),

  users: loggedInProcedure
    .input(z.object({ role_id: numberIsRoleID().optional() }).optional())
    .query(async (opts) => {
      const userList = await opts.ctx.prisma.user.findMany({
        include: { role: true },
        orderBy: [{ role_id: "asc" }, { full_name: "asc" }],
        where: {
          role_id: opts.input?.role_id,
          deleted_at: null,
        },
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
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),

  cohorts: baseProcedure.query(async (opts) => {
    let whereClause = { deleted_at: null };
    if (!opts.ctx.user) {
      whereClause = Object.assign(whereClause, {
        status: StatusEnum.ACTIVE,
        published_at: {
          lte: new Date(),
        },
      });
    }
    const cohortList = await opts.ctx.prisma.cohort.findMany({
      orderBy: [
        { end_date: "desc" },
        { start_date: "desc" },
        { published_at: "desc" },
      ],
      where: whereClause,
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

  learnings_public: baseProcedure
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

  transactions: loggedInProcedure
    .input(
      z.object({
        user_id: stringIsUUID(),
      })
    )
    .query(async (opts) => {
      const transactionsList = await opts.ctx.prisma.transaction.findMany({
        where: { user_id: opts.input.user_id },
        orderBy: [{ updated_at: "asc" }, { created_at: "asc" }],
      });
      const returnedList = transactionsList.map((entry) => {
        return {
          id: entry.id,
          user_id: entry.user_id,
          category: entry.category,
          item_id: entry.item_id,
          amount: entry.amount,
          currency: entry.currency,
          status: entry.status,
          paid_at: entry.paid_at,
        };
      });
      return {
        status: 200,
        message: "Success",
        list: returnedList,
      };
    }),
});
