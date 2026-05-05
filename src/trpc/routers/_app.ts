import { createTRPCRouter } from "@/trpc/init";
import { aileneRouter } from "./ailene/_router.ailene";
import { labRouter } from "./lab/_router.lab";
import { authRouter } from "./auth";
import { checkRouter } from "./check";
import { createRouter } from "./create";
import { deleteRouter } from "./delete";
import { helloRouter } from "./hello";
import { listRouter } from "./list";
import { purchaseRouter } from "./purchase";
import { readRouter } from "./read";
import { sendRouter } from "./send";
import { updateRouter } from "./update";
import { useRouter } from "./use";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  ailene: aileneRouter,
  lab: labRouter,
  auth: authRouter,
  list: listRouter,
  create: createRouter,
  read: readRouter,
  update: updateRouter,
  delete: deleteRouter,
  check: checkRouter,
  use: useRouter,
  purchase: purchaseRouter,
  send: sendRouter,
});

export type AppRouter = typeof appRouter;
