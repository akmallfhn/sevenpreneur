import ZTemporaryPlaylistLMS from "@/app/components/pages/ZTemporaryPlaylistLMS";
import EmptyPlaylistsLMS from "@/app/components/state/EmptyPlaylistsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function AgoraHomePage() {
  // --- Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // --- Get Data
  setSessionToken(sessionToken!);
  let enrolledPlaylistData;
  try {
    enrolledPlaylistData = (await trpc.read.enrolledPlaylist({ id: 1 }))
      .playlist.playlist;
  } catch (error) {
    return (
      <div className="flex pt-10 lg:pt-24">
        <EmptyPlaylistsLMS />
      </div>
    );
  }

  return <ZTemporaryPlaylistLMS playlistVideos={enrolledPlaylistData.videos} />;
}
