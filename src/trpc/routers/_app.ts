import { createTRPCRouter } from "@/trpc/init";
import { authRouter } from "./auth";
import { createRouter } from "./create";
import { deleteRouter } from "./delete";
import { helloRouter } from "./hello";
import { listRouter } from "./list";
import { readRouter } from "./read";
import { updateRouter } from "./update";
import { buyRouter } from "./buy";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  auth: authRouter,
  list: listRouter,
  create: createRouter,
  read: readRouter,
  update: updateRouter,
  delete: deleteRouter,
  buy: buyRouter,
});

export type AppRouter = typeof appRouter;
