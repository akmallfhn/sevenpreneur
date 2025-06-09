import { trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // --- Receive access token from Google
  const body = await request.json();
  const accessToken = body.tokenResponse.access_token;

  // --- Backend
  const loggedIn = await trpc.auth.login({ accessToken });
  const sessionToken = loggedIn.token.token;
  const user = loggedIn.registered_user;

  // --- Save session token to cookie
  if (sessionToken) {
    let domain = "sevenpreneur.com";
    if (process.env.DOMAIN_MODE === "local") {
      domain = "example.com";
    }

    const cookieStore = await cookies();
    cookieStore.set("session_token", sessionToken, {
      domain: "example.com",
      httpOnly: true,
      secure: true,
      maxAge: 21600,
    });

    // --- Send Response Success
    return NextResponse.json({
      status: 200,
      message: "Success",
      session_token: sessionToken,
      user: {
        id: user?.id,
        name: user?.full_name,
        email: user?.email,
        role: user?.role_id,
      },
    });
  }

  // --- Send Response Fail
  return NextResponse.json({
    status: 500,
    message: "failed",
  });
}
