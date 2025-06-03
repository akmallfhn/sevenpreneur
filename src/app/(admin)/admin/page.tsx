import { HydrateClient, trpc } from "../../../trpc/server";
import { ClientGreeting } from "./client-greeting";

export default function AdminHomePage() {
  // This is for server-side rendering (on first page load)
  void trpc.getHello.prefetch({
    text: "brothers and sisters",
  });

  return (
    <HydrateClient>
      <p><ClientGreeting /> Welcome to Admin page!</p>
    </HydrateClient>
  );
}
