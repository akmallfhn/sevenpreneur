import HeaderNavbarSVP from "@/app/components/navigations/HeaderNavbarSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import React from "react";

interface TransLayoutProps {
  children: React.ReactNode;
}

export default async function TransLayout({ children }: TransLayoutProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // --- Check User Session
  let userData:
    | Awaited<ReturnType<typeof trpc.auth.checkSession>>["user"]
    | null = null;
  if (sessionToken) {
    setSessionToken(sessionToken);
    const checkUser = await trpc.auth.checkSession();
    userData = checkUser.user;
  }

  return (
    <div>
      <HeaderNavbarSVP
        userAvatar={userData?.avatar ?? null}
        userRole={userData?.role_id}
        isLoggedIn={!!userData}
      />
      {children}
    </div>
  );
}
