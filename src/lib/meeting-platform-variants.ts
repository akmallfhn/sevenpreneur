import { MeetingPlatformVariant } from "@/app/components/items/MeetingPlatformItemCMS";

export function getMeetingPlatformVariantFromURL(
  url: string
): MeetingPlatformVariant {
  if (url.includes("meet.google.com")) return "GMEET";
  if (url.includes("zoom.us")) return "ZOOM";
  if (url.includes("teams.microsoft.com")) return "TEAMS";
  return "UNKNOWN";
}
