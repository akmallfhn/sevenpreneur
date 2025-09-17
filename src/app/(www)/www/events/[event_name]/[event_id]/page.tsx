import { setSecretKey, trpc } from "@/trpc/server";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

interface EventDetailsPageProps {
  params: Promise<{ event_name: string; event_id: string }>;
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
    <div>
      <h1>{eventData.name}</h1>
      <p>{eventData.description}</p>
      <Image
        src={eventData.image}
        alt={eventData.name}
        width={400}
        height={400}
      />
      {eventData.event_prices.map((post, index) => (
        <div key={index}>
          <p>{post.name}</p>
          <p>{post.amount}</p>
        </div>
      ))}
    </div>
  );
}
