import { PrismaClient } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function createTRPCContext() {
  async function getUserFromHeader() {
    const heads = await headers();
    const authHeader = heads.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const sessionToken = authHeader.substring(7);
    const tokenObj = await prisma.token.findUnique({
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
      where: {
        token: sessionToken,
      },
    });
    if (!tokenObj) {
      return null;
    }

    return tokenObj.user;
  }
  const user = await getUserFromHeader();

  return { prisma, user };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const loggedInProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      prisma: ctx.prisma,
      user: ctx.user, // not-null
    },
  });
});

export const administratorProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.user.role.name != "Administrator") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      prisma: ctx.prisma,
      user: ctx.user, // not-null
    },
  });
});
