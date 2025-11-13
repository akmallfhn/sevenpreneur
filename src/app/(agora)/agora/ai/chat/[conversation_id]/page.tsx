import ChatConversationLMS from "@/app/components/messages/ChatConversationLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

interface AIChatConversationLMSProps {
  params: Promise<{ conversation_id: string }>;
}

export default async function AIChatConversationLMS({
  params,
}: AIChatConversationLMSProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const { conversation_id } = await params;
  const userData = (await trpc.auth.checkSession()).user;

  const chatsRaw = (
    await trpc.list.aiChats({ conv_id: conversation_id, size: 10 })
  ).list;

  const chats = chatsRaw.map((item) => ({
    ...item,
    created_at: item.created_at.toISOString(),
  }));

  return (
    <ChatConversationLMS
      conversationId={conversation_id}
      conversationChats={chats}
    />
  );
}
