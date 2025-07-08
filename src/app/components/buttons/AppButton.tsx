"use client";

import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from "react";

type VariantType =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "semiDestructive"
  | "cmsPrimary"
  | "cmsPrimaryLight"
  | "cmsLink";
type SizeType =
  | "default"
  | "medium"
  | "large"
  | "small"
  | "icon"
  | "largeRounded"
  | "defaultRounded";
type FontType = "brand" | "bodycopy" | "ui";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: VariantType;
  size?: SizeType;
  font?: FontType;
  featureName?: string;
  featurePosition?: number;
}

// --- Use forwardRef for pass ref component. forwardRef cant directly use with 'export default function'
const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      onClick,
      children,
      variant = "primary",
      size = "default",
      font = "bodycopy",
      disabled = false,
      className,
      featureName,
      featurePosition,
      ...rest // -- ... rest for calls the remaining props that haven't been explicitly fetched from props.
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const baseClasses =
      "app-button relative inline-flex gap-2 font-semibold items-center justify-center truncate transition transform hover:cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50";

    const variantClasses: Record<VariantType, string> = {
      primary: "bg-primary text-white hover:bg-[#0759D3] active:bg-[#0759D3]",
      secondary:
        "bg-secondary text-white hover:bg-[#CC446A] active:bg-[#CC446A]",
      outline:
        "bg-white text-black border border-[#E3E3E3] active:bg-[#F5F5F5]",
      ghost: "bg-white hover:bg-[#F5F5F5] active:bg-[#F5F5F5]",
      semiDestructive: "bg-semi-destructive text-destructive",
      cmsPrimary:
        "bg-cms-primary text-white hover:bg-[#032E82] active:bg-[#032E82]",
      cmsPrimaryLight:
        "bg-cms-primary-light text-cms-primary hover:bg-[#C1DAFF] active:bg-[#0C1DAFF]",
      cmsLink:
        "text-cms-primary hover:underline active:underline underline-offset-4",
    };

    const sizeClasses: Record<SizeType, string> = {
      large: "py-3 px-7 h-[52px] text-lg rounded-xl",
      default: "py-2 px-4 h-10 text-sm rounded-lg",
      medium: "py-1.5 px-3 h-9 text-sm rounded-md",
      small: "py-1 px-2 h-8 text-xs rounded-md",
      icon: "size-9 rounded-md",
      largeRounded: "py-3 px-7 h-[52px] text-lg rounded-full",
      defaultRounded: "py-2 px-4 h-10 text-sm rounded-full",
    };

    const fontClasses: Record<FontType, string> = {
      brand: "font-brand",
      bodycopy: "font-bodycopy",
      ui: "font-ui",
    };

    const finalClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fontClasses[font],
      className,
    ].join(" ");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      window.dataLayer?.push({
        event: "click",
        feature_name: featureName,
        feature_position: featurePosition,
      });

      // Panggil onClick props jika ada
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={finalClasses}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
AppButton.displayName = "AppButton";
export default AppButton;
