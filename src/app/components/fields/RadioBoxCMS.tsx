"use client";

interface RadioBoxCMSProps {
  radioName: string;
  radioDescription: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function RadioBoxCMS({
  radioName,
  radioDescription,
  value,
  selectedValue,
  onChange,
}: RadioBoxCMSProps) {
  const isSelected = selectedValue === value;

  return (
    <label
      className={`flex p-3 gap-4 border rounded-md ${
        isSelected
          ? "bg-[#F2F8FF] border-cms-primary"
          : "bg-white border-outline"
      } `}
    >
      <input
        type="radio"
        name={radioName}
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
      />
      <div className="flex flex-col font-bodycopy text-sm ">
        <p className="text-black font-bold">{radioName}</p>
        <p className="text-alternative font-medium">{radioDescription}</p>
      </div>
    </label>
  );
}
