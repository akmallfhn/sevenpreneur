import PlaylistDetailsLMS from "@/app/components/pages/PlaylistDetailsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface PlaylistDetailsPageLMSProps {
  params: Promise<{ playlist_id: string }>;
}

export default async function PlaylistDetailsPageLMS({
  params,
}: PlaylistDetailsPageLMSProps) {
  // Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const { playlist_id } = await params;
  const playlistId = Number(playlist_id);

  // Get Data
  setSessionToken(sessionToken!);
  let enrolledPlaylistData;
  try {
    enrolledPlaylistData = (
      await trpc.read.enrolledPlaylist({ id: playlistId })
    ).playlist.playlist;
  } catch (error) {
    return <div className="flex pt-10 lg:pt-24"></div>;
  }

  return <PlaylistDetailsLMS playlistVideos={enrolledPlaylistData.videos} />;
}
