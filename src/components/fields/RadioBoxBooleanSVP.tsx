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
          ? "bg-[#F2F8FF] border-cms-primary dark:bg-[#0C2538]"
          : "bg-white border-outline dark:bg-[#2C2C2C] dark:border-outline-dark"
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
        <p className="input-label font-bold">{radioName}</p>
        <p className="input-description text-alternative font-medium">
          {radioDescription}
        </p>
      </div>
    </label>
  );
}
