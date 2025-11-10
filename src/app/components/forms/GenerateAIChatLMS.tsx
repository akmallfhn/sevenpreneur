"use client";
import { useState } from "react";
import AppChatSubmitter from "../messages/AppChatSubmitter";

export default function GenerateAIChatLMS() {
  const [input, setInput] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleChange = (value: string) => {
    setInput(value);
  };

  const handleSubmit = () => {
    console.log("value", input);
  };

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
      <form className="w-full">
        <AppChatSubmitter
          value={input}
          onTextAreaChange={handleChange}
          onSubmit={handleSubmit}
          isLoadingSubmit={generatingAI}
        />
      </form>
    </div>
  );
}
