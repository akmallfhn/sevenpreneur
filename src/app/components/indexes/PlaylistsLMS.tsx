"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import PlaylistItemLMS from "../items/PlaylistItemLMS";
import HeaderNavbarLMS from "../navigations/HeaderPageLMS";
import EmptyListLMS from "../state/EmptyListLMS";

interface Playlists {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
  status: StatusType;
}

interface PlaylistsLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  playlists: Playlists[];
}

export default function PlaylistsLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  playlists,
}: PlaylistsLMSProps) {
  const activePlaylists = playlists.filter(
    (playlist) => playlist.status === "ACTIVE"
  );

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full h-full gap-4 items-center justify-center lg:flex">
      <HeaderNavbarLMS
        headerTitle="Learning Series"
        headerDescription="View all bootcamps you’ve purchased and enrolled in."
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        {activePlaylists.length > 0 ? (
          <div className="grid gap-4 items-center  lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
            {activePlaylists.map((post, index) => (
              <PlaylistItemLMS
                key={index}
                playlistId={post.id}
                playlistName={post.name}
                playlistTagline={post.tagline}
                playlistImage={post.image_url}
              />
            ))}
          </div>
        ) : (
          <EmptyListLMS
            stateTitle="No Series Purchased Yet"
            stateDescription="Looks like you haven’t bought any learning series. Explore our collections
          and start learning something new today!"
            stateAction="Explore Series"
          />
        )}
      </div>
    </div>
  );
}
