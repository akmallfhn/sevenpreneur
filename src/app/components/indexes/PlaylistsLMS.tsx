"use client";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import PlaylistItemLMS from "../items/PlaylistItemLMS";
import HeaderNavbarLMS from "../navigations/HeaderPageLMS";
import EmptyListLMS from "../state/EmptyListLMS";

interface Playlists {
  id: number;
  name: string;
  tagline: string;
  image_url: string;
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
  return (
    <div className="root-page hidden w-full h-full gap-4 items-center justify-center pb-8 lg:flex lg:flex-col lg:pl-64">
      <HeaderNavbarLMS
        headerTitle="Learning Series"
        headerDescription="View all bootcamps you’ve purchased and enrolled in."
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        {playlists.length > 0 && (
          <div className="grid gap-4 items-center lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {playlists.map((post, index) => (
              <PlaylistItemLMS
                key={index}
                playlistId={post.id}
                playlistName={post.name}
                playlistTagline={post.tagline}
                playlistImage={post.image_url}
              />
            ))}
          </div>
        )}
        {playlists.length < 1 && (
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
