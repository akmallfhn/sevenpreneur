import { ConferenceVariant } from "./app-types";

export function getConferenceVariantFromURL(url: string): ConferenceVariant {
  if (url.includes("meet.google.com")) return "GMEET";
  if (url.includes("zoom.us")) return "ZOOM";
  if (url.includes("teams.microsoft.com")) return "TEAMS";
  return "UNKNOWN";
}

const conferenceVariant: Record<
  ConferenceVariant,
  {
    conferenceIcon: string;
    conferenceName: string;
  }
> = {
  GMEET: {
    conferenceIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/gmeet-icon.webp",
    conferenceName: "Google Meet",
  },
  ZOOM: {
    conferenceIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/zoom-icon.webp",
    conferenceName: "Zoom Meeting",
  },
  TEAMS: {
    conferenceIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/teams-icon.webp",
    conferenceName: "MicrosoftTeams",
  },
  UNKNOWN: {
    conferenceIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/unknown-call-icon.webp",
    conferenceName: "Unknown",
  },
};

export function getConferenceAttributes(variant: ConferenceVariant) {
  return conferenceVariant[variant] || conferenceVariant.UNKNOWN;
}
