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
  if (loggedOut.code === "SUCCESS") {
    let domain = "sevenpreneur.com";
    if (process.env.DOMAIN_MODE === "local") {
      domain = "example.com";
    }
    // cookieStore.delete("session_token");
    cookieStore.set("session_token", "", {
      domain: domain,
      path: "/",
      maxAge: 0,
    });
    return { code: loggedOut.code, message: loggedOut.message };
  }

  return { status: 401, message: "Logout failed" };
}
