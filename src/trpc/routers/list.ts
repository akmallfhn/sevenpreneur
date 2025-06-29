import { createTRPCRouter, loggedInProcedure } from "@/trpc/init";
import { numberIsID, numberIsRoleID } from "@/trpc/utils/validation";
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

  cohorts: loggedInProcedure.query(async (opts) => {
    const cohortList = await opts.ctx.prisma.cohort.findMany({
      orderBy: [
        { end_date: "desc" },
        { start_date: "desc" },
        { published_at: "desc" },
      ],
      where: { deleted_at: null },
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
          meeting_location: entry.meeting_location,
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
});
