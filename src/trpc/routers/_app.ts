import { createTRPCRouter } from '@/trpc/init';
import { authRouter } from './auth';
import { helloRouter } from './hello';

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
