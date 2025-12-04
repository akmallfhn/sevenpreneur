"use client";

interface RadioBoxLMSProps {
  radioName: string;
  radioDescription?: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function RadioBoxLMS(props: RadioBoxLMSProps) {
  const isSelected = props.selectedValue === props.value;

  return (
    <label
      className={`input-container flex p-3 gap-4 border rounded-md ${
        isSelected ? "bg-[#F2F8FF] border-primary" : "bg-white border-outline"
      } `}
    >
      <input
        type="radio"
        className="input-placeholder"
        name={props.radioName}
        value={props.value}
        checked={isSelected}
        onChange={() => props.onChange(props.value)}
      />
      <div className="input-attributes flex-col font-bodycopy text-sm">
        <p
          className={`input-label font-bold ${
            isSelected ? "text-primary" : "text-black"
          }`}
        >
          {props.radioName}
        </p>
        {props.radioDescription && (
          <p className="input-description text-[#333333]/70 font-medium line-clamp-2">
            {props.radioDescription}
          </p>
        )}
      </div>
    </label>
  );
}
