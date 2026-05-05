import ObstaclesLab from "@/components/pages/ObstaclesLab";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Obstacles" };

export default async function ObstaclesPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);
  return <ObstaclesLab sessionToken={sessionToken} />;
}
