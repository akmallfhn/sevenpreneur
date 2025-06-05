import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

const prisma = new PrismaClient();

export const createTRPCContext = cache(async () => {
  return { prisma }
});

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
