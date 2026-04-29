"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ChatSubmitterLMS from "../messages/ChatSubmitterLMS";
import BottomNavLMS from "../navigations/BottomNavLMS";
import PageContainerDashboard from "../pages/PageContainerDashboard";

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

    if (!textValue.trim()) return;

    sessionStorage.setItem("initialMessage", textValue);
    setTextValue("");
    setGeneratingAI(true);

    router.push("/ai/chat/temp");
  };

  const chatContent = (
    <>
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
          Sevenpreneur Virtual Coach
        </h2>
        <p className="ai-description text-emphasis text-[15px] font-[450]">
          Business mentor using Sevenpreneur Framework, built to solve
          real-world entrepreneurship gaps
        </p>
      </div>
      <div className="ai-chat flex flex-col w-full items-center justify-center text-center gap-4">
        <h1 className="greetings-chat font-bodycopy font-semibold text-3xl">
          What&apos;s your next move, {nickName}?
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
    </>
  );

  return (
    <>
      {/* Desktop */}
      <PageContainerDashboard className="min-h-screen items-center justify-center">
        <div className="generate-ai-chat flex flex-col items-center justify-center w-full max-w-[768px] gap-10">
          {chatContent}
        </div>
      </PageContainerDashboard>

      {/* Mobile */}
      <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden items-center justify-center px-5">
        <div className="generate-ai-chat flex flex-col items-center justify-center w-full gap-10">
          {chatContent}
        </div>
        <BottomNavLMS />
      </div>
    </>
  );
}
