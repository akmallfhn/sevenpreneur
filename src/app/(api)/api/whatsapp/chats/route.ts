import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PAGE_SIZE = 30;

const GetWAChatsSchema = z.strictObject({
  conv_id: z.string(),
  before: z.string().optional(),
});

export type GetWAChatsBody = z.infer<typeof GetWAChatsSchema>;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SECRET_KEY_PUBLIC_API;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = GetWAChatsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const { conv_id, before } = parsed.data;

  const prisma = GetPrismaClient();

  const conversation = await prisma.wAConversation.findFirst({
    select: { id: true },
    where: { id: conv_id },
  });
  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  let cursorTime: Date | undefined = undefined;
  if (before) {
    const cursorChat = await prisma.wAChat.findFirst({
      select: { created_at: true },
      where: { id: before },
    });
    if (cursorChat) cursorTime = cursorChat.created_at;
  }

  // Fetch PAGE_SIZE + 1 to detect if older messages exist
  const chats = await prisma.wAChat.findMany({
    where: {
      conv_id,
      ...(cursorTime ? { created_at: { lt: cursorTime } } : {}),
    },
    orderBy: { created_at: "desc" },
    take: PAGE_SIZE + 1,
  });

  const has_more = chats.length > PAGE_SIZE;
  const pageChats = has_more ? chats.slice(0, PAGE_SIZE) : chats;

  // Return in chronological order (oldest → newest) for LangGraph context
  const list = [...pageChats].reverse();

  // Pass next_cursor as `before` in subsequent requests to load older messages
  const next_cursor = has_more ? pageChats[pageChats.length - 1].id : null;

  return NextResponse.json({ list, has_more, next_cursor });
}
