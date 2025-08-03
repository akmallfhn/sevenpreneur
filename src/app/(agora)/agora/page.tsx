import VideoCoursePlaylistLMS from "@/app/components/indexes/VideoCoursePlaylistLMS";
import EmptyTransactions from "@/app/components/state/EmptyTransactions";
import SectionTitleSVP from "@/app/components/titles/SectionTitleSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function AgoraHomePage() {
  // --- Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // --- Get Data
  setSessionToken(sessionToken!);
  const enrolledPlaylistData = (await trpc.read.enrolledPlaylist({ id: 1 }))
    .playlist.playlist;

  console.log("data:", enrolledPlaylistData);
  if (!enrolledPlaylistData) {
    return <EmptyTransactions />;
  }

  return (
    <div className="flex flex-col gap-5 px-5 py-5 lg:px-0 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
      <SectionTitleSVP sectionTitle="Purchased Video" />
      <VideoCoursePlaylistLMS playlistVideos={enrolledPlaylistData.videos} />
    </div>
  );
}
