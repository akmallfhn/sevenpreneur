"use client";

export default function AppButton({
  onClick,
  ref,
  children,
  variant = "primary",
  size = "default",
  disabled = false,
}) {
  const baseClasses =
    "app-button inline-flex gap-2 font-semibold items-center justify-center truncate transition transform hover:cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    primary:
      "bg-primary text-white font-ui hover:bg-[#0759D3] active:bg-[#0759D3]",
    outline:
      "bg-white text-black border border-[#E3E3E3] font-ui active:bg-[#F5F5F5]",
    ghost: "bg-white hover:bg-[#F5F5F5] active:bg-[#F5F5F5]",
    cmsPrimary:
      "bg-cms-primary text-white font-brand hover:bg-[#032E82] active:bg-[#032E82]",
  };

  const sizeClasses = {
    default: "py-2 px-4 h-10 text-sm rounded-lg",
    small: "py-1 px-2 h-8 text-xs rounded-md",
    icon: "size-9 rounded-md",
  };

  const finalClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
  ].join(" ");

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      className={finalClasses}
    >
      {children}
    </button>
  );
}
