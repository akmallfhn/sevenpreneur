"use server";
import { cookies } from "next/headers";
import { trpc } from "@/trpc/server";

// DELETE SESSION FOR LOGOUT
export async function DeleteSession() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session_token");

  if (!sessionData) {
    return { status: 401, message: "No session token found" };
  }

  // --- Request Backend Delete Token Database
  const loggedOut = await trpc.auth.logout({ token: sessionData.value });

  // --- Delete token on Cookie
  if (sessionData) {
    cookieStore.delete("session_token");
    return { status: loggedOut.status, message: loggedOut.message };
  }

  return { status: 401, message: "Logout failed" };
}
