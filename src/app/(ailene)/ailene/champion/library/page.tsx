import LibraryChampionAILN from "@/components/pages/LibraryChampionAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Library & Assignment",
};

export default async function ChampionLibraryPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return <LibraryChampionAILN sessionToken={sessionToken} />;
}
