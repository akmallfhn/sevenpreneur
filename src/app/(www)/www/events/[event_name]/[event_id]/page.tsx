import EventDetailsSVP from "@/app/components/pages/EventDetailsSVP";
import { setSecretKey, trpc } from "@/trpc/server";
import { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

interface EventDetailsPageProps {
  params: Promise<{ event_name: string; event_id: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailsPageProps): Promise<Metadata> {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { event_id } = await params;
  const eventId = parseInt(event_id);

  // --- Get Data
  setSecretKey(secretKey!);
  const eventData = (await trpc.read.event({ id: eventId })).event;

  if (eventData.status !== "ACTIVE") {
    return {
      title: `404 Not Found`,
      description:
        "Sorry, the page you’re looking for doesn’t exist or may have been moved.",
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
    title: `${eventData.name} - Event | Sevenpreneur`,
    description: eventData.description,
    keywords:
      "Sevenpreneur, Business Blueprint, Raymond Chin, Video On Demand Bisnis, Learning Series",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/events/${eventData.slug_url}/${eventData.id}`,
    },
    openGraph: {
      title: `${eventData.name} - Event | Sevenpreneur`,
      description: eventData.description,
      url: `/events/${eventData.slug_url}/${eventData.id}`,
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
      title: `${eventData.name} - Event | Sevenpreneur`,
      description: eventData.description,
      images: eventData.image,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function EventDetailsPage({
  params,
}: EventDetailsPageProps) {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { event_id, event_name } = await params;
  const eventId = parseInt(event_id);

  // Get Data
  setSecretKey(secretKey!);
  let eventDataRaw;
  try {
    eventDataRaw = (await trpc.read.event({ id: eventId })).event;
  } catch (error) {
    return notFound();
  }

  // Return 404 if INACTIVE status
  if (eventDataRaw.status !== "ACTIVE") {
    return notFound();
  }

  // Sanitize Data from not supported format
  const eventData = {
    ...eventDataRaw,
    event_prices: eventDataRaw.event_prices.map((price) => ({
      ...price,
      amount: Number(price.amount),
    })),
  };

  // Auto Correction Slug
  const correctSlug = eventData.slug_url;
  if (event_name !== correctSlug) {
    redirect(`/events/${correctSlug}/${eventData.id}`);
  }

  return (
    <EventDetailsSVP
      eventId={eventData.id}
      eventName={eventData.name}
      eventDescription={eventData.description}
      eventImage={eventData.image}
      eventSlug={eventData.slug_url}
      eventPrice={eventData.event_prices}
    />
  );
}
