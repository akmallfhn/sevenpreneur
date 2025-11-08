import { VideoItem } from "@/app/components/indexes/VideoCoursePlaylistSVP";
import HomeLMS from "@/app/components/pages/HomeLMS";
import ZTemporaryPlaylistLMS from "@/app/components/pages/ZTemporaryPlaylistLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function DashboardPageLMS() {
  // Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Get Data
  setSessionToken(sessionToken!);

  const userData = (await trpc.auth.checkSession()).user;

  let enrolledPlaylistData: VideoItem[] = [];
  try {
    enrolledPlaylistData = (await trpc.read.enrolledPlaylist({ id: 1 }))
      .playlist.playlist.videos;
  } catch (error) {
    enrolledPlaylistData = [];
  }

  return (
    <>
      <HomeLMS
        sessionUserName={userData.full_name}
        sessionUserAvatar={
          userData.avatar ||
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
        }
        sessionUserRole={userData.role_id}
      />
      <ZTemporaryPlaylistLMS playlistVideos={enrolledPlaylistData} />
    </>
  );
}
