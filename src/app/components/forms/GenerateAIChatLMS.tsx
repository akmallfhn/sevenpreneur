"use client";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import ChatSubmitterLMS from "../messages/ChatSubmitterLMS";
import { CreateAIConversation, SendAIChat } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/app/contexts/chat-context";

interface GenerateAIChatLMSProps {
  sessionUserName: string;
}

export default function GenerateAIChatLMS({
  sessionUserName,
}: GenerateAIChatLMSProps) {
  const router = useRouter();
  const { setInitialMessage } = useChatContext();
  const [textValue, setTextValue] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);

  const nickName = sessionUserName.split(" ")[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const message = textValue;
    setTextValue("");
    setInitialMessage(message);
    setGeneratingAI(true);

    router.push("/ai/grow/temp");

    try {
      const createConversation = await CreateAIConversation();
      if (createConversation.code === "CREATED") {
        router.replace(`/ai/chat/${createConversation.conversation.id}`);
      } else {
        toast.error("Couldn't create the chat room. Please try again.");
      }
    } catch (error) {
      toast.error("Unable to create conversation. Let's try once more!");
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="root-page hidden flex-col pl-64 w-full min-h-screen items-center justify-center lg:flex">
      <div className="generate-ai-chat flex flex-col items-center w-full max-w-[768px] gap-6">
        <h1 className="greetings-chat font-bodycopy font-semibold text-3xl">
          What’s your next move, {nickName}?
        </h1>
        <form
          className="form-generate-chat flex flex-col w-full"
          onSubmit={handleSubmit}
        >
          <ChatSubmitterLMS
            value={textValue}
            onTextAreaChange={(value) => setTextValue(value)}
            onSubmit={handleSubmit}
            isLoadingSubmit={generatingAI}
          />
        </form>
      </div>
    </div>
  );
}
