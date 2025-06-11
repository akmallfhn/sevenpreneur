import { trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const GoogleOAuthCallbackReceiver = async (req: NextRequest) => {
  try {
    const payload = await req.formData();
    const credential = payload.get("credential")?.toString() || "";

    const loggedIn = await trpc.auth.login({ credential });
    const token = loggedIn.token.token;

    // TODO: Set cookie and redirect
    return NextResponse.json(
      { message: "Success", token: token },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error processing request", error: error.message },
      { status: 500 }
    );
  }
};

export {
  GoogleOAuthCallbackReceiver as GET,
  GoogleOAuthCallbackReceiver as POST,
};
