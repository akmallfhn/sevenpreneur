import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

// Per-request scoped state via React cache (backed by AsyncLocalStorage).
// This prevents session token bleed between concurrent requests hitting the
// same warm serverless instance.
const getRequestState = cache(() => ({ secretKey: "", sessionToken: "" }));

export function setSecretKey(newSecretKey: string) {
  getRequestState().secretKey = newSecretKey;
}

export function setSessionToken(newToken: string) {
  getRequestState().sessionToken = newToken;
}

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(() => {
  const state = getRequestState();
  return createTRPCContext({
    secretKey: state.secretKey,
    sessionToken: state.sessionToken,
  });
});

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
