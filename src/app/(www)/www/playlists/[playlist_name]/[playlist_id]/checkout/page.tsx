import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import CheckoutPlaylistFormSVP from "@/app/components/forms/CheckoutPlaylistFormSVP";
import CheckoutHeader from "@/app/components/navigations/CheckoutHeader";
import { setSessionToken, trpc } from "@/trpc/server";

interface CheckoutPlaylistPageProps {
  params: Promise<{ playlist_name: string; playlist_id: string }>;
}

export async function generateMetadata({
  params,
}: CheckoutPlaylistPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  const { playlist_id } = await params;
  const playlistId = parseInt(playlist_id);

  // --- Get Data
  setSessionToken(sessionToken!);
  const playlistData = (await trpc.read.playlist({ id: playlistId })).playlist;

  return {
    title: `Checkout ${playlistData.name} - Video Course | Sevenpreneur`,
    description:
      "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/playlists/${playlistData.slug_url}/${playlistData.id}/checkout`,
    },
    openGraph: {

      title: `Checkout ${playlistData.name} - Video Course | Sevenpreneur`,

      description:
        "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
      url: `/playlists/${playlistData.slug_url}/${playlistData.id}/checkout`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: playlistData.image_url,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",

      title: `Checkout ${playlistData.name} - Video Course | Sevenpreneur`,
      description:
        "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
      images: playlistData.image_url,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
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

  // --- Get Data
  setSessionToken(sessionToken);
  const checkUser = (await trpc.auth.checkSession()).user;
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
