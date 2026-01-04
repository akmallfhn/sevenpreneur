import CheckoutEventFormSVP from "@/app/components/forms/CheckoutEventFormSVP";
import UnavailableProductSVP from "@/app/components/states/UnavailableProductSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import dayjs from "dayjs";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface CheckoutEventPageProps {
  params: Promise<{ event_name: string; event_id: string }>;
}

export async function generateMetadata({
  params,
}: CheckoutEventPageProps): Promise<Metadata> {
  const { event_id } = await params;
  const eventId = parseInt(event_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  setSessionToken(sessionToken!);

  const eventData = (await trpc.read.event({ id: eventId })).event;

  const hasActiveTicket = eventData.event_prices.some(
    (post) => post.status === "ACTIVE"
  );
  const expiredEvent = dayjs().isAfter(eventData.end_date);

  // Unavailable Product
  if (!hasActiveTicket || expiredEvent) {
    return {
      title: "Tickets Are Sold Out",
      description:
        "All tickets for this event have been sold. Please check back for future events.",
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

  return {
    title: `Checkout ${eventData.name} - Event | Sevenpreneur`,
    description:
      "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/events/${eventData.slug_url}/${eventData.id}/checkout`,
    },
    openGraph: {
      title: `Checkout ${eventData.name} - Event | Sevenpreneur`,
      description:
        "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
      url: `/events/${eventData.slug_url}/${eventData.id}/checkout`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: eventData.image,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Checkout ${eventData.name} - Event | Sevenpreneur`,
      description:
        "Lengkapi proses pembelian dengan aman dan cepat di halaman checkout kami. Dapatkan ringkasan pesanan dan pilih metode pembayaran terbaik.",
      images: eventData.image,
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

export default async function CheckoutEventPage({
  params,
}: CheckoutEventPageProps) {
  const { event_id, event_name } = await params;
  const eventId = parseInt(event_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Redirect if not login
  if (!sessionToken) {
    redirect(
      `/auth/login?redirectTo=/events/${event_name}/${event_id}/checkout`
    );
  }
  setSessionToken(sessionToken);

  const checkUser = (await trpc.auth.checkSession()).user;
  let eventData;
  try {
    eventData = (await trpc.read.event({ id: eventId })).event;
  } catch {
    return notFound();
  }
  const ticketListRaw = eventData.event_prices;
  const ticketList = ticketListRaw.map((item) => ({
    ...item,
    amount:
      typeof item.amount === "object" && "toNumber" in item.amount
        ? item.amount.toNumber()
        : item.amount,
  }));
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

  const hasActiveTicket = eventData.event_prices.some(
    (post) => post.status === "ACTIVE"
  );
  const expiredEvent = dayjs().isAfter(eventData.end_date);

  // Unavailable Product
  if (!hasActiveTicket || expiredEvent) {
    return (
      <UnavailableProductSVP
        stateTitle="Tickets Are Sold Out"
        stateDesc="All tickets for this event have been sold. Please check back for future events."
      />
    );
  }

  // Auto Correction Slug
  const correctSlug = eventData.slug_url;
  if (event_name !== correctSlug) {
    redirect(`/events/${correctSlug}/${eventId}/checkout`);
  }

  return (
    <div className="flex w-full min-h-screen bg-section-background">
      <div className="flex flex-col max-w-md w-full mx-auto h-screen">
        <div className="flex-1 overflow-y-auto">
          <CheckoutEventFormSVP
            eventId={eventData.id}
            eventName={eventData.name}
            eventImage={eventData.image}
            initialUserId={checkUser.id}
            initialUserName={checkUser.full_name}
            initialUserEmail={checkUser.email}
            initialUserPhone={checkUser.phone_number}
            ticketListData={ticketList}
            paymentMethodData={paymentMethodList}
          />
        </div>
      </div>
    </div>
  );
}
