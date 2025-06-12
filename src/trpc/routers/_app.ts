import { createTRPCRouter } from "@/trpc/init";
import { authRouter } from "./auth";
import { helloRouter } from "./hello";
import { listRouter } from "./list";
import { readRouter } from "./read";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  auth: authRouter,
  list: listRouter,
  read: readRouter,
});

export type AppRouter = typeof appRouter;
