import { createTRPCRouter } from "@/trpc/init";
import { aileneRouter } from "./ailene/_router.ailene";
import { analyticsRouter } from "./analytics/_router.analytics";
import { authRouter } from "./auth";
import { metaAdsRouter } from "./meta_ads/_router.meta_ads";
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
  analytics: analyticsRouter,
  auth: authRouter,
  metaAds: metaAdsRouter,
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
