"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface ChatContextProps {
  initialMessage: string;
  setInitialMessage: (msg: string) => void;
}

// Create a new context to store and share chat-related state
const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Context provider — wraps the parts of the app that need access to chat state
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [initialMessage, setInitialMessage] = useState("");

  return (
    <ChatContext.Provider value={{ initialMessage, setInitialMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to easily access chat context from any child component
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};
