"use client";

import { Lightbulb } from "lucide-react";

export default function AppCalloutBox() {
  return (
    <div className="callout-box-container flex p-4 border border-primary-light bg-[#F5F9FF] rounded-lg font-bodycopy font-medium text-[15px] text-[#333333]">
      <div className="callout flex flex-col gap-2">
        <div className="callout-attributes flex items-center gap-1 text-primary">
          <Lightbulb className="size-5" />
          <h4 className="callout-name font-bold text-base">Tips</h4>
        </div>
        <p>
          Gunakan AI Market Size untuk memahami potensi pasar lewat analisis
          TAM, SAM, dan SOM. Fitur ini membantu mengukur peluang bisnis, bukan
          menilai daya beli konsumen.
        </p>
      </div>
    </div>
  );
}
