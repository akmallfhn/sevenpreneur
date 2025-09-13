"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface FAQItemBlueprintProgramSVPProps {
  questions: string;
  answer: string;
}

export default function FAQItemBlueprintProgramSVP({
  questions,
  answer,
}: FAQItemBlueprintProgramSVPProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="faq-item-outline p-[1px] bg-gradient-to-r from-0% from-[#575757]/60 to-100% to-[#3C3C3C] rounded-md hover:cursor-pointer">
      <div
        className="faq-item-container bg-gradient-to-br from-0% from-[#19181C] to-100% to-[#2D2D2E] flex flex-col w-full p-3 rounded-md transform transition duration-500"
        onClick={handleOpen}
      >
        {/* Question */}
        <div className="question flex text-white justify-between items-center">
          <p className="font-medium font-bodycopy text-base lg:text-lg">
            {questions}
          </p>
          <div className="flex aspect-square size-6 items-center justify-center">
            {isOpen ? (
              <Minus className="transition-transform size-5" />
            ) : (
              <Plus className="transition-transform size-5" />
            )}
          </div>
        </div>

        {/* Answer */}
        <div
          className={`answer overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-white/70 text-sm font-bodycopy lg:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
