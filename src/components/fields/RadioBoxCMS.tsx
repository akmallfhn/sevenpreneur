"use client";

interface RadioBoxCMSProps {
  radioName: string;
  radioDescription: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function RadioBoxCMS(props: RadioBoxCMSProps) {
  const isSelected = props.selectedValue === props.value;

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
        name={props.radioName}
        value={props.value}
        checked={isSelected}
        onChange={() => props.onChange(props.value)}
      />
      <div className="flex flex-col font-bodycopy text-sm">
        <p className="text-black font-bold">{props.radioName}</p>
        <p className="text-alternative font-medium">{props.radioDescription}</p>
      </div>
    </label>
  );
}
