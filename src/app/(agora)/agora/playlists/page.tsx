import PlaylistsLMS from "@/app/components/indexes/PlaylistsLMS";
import { toNumber } from "@/lib/convert-number";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function PlaylistsPageLMS() {
  // Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Fetch tRPC
  const userData = (await trpc.auth.checkSession()).user;
  const enrolledPlaylistsData = (await trpc.list.enrolledPlaylists({})).list;
  const enrolledPlaylists = enrolledPlaylistsData.map((item) => ({
    ...item,
    price: toNumber(item.price),
  }));

  return (
    <PlaylistsLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      playlists={enrolledPlaylists}
    />
  );
}
