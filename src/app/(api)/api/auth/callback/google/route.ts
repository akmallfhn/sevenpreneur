import { trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  // --- Receive access token from Google
  const body = await request.json();
  const accessToken = body.tokenResponse.access_token;

  // --- Return user info
  // const userInfoResponse = await fetch(
  //   "https://www.googleapis.com/oauth2/v3/userinfo",
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   }
  // );

  // if (!userInfoResponse.ok) {
  //   throw new Error("Failed to fetch user info");
  // }

  // const userInfo = await userInfoResponse.json();

  // --- TRPC
  const loggedIn = await trpc.auth.login({ credential: accessToken });
  const token = loggedIn.token.token;

  console.log("token:", token);

  // --- Save session token to cookie
  if (token) {
    const cookieStore = await cookies();
    cookieStore.set("session_token", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 21600,
    });

    // --- Send Response Success
    return NextResponse.json({
      status: 200,
      message: "success",
      user_info: token,
    });
  }

  // --- Send Response Fail
  return NextResponse.json({
    status: 500,
    message: "failed",
    user_info: token,
  });
}
