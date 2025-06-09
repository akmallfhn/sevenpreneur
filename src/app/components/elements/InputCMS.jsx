"use client";
import React, { useState, useEffect } from "react";

export default function InputCMS({
  inputId,
  inputName,
  inputType,
  inputIcon,
  inputPlaceholder,
  characterLength,
  errorMessage,
  onInputChange,
  value: propValue,
  disabled = false,
}) {
  // --- Declaration state
  const [value, setValue] = useState(propValue);
  const [error, setError] = useState("");
  const maxLength = characterLength;

  // --- Character Limitation on Input
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    if (newValue.length > maxLength) {
      setError(errorMessage);
      setValue(newValue.slice(0, maxLength));
      if (onInputChange) onInputChange(newValue.slice(0, maxLength));
      return;
    } else {
      setError("");
      setValue(newValue);
      if (onInputChange) onInputChange(newValue);
    }
  };

  // --- Sync on value change
  useEffect(() => {
    setValue(propValue || "");
  }, [propValue]);

  return (
    <div className="input-group-component flex flex-col gap-1">
      {/* --- Label */}
      <label
        htmlFor={inputId}
        className="flex pl-1 text-sm font-bodycopy font-semibold"
      >
        {inputName}
      </label>

      {/* --- Input Placeholder */}
      <div className="input-container relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-alternative">
          {inputIcon}
        </div>
        <input
          id={inputId}
          type={inputType}
          placeholder={inputPlaceholder}
          disabled={disabled}
          className={`flex w-full p-2 pl-10 bg-white font-bodycopy text-sm rounded-lg border border-[#E3E3E3] placeholder:text-[#616F86] placeholder:font-medium placeholder:text-sm ${
            error ? "border-red-700 border" : "border border-[#CBD5E1]"
          } `}
          value={value}
          onChange={handleInputChange}
        />
        {error && <p className="text-red-600 text-xs pt-2">{error}</p>}
      </div>
    </div>
  );
}
