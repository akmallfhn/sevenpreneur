import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SECRET_KEY_PUBLIC_API;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = GetPrismaClient();

  const now = new Date();

  const [cohorts, events, playlists] = await Promise.all([
    prisma.cohort.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        status: true,
        slug_url: true,
        start_date: true,
        end_date: true,
        tags: true,
        context: true,
        cohort_prices: {
          select: { name: true, amount: true },
          where: { status: "ACTIVE" },
        },
      },
      where: { deleted_at: null, status: "ACTIVE", end_date: { gte: now } },
      orderBy: { published_at: "desc" },
    }),

    prisma.event.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        status: true,
        slug_url: true,
        start_date: true,
        end_date: true,
        method: true,
        tags: true,
        context: true,
        event_prices: {
          select: { name: true, amount: true },
          where: { status: "ACTIVE" },
        },
      },
      where: { deleted_at: null, status: "ACTIVE", end_date: { gte: now } },
      orderBy: { published_at: "desc" },
    }),

    prisma.playlist.findMany({
      select: {
        id: true,
        name: true,
        tagline: true,
        description: true,
        image_url: true,
        status: true,
        slug_url: true,
        price: true,
        tags: true,
        context: true,
      },
      where: { deleted_at: null, status: "ACTIVE" },
      orderBy: { published_at: "desc" },
    }),
  ]);

  const list = [
    ...cohorts.map((item) => ({ ...item, category: "cohort" as const })),
    ...events.map((item) => ({ ...item, category: "event" as const })),
    ...playlists.map((item) => ({ ...item, category: "playlist" as const })),
  ];

  return NextResponse.json({ list });
}
