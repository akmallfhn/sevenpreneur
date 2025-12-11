export type CohortBadge = {
  id?: number;
  name?: string;
  image?: string;
  slugUrl?: string;
};

export type CohortBadgeWithPrice = CohortBadge & {
  priceName?: string;
};

export type EventBadge = {
  id?: number;
  name?: string;
  image?: string;
  slugUrl?: string;
};

export type EventBadgeWithPrice = EventBadge & {
  priceName?: string;
};

export type PlaylistBadge = {
  id?: number;
  name?: string;
  image?: string;
  slugUrl?: string;
  totalVideo?: number;
};
