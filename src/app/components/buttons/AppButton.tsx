"use client";
import { FeatureTrackingProps, MetaObjectProps } from "@/lib/feature-tracking";
import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from "react";

export type VariantType =
  | "primary"
  | "primaryLight"
  | "primaryGradient"
  | "secondary"
  | "tertiary"
  | "outline"
  | "ghost"
  | "whatsapp"
  | "hollowWhatsapp"
  | "link"
  | "dark"
  | "surfaceDark"
  | "destructive"
  | "semiDestructive"
  | "cmsPrimary"
  | "cmsPrimaryLight"
  | "cmsLink";
export type SizeType =
  | "default"
  | "medium"
  | "large"
  | "small"
  | "icon"
  | "largeRounded"
  | "defaultRounded"
  | "mediumRounded"
  | "smallRounded"
  | "iconRounded"
  | "largeIconRounded";
export type FontType = "brand" | "bodycopy" | "ui";

interface AppButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    FeatureTrackingProps,
    MetaObjectProps {
  children: React.ReactNode;
  variant?: VariantType;
  size?: SizeType;
  font?: FontType;
}

// Use forwardRef for pass ref component. forwardRef cant directly use with 'export default function'
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
      featureId,
      featureProductCategory,
      featureProductName,
      featureProductAmount,
      featurePagePoint,
      featurePlacement,
      featurePosition,
      metaEventName,
      metaEventId,
      metaContentIds,
      metaContentType,
      metaContentCategory,
      metaContentName,
      metaCurrency,
      metaValue,
      metaNumItems,
      metaExternalId,
      metaFirstName,
      metaEmail,
      metaPhoneNumber,
      ...rest // -- ... rest for calls the remaining props that haven't been explicitly fetched from props.
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const baseClasses =
      "app-button relative inline-flex gap-2 font-semibold items-center justify-center truncate transition transform hover:cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed";

    const variantClasses: Record<VariantType, string> = {
      primary:
        "bg-primary text-white hover:bg-[#0759D3] active:bg-[#0759D3] disabled:bg-[#A1C2F2]",
      primaryLight:
        "bg-primary-light text-primary hover:bg-[#A0C7FF] active:bg-[#A0C7FF] disabled:text-[#6BA6FF]",
      primaryGradient:
        "text-white bg-gradient-to-br from-0% from-[#267EFF] via-19% via-[#2D4BF1] to-100% to-[#5E17E3] before:absolute before:inset-y-0 before:-left-1/3 before:w-1/3 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:skew-x-12 before:translate-x-[-200%] hover:before:translate-x-[300%] before:transition-transform before:duration-700",
      secondary:
        "bg-secondary text-white hover:bg-[#CC446A] active:bg-[#CC446A] disabled:bg-[#E4AEBD]",
      tertiary:
        "bg-tertiary text-white hover:bg-[#2D12CA] active:bg-[#2D12CA] disabled:bg-[#9183E3]",
      outline:
        "bg-white border border-[#E3E3E3] active:bg-[#F5F5F5] dark:bg-surface-black dark:border-outline-dark disabled:text-[#909090] disabled:dark:text-[#262626]",
      ghost:
        "hover:bg-white/10 active:bg-white/10 dark:hover:bg-black/5 dark:active:bg-black/5",
      whatsapp:
        "text-white bg-green-500 hover:bg-[#05A645] disabled:bg-[#5AC785]",
      hollowWhatsapp:
        "bg-transparent border border-white text-white overflow-hidden transition-all duration-300 before:absolute before:inset-0 before:bg-green-500 before:-translate-x-full before:transition-transform before:duration-300 hover:before:translate-x-0 hover:border-transparent before:-z-10",
      link: "text-primary hover:underline active:underline underline-offset-4",
      dark: "bg-[#202020] text-white hover:bg-black active:bg-black",
      destructive:
        "text-white bg-destructive hover:bg-[#D62012] active:bg-[#D62012] disabled:bg-[#E3928B]",
      surfaceDark:
        "bg-[#27292E] text-[#9498A1] hover:bg-[#242529] active:bg-[#242529]",
      semiDestructive:
        "bg-semi-destructive text-destructive dark:text-red-700 dark:bg-[#29110C] disabled:text-[#FF867C]",
      cmsPrimary:
        "bg-cms-primary text-white hover:bg-[#032E82] active:bg-[#032E82] disabled:bg-[#5D6E8F]",
      cmsPrimaryLight:
        "bg-cms-primary-light text-cms-primary hover:bg-[#C1DAFF] active:bg-[#0C1DAFF] disabled:text-[#6C7D9C]",
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
      mediumRounded: "py-1.5 px-3 h-9 text-sm rounded-full",
      smallRounded: "py-1 px-2 h-8 text-xs rounded-full",
      iconRounded: "size-8 rounded-full",
      largeIconRounded: "size-10 rounded-full",
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

    // Tracking Handle
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Google Tag Manager
      const eventData: Record<string, any> = {
        event: "click",
        feature_id: featureId,
        feature_name: featureName,
        feature_product_category: featureProductCategory,
        feature_product_name: featureProductName,
        feature_product_amount: featureProductAmount,
        feature_page_point: featurePagePoint,
        feature_placement: featurePlacement,
        feature_position: featurePosition,
      };
      Object.keys(eventData).forEach(
        (key) => eventData[key] === null && delete eventData[key]
      );
      window.dataLayer?.push(eventData);

      // Meta Pixel
      if (
        typeof window !== "undefined" &&
        (window as any).fbq &&
        metaEventName
      ) {
        const fbqData: Record<string, any> = {
          event_id: metaEventId,
          content_ids: metaContentIds,
          content_type: metaContentType,
          content_name: metaContentName,
          content_category: metaContentCategory,
          currency: metaCurrency,
          value: metaValue,
          num_items: metaNumItems,
          external_id: metaExternalId,
          fn: metaFirstName,
          em: metaEmail,
        };
        Object.keys(fbqData).forEach(
          (key) => fbqData[key] === null && delete fbqData[key]
        );
        (window as any).fbq("track", metaEventName, fbqData);
      }

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
        suppressHydrationWarning
      >
        {children}
      </button>
    );
  }
);
AppButton.displayName = "AppButton";
export default AppButton;
