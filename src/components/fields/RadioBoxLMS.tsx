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
        isSelected ? "bg-[#F2F8FF] dark:bg-[#0d1f3d] border-primary" : "bg-card-bg border-dashboard-border"
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
            isSelected ? "text-primary" : "text-foreground"
          }`}
        >
          {props.radioName}
        </p>
        {props.radioDescription && (
          <p className="input-description text-emphasis font-medium line-clamp-2">
            {props.radioDescription}
          </p>
        )}
      </div>
    </label>
  );
}
