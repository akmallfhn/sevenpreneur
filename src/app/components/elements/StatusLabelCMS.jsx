"use client";

const variantStyles = {
  active: {
    backgroundColor: "bg-[#E3F9E2]",
    labelColor: "text-[#2F7F2C]",
    signColor: "bg-[#2F7F2C]",
  },
  inactive: {
    backgroundColor: "bg-[#FFF4F3]",
    labelColor: "text-[#DF5B4F]",
    signColor: "bg-[#DF5B4F]",
  },
};

export default function StatusLabelCMS({ labelName, variants = "active" }) {
  // --- Variant declarations
  const { backgroundColor, labelColor, signColor } = variantStyles[variants];

  // --- Change value to capital
  const capitalizeName = (text) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div
      className={`label-container inline-flex py-[2px] px-[10px] w-fit rounded-full items-center justify-center gap-1 text-xs font-medium font-bodycopy ${backgroundColor} ${labelColor}`}
      style={{ backgroundImage: backgroundColor }}
    >
      <div className={`flex size-2 rounded-full ${signColor}`} />
      {capitalizeName(labelName)}
    </div>
  );
}
