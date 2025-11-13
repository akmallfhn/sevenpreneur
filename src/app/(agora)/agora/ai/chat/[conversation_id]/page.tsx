import ChatConversationLMS from "@/app/components/messages/ChatConversationLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface AIChatConversationLMSProps {
  params: Promise<{ conversation_id: string }>;
}

export default async function AIChatConversationLMS({
  params,
}: AIChatConversationLMSProps) {
  const { conversation_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  if (conversation_id === "temp") {
    return (
      <ChatConversationLMS
        conversationId={conversation_id}
        conversationName="Agora AI"
        conversationChats={[]}
      />
    );
  }

  let chatRaw;
  try {
    chatRaw = await trpc.list.aiChats({
      conv_id: conversation_id,
      size: 10,
    });
  } catch (error) {
    return notFound();
  }

  const chatList = chatRaw.list.map((item) => ({
    ...item,
    created_at: item.created_at.toISOString(),
  }));

  return (
    <ChatConversationLMS
      conversationId={conversation_id}
      conversationName={"Agora AI"}
      conversationChats={chatList}
    />
  );
}
