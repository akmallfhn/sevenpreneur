export type CohortBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
};

export type CohortBadgeWithPrice = CohortBadge & {
  priceName: string | undefined;
};

export type EventBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
};

export type EventBadgeWithPrice = EventBadge & {
  priceName: string | undefined;
};

export type PlaylistBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
  totalVideo: number | undefined;
};
