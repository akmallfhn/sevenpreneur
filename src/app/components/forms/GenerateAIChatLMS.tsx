"use client";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import ChatSubmitterLMS from "../messages/ChatSubmitterLMS";
import { SendAIChat } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface GenerateAIChatLMSProps {
  sessionUserName: string;
}

export default function GenerateAIChatLMS({
  sessionUserName,
}: GenerateAIChatLMSProps) {
  const router = useRouter();
  const [textValue, setTextValue] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);

  const nickName = sessionUserName.split(" ")[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const message = textValue;
    setTextValue("");
    setGeneratingAI(true);

    router.push("/ai/chat/temp");

    try {
      const createConversation = await SendAIChat({
        conversationId: undefined,
        message: message,
      });
      if (createConversation.code === "OK") {
        router.replace(`/ai/chat/${createConversation.conv_id}`);
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
      <div className="generate-ai-chat flex flex-col items-center justify-center w-full max-w-[768px] gap-10">
        <div className="ai-persona flex flex-col w-full max-w-[450px] items-center text-center gap-2 font-bodycopy">
          <div className="ai-image size-16 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square.svg"
              alt="Sevenpreneur Logo"
              width={600}
              height={600}
            />
          </div>
          <h2 className="ai-name font-bodycopy font-semibold text-2xl">
            Agora AI
          </h2>
          <p className="ai-author text-[#6e6e6e] text-[15px] font-[450]">
            by Sevenpreneur
          </p>
          <p className="ai-description text-[#6e6e6e] text-[15px] font-[450]">
            Business mentor using Sevenpreneur Framework, built to solve
            real-world entrepreneurship gaps
          </p>
        </div>
        <div className="ai-chat flex flex-col w-full items-center justify-center text-center gap-4">
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
    </div>
  );
}
