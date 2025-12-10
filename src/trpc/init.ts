import GetPrismaClient from "@/lib/prisma";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";

export type createTRPCContextOptions = {
  secretKey: string;
  sessionToken: string;
};

export async function createTRPCContext(
  opts: createTRPCContextOptions | undefined
) {
  const prisma = GetPrismaClient();

  const secret = opts?.secretKey;

  async function getSessionTokenFromHeader() {
    const heads = await headers();
    const authHeader = heads.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    return authHeader.substring(7);
  }

  async function getUserFromSessionToken(sessionToken: string) {
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

  const sessionToken =
    opts?.sessionToken || (await getSessionTokenFromHeader());
  let user;
  if (sessionToken !== null) {
    user = await getUserFromSessionToken(sessionToken);
  }

  return { prisma, secret, user };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const publicProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    if (!ctx.secret) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (ctx.secret !== process.env.SECRET_KEY_PUBLIC_API!) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }
  return opts.next(opts);
});

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
  if (ctx.user.role.name !== "Administrator") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      prisma: ctx.prisma,
      user: ctx.user, // not-null
    },
  });
});

export const roleBasedProcedure = (roleList: string[]) => {
  return t.procedure.use(async (opts) => {
    const { ctx } = opts;
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!roleList.includes(ctx.user.role.name)) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return opts.next({
      ctx: {
        prisma: ctx.prisma,
        user: ctx.user, // not-null
      },
    });
  });
};
