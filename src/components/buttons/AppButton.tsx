"use client";
import { FeatureTrackingProps, MetaObjectProps } from "@/lib/feature-tracking";
import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from "react";

export type VariantType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "primarySoft"
  | "secondarySoft"
  | "destructive"
  | "destructiveSoft"
  | "light"
  | "dark"
  | "quarternary"
  | "ghost"
  | "whatsapp"
  | "link"
  | "cmsLink"
  | "flux"
  | "wipe";
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
  | "smallIconRounded"
  | "mediumIcon"
  | "largeIconRounded";
export type FontType = "brand" | "bodycopy" | "ui";

interface AppButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
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
      ...rest // -- ... rest for calls the remaining props that haven't been explicitly fetched from props.
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const baseClasses =
      "app-button relative inline-flex gap-2 font-semibold items-center justify-center truncate transition transform hover:cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed";

    const variantClasses: Record<VariantType, string> = {
      // Brand
      primary:
        "bg-primary-background text-primary-foreground hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-muted dark:disabled:text-primary-foreground/50",
      secondary:
        "bg-secondary-background text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active disabled:bg-secondary-muted dark:disabled:text-secondary-foreground/50",
      tertiary:
        "bg-tertiary-background text-tertiary-foreground hover:bg-tertiary-hover active:bg-tertiary-active disabled:bg-tertiary-muted dark:disabled:text-secondary-foreground/50",
      primarySoft:
        "bg-primary-soft-background text-primary-soft-foreground hover:bg-primary-soft-hover active:bg-primary-soft-active disabled:bg-primary-soft-muted disabled:text-primary-soft-foreground/50",
      secondarySoft:
        "bg-secondary-soft-background text-secondary-soft-foreground hover:bg-secondary-soft-hover active:bg-primary-soft-active disabled:bg-secondary-soft-muted disabled:text-secondary-soft-foreground/50",

      // Utilities
      destructive:
        "bg-destructive-background text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active disabled:bg-destructive-muted dark:disabled:text-destructive-foreground/50",
      destructiveSoft:
        "bg-destructive-soft-background text-destructive-soft-foreground hover:bg-destructive-soft-hover active:bg-destructive-soft-active disabled:bg-destructive-soft-muted disabled:text-destructive-soft-foreground/50 dark:hover:bg-destructive-soft-background/80 dark:active:bg-destructive-soft-background/80 dark:disabled:bg-destructive-soft-background/50",
      light:
        "bg-light-background text-light-foreground border hover:bg-light-hover active:bg-light-active disabled:bg-light-muted disabled:text-light-foreground/30",
      dark: "bg-dark-background text-dark-foreground hover:bg-dark-hover active:bg-dark-active disabled:bg-dark-muted disabled:text-dark-foreground/30",

      // Todo
      ghost:
        "hover:bg-white/10 active:bg-white/10 dark:hover:bg-black/5 dark:active:bg-black/5",
      quarternary:
        "bg-success-foreground text-white hover:bg-[#418E86] active:bg-[#418E86] disabled:bg-[#9ABEBA]",
      whatsapp:
        "bg-green-500 text-white hover:bg-[#05A645] disabled:bg-[#5AC785]",
      link: "text-primary hover:underline active:underline underline-offset-4",
      cmsLink:
        "text-cms-primary hover:underline active:underline underline-offset-4",

      // Animation
      flux: "bg-gradient-to-br from-0% from-[#267EFF] via-19% via-[#2D4BF1] to-100% to-[#5E17E3] text-white before:absolute before:inset-y-0 before:-left-1/3 before:w-1/3 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:skew-x-12 before:translate-x-[-200%] hover:before:translate-x-[300%] before:transition-transform before:duration-700 disabled:from-[#93BEFF] disabled:via-[#96A4F7] disabled:to-[#AE8BF1]",
      wipe: "bg-transparent text-white border border-white overflow-hidden transition-all duration-300 before:absolute before:inset-0 before:bg-green-500 before:-translate-x-full before:transition-transform before:duration-300 hover:before:translate-x-0 hover:border-transparent before:-z-10",
    };

    const sizeClasses: Record<SizeType, string> = {
      large: "py-3 px-7 h-[52px] text-lg rounded-xl",
      default: "py-2 px-4 h-10 text-sm rounded-lg",
      medium: "py-1.5 px-3 h-9 text-sm rounded-md",
      small: "py-1 px-2 h-8 text-xs rounded-md",
      icon: "size-9 rounded-md",
      mediumIcon: "size-7 rounded-md",
      largeRounded: "py-3 px-7 h-[52px] text-lg rounded-full",
      defaultRounded: "py-2 px-4 h-10 text-sm rounded-full",
      mediumRounded: "py-1.5 px-3 h-9 text-sm rounded-full",
      smallRounded: "py-1 px-2 h-8 text-xs rounded-full",
      iconRounded: "size-8 rounded-full",
      smallIconRounded: "size-6 rounded-full",
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
      const eventData: Record<string, unknown> = {
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
      if (typeof window !== "undefined" && window.fbq && metaEventName) {
        const fbqData: Record<string, unknown> = {
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
        window.fbq("track", metaEventName, fbqData);
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
