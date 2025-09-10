"use client";
import FAQItemBlueprintProgramSVP from "../items/FAQItemBlueprintProgramSVP";

export default function FAQCustomerBlueprintProgramSVP() {
  return (
    <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center p-5 py-10 pb-24 gap-8 z-10 lg:px-0 lg:gap-[64px] lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title */}
        <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl lg:text-4xl">
          Everything You Need to Know
        </h2>

        {/* FAQ */}
        <div className="flex flex-col w-full">
          <FAQItemBlueprintProgramSVP questions="Test" answer="Test" />
        </div>
      </div>
    </div>
  );
}
