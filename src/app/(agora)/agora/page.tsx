import ZTemporaryPlaylistLMS from "@/app/components/pages/ZTemporaryPlaylistLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function DashboardPageLMS() {
  // Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Get Data
  setSessionToken(sessionToken!);
  let enrolledPlaylistData;
  try {
    enrolledPlaylistData = (await trpc.read.enrolledPlaylist({ id: 1 }))
      .playlist.playlist;
  } catch (error) {
    return <div className="flex pt-10 lg:pt-24"></div>;
  }

  return (
    <div>
      <div className="hidden pl-72 p-10 lg:flex flex-col gap-2">
        <h2 className=" font-bold font-brand text-xl">
          Welcome to Sevenpreneur!
        </h2>
        <p className="font-bodycopy">
          Explore your collection by choose menu at sidebar
        </p>
      </div>
      <ZTemporaryPlaylistLMS playlistVideos={enrolledPlaylistData.videos} />
    </div>
  );
}
