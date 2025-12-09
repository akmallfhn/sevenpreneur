import HomeLMS from "@/app/components/pages/HomeLMS";
import HomeMobileLMS from "@/app/components/pages/HomeMobileLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import React from "react";

export default async function DashboardPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  const enrolledCohortData = (await trpc.list.enrolledCohorts({})).list;
  const enrolledPlaylistsData = (await trpc.list.enrolledPlaylists({})).list;

  const enrolledCohortList = enrolledCohortData.map((variable) => ({
    ...variable,
    start_date: variable.start_date ? variable.start_date.toISOString() : "",
    end_date: variable.end_date ? variable.end_date.toISOString() : "",
  }));
  const enrolledPlaylists = enrolledPlaylistsData.map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  return (
    <React.Fragment>
      <HomeMobileLMS
        sessionUserName={userData.full_name}
        sessionUserAvatar={
          userData.avatar ||
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
        }
        cohortList={enrolledCohortList}
      />
      <HomeLMS
        sessionUserName={userData.full_name}
        sessionUserAvatar={
          userData.avatar ||
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
        }
        sessionUserRole={userData.role_id}
      />
    </React.Fragment>
  );
}
