"use client";
import React, { useState, useEffect } from "react";

export default function TextAreaCMS({
  textAreaId,
  textAreaName,
  textAreaHeight,
  textAreaPlaceholder,
  characterLength,
  errorMessage,
  onInputChange,
  value: propValue,
  disabled,
  required,
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
        htmlFor={textAreaId}
        className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
      >
        {textAreaName}
        {required && <span className="text-red-700">*</span>}
      </label>

      {/* --- Input Placeholder */}
      <div className="input-container relative">
        <textarea
          id={textAreaId}
          placeholder={textAreaPlaceholder}
          disabled={disabled}
          className={`flex w-full p-2 ${textAreaHeight} bg-white font-medium font-bodycopy text-sm rounded-lg resize-none placeholder:text-alternative placeholder:font-medium placeholder:text-sm ${
            error ? "border-red-700 border" : "border border-outline"
          } `}
          value={value}
          onChange={handleInputChange}
        />
        {error && <p className="inline-flex text-red-600 text-xs">{error}</p>}
      </div>
    </div>
  );
}
