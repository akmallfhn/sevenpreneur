import CheckoutPlaylistFormSVP from "@/app/components/forms/CheckoutPlaylistFormSVP";
import CheckoutHeader from "@/app/components/navigations/CheckoutHeader";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface CheckoutPlaylistPageProps {
  params: Promise<{ playlist_name: string; playlist_id: string }>;
}

export default async function CheckoutPlaylistPage({
  params,
}: CheckoutPlaylistPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const { playlist_id, playlist_name } = await params;
  const playlistId = parseInt(playlist_id);

  // --- Redirect if not login
  if (!sessionToken) {
    redirect(
      `/auth/login?redirectTo=/cohorts/${playlist_name}/${playlist_id}/checkout`
    );
  }

  // --- Get User Data
  setSessionToken(sessionToken);
  const checkUser = (await trpc.auth.checkSession()).user;

  // --- Get Playlist Data
  let playlistDataRaw;
  try {
    playlistDataRaw = (await trpc.read.playlist({ id: playlistId })).playlist;
  } catch (error) {
    return notFound();
  }
  const playlistData = {
    ...playlistDataRaw,
    price: Number(playlistDataRaw.price),
  };

  // --- Get Payment Data
  const paymentMethodRaw = (await trpc.list.paymentChannels()).list;
  const paymentMethodList = paymentMethodRaw.map((post) => ({
    ...post,
    calc_percent:
      typeof post.calc_percent === "object" && "toNumber" in post.calc_percent
        ? post.calc_percent.toNumber()
        : post.calc_percent,
    calc_flat:
      typeof post.calc_flat === "object" && "toNumber" in post.calc_flat
        ? post.calc_flat.toNumber()
        : post.calc_flat,
  }));

  // --- Auto Correction Slug
  const correctSlug = playlistData.slug_url;
  if (playlist_name !== correctSlug) {
    redirect(`/playlists/${correctSlug}/${playlistId}/checkout`);
  }

  return (
    <div className="flex w-full min-h-screen bg-section-background">
      <div className="flex flex-col max-w-md w-full mx-auto h-screen">
        <CheckoutHeader />
        <div className="flex-1 overflow-y-auto">
          <CheckoutPlaylistFormSVP
            playlistName={playlistData.name}
            playlistImage={playlistData.image_url}
            playlistPrice={playlistData.price}
            initialUserName={checkUser.full_name}
            initialUserEmail={checkUser.email}
            initialUserPhone={checkUser.phone_number}
            paymentMethodData={paymentMethodList}
          />
        </div>
      </div>
    </div>
  );
}
