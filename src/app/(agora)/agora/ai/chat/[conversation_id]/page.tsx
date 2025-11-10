import ChatConversationLMS from "@/app/components/messages/ChatConversationsLMS";
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

  const conversations = [
    {
      role: "user",
      message: "Hi, can you summarize this report for me?",
    },
    {
      role: "system",
      message:
        "Sure! Here's a quick summary:\n\n---\n\n### 📄 **Report Summary**\n**Topic:** Quarterly Sales Performance (Q3 2025)\n\n**Highlights:**\n- Revenue increased by **18%** compared to last quarter.\n- Top-performing region: **Southeast Asia**.\n- Product line **X-Series** contributed **45%** of total sales.\n\n**Next Steps:**\n1. Expand X-Series distribution.\n2. Optimize marketing spend in underperforming regions.\n3. Prepare Q4 forecast by **Nov 15**.\n\n---\n\nWould you like me to visualize this as a chart?",
    },
    {
      role: "user",
      message: "Yes, show me a pie chart for the regional performance.",
    },
    {
      role: "system",
      message:
        'Got it! Here\'s the breakdown:\n\n```mermaid\npie title Regional Sales Performance (Q3 2025)\n  "Southeast Asia" : 40\n  "Europe" : 25\n  "North America" : 20\n  "Others" : 15\n```\n\n💡 *Tip:* You can click “View chart” to render this pie visually.',
    },
    {
      role: "user",
      message:
        "Nice. Can you also give me action points for next quarter? or something else that I can learn for the future of tech",
    },
    {
      role: "system",
      message:
        "Of course! Here’s what I recommend:\n\n✅ **Action Plan for Q4 2025:**\n- **Launch** X-Series Lite in 3 new regions.\n- **Invest** 10% more in digital marketing.\n- **Monitor** conversion funnel weekly.\n\n> _Keep tracking sales KPIs through the new dashboard for faster decision-making._",
    },
  ];

  return <ChatConversationLMS conversationList={conversations} />;
}
