"use client";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import ChatSubmitterLMS from "../messages/ChatSubmitterLMS";

interface GenerateAIChatLMSProps {
  sessionUserName: string;
}

export default function GenerateAIChatLMS({
  sessionUserName,
}: GenerateAIChatLMSProps) {
  const [textValue, setTextValue] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setGeneratingAI(true);

    try {
      toast.success(textValue);
    } catch (error) {
      toast.error("Failed");
    } finally {
      setGeneratingAI(false);
    }
  };

  const nickName = sessionUserName.split(" ")[0];

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
