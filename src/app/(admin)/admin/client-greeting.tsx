"use client";

import { trpc } from "@/trpc/client";

export function ClientGreeting() {
  const greeting = trpc.getHello.useQuery({
    text: "brothers and sisters",
  });
  if (!greeting.data) return <>...</>;
  return <>{greeting.data.greeting}</>;
}
