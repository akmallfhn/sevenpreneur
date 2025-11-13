import { ChatProvider } from "@/app/contexts/chat-context";
import { ReactNode } from "react";

interface AgoraAILayoutProps {
  children: ReactNode;
}

export default function AgoraAILayout({ children }: AgoraAILayoutProps) {
  return <ChatProvider>{children}</ChatProvider>;
}
