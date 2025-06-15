import { createTRPCRouter } from "@/trpc/init";
import { authRouter } from "./auth";
import { createRouter } from "./create";
import { helloRouter } from "./hello";
import { listRouter } from "./list";
import { readRouter } from "./read";
import { updateRouter } from "./update";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  auth: authRouter,
  list: listRouter,
  create: createRouter,
  read: readRouter,
  update: updateRouter,
});

export type AppRouter = typeof appRouter;
