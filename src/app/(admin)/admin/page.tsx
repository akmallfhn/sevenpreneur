import { HydrateClient, trpc } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";

export default async function AdminHomePage() {
  // This is for server-side rendering (on first page load)
  await trpc.hello.getHello.prefetch();

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 overflow-y-auto lg:flex lg:pl-64">
      <HydrateClient>
        <p>
          <ClientGreeting /> Welcome to Admin page!
        </p>
      </HydrateClient>
    </div>
  );
}
