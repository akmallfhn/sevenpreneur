"use client";
import { FeatureTrackingProps, MetaObjectProps } from "@/lib/feature-tracking";
import React, { ButtonHTMLAttributes, ForwardedRef, forwardRef } from "react";

export type VariantType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "light";

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

interface ButtonAILNProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    FeatureTrackingProps,
    MetaObjectProps {
  children: React.ReactNode;
  variant?: VariantType;
  size?: SizeType;
}

// Use forwardRef for pass ref component. forwardRef cant directly use with 'export default function'
const ButtonAILN = forwardRef<HTMLButtonElement, ButtonAILNProps>(
  (
    {
      onClick,
      children,
      variant = "primary",
      size = "default",
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
      "app-button font-read relative inline-flex gap-2 font-semibold items-center justify-center truncate transition transform hover:cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed";

    const variantClasses: Record<VariantType, string> = {
      primary:
        "bg-black text-white hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500",
      secondary:
        "bg-[#107158] text-white hover:bg-[#0d5d48] active:bg-[#0a4a39] disabled:bg-emerald-200 disabled:text-emerald-50",
      tertiary:
        "bg-[#00359D] text-white hover:bg-[#002a7d] active:bg-[#001f5d] disabled:bg-blue-200 disabled:text-blue-50",
      destructive:
        "bg-destructive-background text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active disabled:bg-destructive-muted dark:disabled:text-destructive-foreground/50",
      light:
        "bg-light-background text-light-foreground border hover:bg-light-hover active:bg-light-active disabled:bg-light-muted disabled:text-light-foreground/30",
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

    const finalClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
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
ButtonAILN.displayName = "ButtonAILN";
export default ButtonAILN;
