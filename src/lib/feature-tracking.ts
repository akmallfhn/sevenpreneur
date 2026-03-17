"use client";
import { useEffect, useRef } from "react";

export interface FeatureTrackingProps {
  featureName?: string;
  featureId?: string;
  featureProductCategory?: string;
  featureProductName?: string;
  featureProductAmount?: number;
  featurePagePoint?: string;
  featurePlacement?: string;
  featurePosition?: number;
}

export interface MetaObjectProps {
  metaEventName?: string;
  metaEventId?: string;
  metaContentIds?: string[];
  metaContentType?: string;
  metaContentName?: string;
  metaContentCategory?: string;
  metaContents?: string;
  metaCurrency?: string;
  metaValue?: number;
  metaNumItems?: number;
  metaExternalId?: string;
  metaFirstName?: string;
  metaEmail?: string;
  metaPhoneNumber?: string;
}

export function useTrackView<T extends HTMLElement>(
  props: FeatureTrackingProps,
  enabled: boolean = true,
) {
  const ref = useRef<T | null>(null);
  const viewedSetRef = useRef<Set<string>>(new Set()); // Global memory (avoid double hit in same session render)

  useEffect(() => {
    if (!enabled) return;

    const current = ref.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const viewedSet = viewedSetRef.current;

          if (entry.isIntersecting && !viewedSet.has(props.featureId!)) {
            window.dataLayer?.push({
              event: "view",
              feature_name: props.featureName,
              feature_id: props.featureId,
              feature_page_point: props.featurePagePoint,
              feature_placement: props.featurePlacement,
            });
            viewedSet.add(props.featureId!);
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [
    enabled,
    props.featureId,
    props.featureName,
    props.featurePagePoint,
    props.featurePlacement,
  ]);

  return ref;
}
