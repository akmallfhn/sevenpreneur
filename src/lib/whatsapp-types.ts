export type WhatsappAttachmentAllTypes =
  | WhatsappAttachmentAudio
  | WhatsappAttachmentContacts
  | WhatsappAttachmentDocument
  | WhatsappAttachmentImage
  | WhatsappAttachmentSticker
  | WhatsappAttachmentVideo
  | WhatsappAttachmentText
  | WhatsappAttachmentTemplate;

export type WhatsappAttachmentAudio = {
  mime_type: string;
  sha256: string;
  id: string;
  url: string;
  voice: boolean;
  storage_url?: string;
};

export type WhatsappAttachmentContacts = {
  addresses?: [
    {
      city?: string;
      country?: string;
      country_code?: string;
      state?: string;
      street?: string;
      type?: string;
      zip?: string;
    }
  ];
  birthday?: string;
  emails?: [
    {
      email?: string;
      type?: string;
    }
  ];
  name?: {
    formatted_name?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    suffix?: string;
    prefix?: string;
  };
  org?: {
    company?: string;
    department?: string;
    title?: string;
  };
  phones?: [
    {
      phone?: string;
      wa_id?: string;
      type?: string;
    }
  ];
  urls?: [
    {
      url?: string;
      type?: string;
    }
  ];
}[];

export type WhatsappAttachmentDocument = {
  caption: string;
  filename: string;
  mime_type: string;
  sha256: string;
  id: string;
  url: string;
  storage_url?: string;
};

export type WhatsappAttachmentImage = {
  caption: string;
  mime_type: string;
  sha256: string;
  id: string;
  url: string;
  storage_url?: string;
};

export type WhatsappAttachmentSticker = {
  mime_type: string;
  sha256: string;
  id: string;
  url: string;
  animated: boolean;
  storage_url?: string;
};

export type WhatsappAttachmentVideo = {
  caption: string;
  mime_type: string;
  sha256: string;
  id: string;
  url: string;
  storage_url?: string;
};

export type WhatsappAttachmentText = undefined; // will be NULL in database

export type WhatsappAttachmentTemplate = {
  name: string;
  lang_code: string;
  parameters: object;
};

export type WhatsAppTypeAttachmentPairUnion =
  | { type: "AUDIO"; attachment: WhatsappAttachmentAudio }
  | { type: "CONTACTS"; attachment: WhatsappAttachmentContacts }
  | { type: "DOCUMENT"; attachment: WhatsappAttachmentDocument }
  | { type: "IMAGE"; attachment: WhatsappAttachmentImage }
  | { type: "STICKER"; attachment: WhatsappAttachmentSticker }
  | { type: "TEXT"; attachment: WhatsappAttachmentText }
  | { type: "VIDEO"; attachment: WhatsappAttachmentVideo }
  | { type: "TEMPLATE"; attachment: WhatsappAttachmentTemplate }
  | {
      type:
        | "BUTTON"
        | "EDIT"
        | "INTERACTIVE"
        | "LOCATION"
        | "ORDER"
        | "REACTION"
        | "REVOKE"
        | "SYSTEM"
        | "UNSUPPORTED";
      attachment: unknown;
    };
