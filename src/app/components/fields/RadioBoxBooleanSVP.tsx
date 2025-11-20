"use client";

interface RadioBoxBooleanSVPProps {
  radioName: string;
  radioDescription: string;
  value: boolean;
  selectedValue: boolean | null;
  onChange: (value: boolean) => void;
}

export default function RadioBoxBooleanSVP({
  radioName,
  radioDescription,
  value,
  selectedValue,
  onChange,
}: RadioBoxBooleanSVPProps) {
  const isSelected = selectedValue === value;

  return (
    <label
      className={`input-container flex p-3 gap-4 border rounded-md hover:cursor-pointer ${
        isSelected
          ? "bg-[#F2F8FF] border-cms-primary"
          : "bg-white border-outline"
      } `}
    >
      <input
        type="radio"
        className="input-placeholder"
        name={radioName}
        value={String(value)}
        checked={isSelected}
        onChange={() => onChange(value)}
      />
      <div className="input-attributes flex flex-col font-bodycopy text-sm ">
        <p className="input-label text-black font-bold">{radioName}</p>
        <p className="input-description text-alternative font-medium">
          {radioDescription}
        </p>
      </div>
    </label>
  );
}
