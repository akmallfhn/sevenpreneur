"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import PlaylistItemLMS from "../items/PlaylistItemLMS";
import EmptyListLMS from "../states/EmptyListLMS";
import HeaderListLMS from "../navigations/HeaderListLMS";
import { useEffect, useState } from "react";
import DisallowedMobile from "../states/DisallowedMobile";

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
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const activePlaylists = playlists.filter(
    (playlist) => playlist.status === "ACTIVE"
  );

  // Dynamic mobile rendering
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  // Render Mobile
  if (isMobile) {
    return <DisallowedMobile />;
  }

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full h-full items-center justify-center lg:flex">
      <HeaderListLMS
        headerTitle="Learning Series"
        headerDescription="Watch all learning series you’ve purchased"
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
