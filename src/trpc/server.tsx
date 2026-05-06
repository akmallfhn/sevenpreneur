import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

let secretKey: string = "";
let sessionToken: string = "";

export function setSecretKey(newSecretKey: string) {
  secretKey = newSecretKey;
}

export function setSessionToken(newToken: string) {
  sessionToken = newToken;
}

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(() =>
  createTRPCContext({
    secretKey: secretKey,
    sessionToken: sessionToken,
  })
);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
