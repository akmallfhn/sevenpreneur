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
