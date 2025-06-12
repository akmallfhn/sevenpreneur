import { createTRPCRouter } from "@/trpc/init";
import { authRouter } from "./auth";
import { helloRouter } from "./hello";
import { listRouter } from "./list";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  auth: authRouter,
  list: listRouter,
});

export type AppRouter = typeof appRouter;
