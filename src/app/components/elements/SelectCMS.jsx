"use client";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SelectCMS({
  selectId,
  selectName,
  selectIcon,
  value,
  onChange,
  disabled,
  required,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? "Select...";

  return (
    <div
      className="select-group-component flex flex-col gap-1"
      ref={containerRef}
    >
      {/* --- Label */}
      <label
        htmlFor={selectId}
        className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
      >
        {selectName}
        {required && <span className="text-red-700">*</span>}
      </label>

      {/* --- Select Placeholder */}
      <div
        className="select relative flex w-full p-2 pl-10 bg-white font-bodycopy font-medium text-sm rounded-lg border border-outline"
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-alternative">
          {selectIcon}
        </div>

        {/* Selected Value */}
        <span className="block truncate">{selectedLabel}</span>

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#616F86]">
          <ChevronDown className="size-5" />
        </div>

        {open && (
          <div className="absolute top-full mt-2 left-0 w-full z-30 bg-white border border-[#E3E3E3] rounded-md shadow-md">
            <ul className="flex flex-col text-sm font-bodycopy font-medium max-h-60 overflow-auto">
              {options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    onChange({ target: { value: opt.value } });
                    setOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
