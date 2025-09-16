"use client";
import { X } from "lucide-react";

interface FilterLabelCMSProps {
  filterName: string;
  removeFilter: () => void;
}

export default function FilterLabelCMS({
  filterName,
  removeFilter,
}: FilterLabelCMSProps) {
  return (
    <div className="label-container inline-flex w-fit py-0.5 px-2 rounded-sm items-center justify-center gap-1 text-xs font-semibold font-bodycopy truncate bg-[#E2F0FF] text-[#164EA6]">
      {filterName}
      <X
        className="size-4 transform transition-all hover:cursor-pointer active:scale-95"
        onClick={removeFilter}
      />
    </div>
  );
}
