import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SECRET_KEY_PUBLIC_API;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = GetPrismaClient();
  const now = new Date();

  const discounts = await prisma.discount.findMany({
    where: {
      status: "ACTIVE",
      start_date: { lte: now },
      end_date: { gte: now },
    },
    orderBy: { created_at: "desc" },
  });

  const cohortPriceIds = new Set<number>();
  const playlistIds = new Set<number>();
  const eventPriceIds = new Set<number>();

  for (const d of discounts) {
    if (d.category === "COHORT") cohortPriceIds.add(d.item_id);
    else if (d.category === "PLAYLIST") playlistIds.add(d.item_id);
    else if (d.category === "EVENT") eventPriceIds.add(d.item_id);
  }

  const [cohortPrices, playlists, eventPrices] = await Promise.all([
    cohortPriceIds.size
      ? prisma.cohortPrice.findMany({
          where: { id: { in: [...cohortPriceIds] } },
          select: {
            id: true,
            name: true,
            amount: true,
            cohort: {
              select: {
                id: true,
                name: true,
                slug_url: true,
                image: true,
              },
            },
          },
        })
      : Promise.resolve([]),
    playlistIds.size
      ? prisma.playlist.findMany({
          where: { id: { in: [...playlistIds] } },
          select: {
            id: true,
            name: true,
            slug_url: true,
            image_url: true,
            price: true,
          },
        })
      : Promise.resolve([]),
    eventPriceIds.size
      ? prisma.eventPrice.findMany({
          where: { id: { in: [...eventPriceIds] } },
          select: {
            id: true,
            name: true,
            amount: true,
            event: {
              select: {
                id: true,
                name: true,
                slug_url: true,
                image: true,
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const cohortPriceMap = new Map(cohortPrices.map((p) => [p.id, p]));
  const playlistMap = new Map(playlists.map((p) => [p.id, p]));
  const eventPriceMap = new Map(eventPrices.map((p) => [p.id, p]));

  const list = discounts.map((d) => {
    const base = {
      id: d.id,
      name: d.name,
      description: d.description,
      code: d.code,
      calc_percent: d.calc_percent,
      start_date: d.start_date,
      end_date: d.end_date,
      category: d.category,
    };

    if (d.category === "COHORT") {
      const price = cohortPriceMap.get(d.item_id);
      return {
        ...base,
        product: price
          ? {
              type: "cohort" as const,
              cohort_id: price.cohort.id,
              cohort_name: price.cohort.name,
              price_id: price.id,
              price_name: price.name,
              price_amount: price.amount,
            }
          : null,
      };
    }

    if (d.category === "PLAYLIST") {
      const playlist = playlistMap.get(d.item_id);
      return {
        ...base,
        product: playlist
          ? {
              type: "playlist" as const,
              playlist_id: playlist.id,
              playlist_name: playlist.name,
              playlist_slug_url: playlist.slug_url,
              price_amount: playlist.price,
            }
          : null,
      };
    }

    if (d.category === "EVENT") {
      const price = eventPriceMap.get(d.item_id);
      return {
        ...base,
        product: price
          ? {
              type: "event" as const,
              event_id: price.event.id,
              event_name: price.event.name,
              price_id: price.id,
              price_name: price.name,
              price_amount: price.amount,
            }
          : null,
      };
    }

    return { ...base, product: null };
  });

  return NextResponse.json({ list });
}
