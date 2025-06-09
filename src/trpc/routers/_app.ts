import { createTRPCRouter } from '@/trpc/init';
import { helloRouter } from './hello';

export const appRouter = createTRPCRouter({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
