import { createTRPCRouter, loggedInProcedure } from "@/trpc/init";

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

  users: loggedInProcedure.query(async (opts) => {
    const userList = await opts.ctx.prisma.user.findMany({
      include: { role: true },
      orderBy: [{ role_id: "asc" }, { full_name: "asc" }],
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
});
