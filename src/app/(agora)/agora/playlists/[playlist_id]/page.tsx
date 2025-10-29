import PlaylistDetailsLMS from "@/app/components/pages/PlaylistDetailsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface PlaylistDetailsPageLMSProps {
  params: Promise<{ playlist_id: string }>;
}

export default async function PlaylistDetailsPageLMS({
  params,
}: PlaylistDetailsPageLMSProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const { playlist_id } = await params;
  const playlistId = parseInt(playlist_id, 10);

  const userData = (await trpc.auth.checkSession()).user;

  let enrolledPlaylistData;
  try {
    enrolledPlaylistData = (
      await trpc.read.enrolledPlaylist({ id: playlistId })
    ).playlist.playlist;
  } catch (error) {
    return notFound();
  }

  return (
    <PlaylistDetailsLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      playlistId={enrolledPlaylistData.id}
      playlistName={enrolledPlaylistData.name}
      playlistVideos={enrolledPlaylistData.videos}
    />
  );
}
