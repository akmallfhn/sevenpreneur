import {
  WhatsappAttachmentAudio,
  WhatsappAttachmentContacts,
  WhatsappAttachmentDocument,
  WhatsappAttachmentImage,
  WhatsappAttachmentSticker,
  WhatsappAttachmentVideo,
} from "@/lib/whatsapp-types";

// WhatsApp Webhook //

type WhatsAppWebhookOtherFieldType =
  | "account_alerts"
  | "account_review_update"
  | "account_update"
  | "automatic_events"
  | "business_capability_update"
  | "history"
  | "message_template_components_update"
  | "message_template_quality_update"
  | "message_template_status_update"
  | "partner_solutions"
  | "payment_configuration_update"
  | "phone_number_name_update"
  | "phone_number_quality_update"
  | "security"
  | "smb_app_state_sync"
  | "smb_message_echoes"
  | "template_category_update"
  | "user_preferences";

export type WhatsAppWebhookBody = {
  object: string;
  entry: {
    id: string;
    changes: (
      | {
          field: "messages";
          value: WhatsAppWebhookMessage;
        }
      | {
          field: WhatsAppWebhookOtherFieldType;
          value: unknown;
        }
    )[];
  }[];
};

// messages Webhook //

type WhatsAppWebhookOtherMessageType =
  | "button"
  | "edit"
  | "interactive"
  | "location"
  | "order"
  | "reaction"
  | "revoke"
  | "system"
  | "unsupported";

export type WhatsAppWebhookMessageStatusType =
  | "delivered"
  | "failed"
  | "played"
  | "read"
  | "sent";

export type WhatsAppWebhookMessage = {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: {
    profile: {
      name: string;
    };
    wa_id: string;
  }[];
  messages?: (
    | {
        from: string;
        id: string;
        timestamp: string;
        type: "audio";
        audio: WhatsappAttachmentAudio;
      }
    | {
        from: string;
        id: string;
        timestamp: string;
        type: "contacts";
        contacts: WhatsappAttachmentContacts;
      }
    | {
        from: string;
        id: string;
        timestamp: string;
        type: "document";
        document: WhatsappAttachmentDocument;
      }
    | {
        from: string;
        id: string;
        timestamp: string;
        type: "image";
        image: WhatsappAttachmentImage;
      }
    | {
        from: string;
        id: string;
        timestamp: string;
        type: "sticker";
        sticker: WhatsappAttachmentSticker;
      }
    | {
        from: string;
        id: string;
        timestamp: string;
        type: "text";
        text: {
          body: string;
        };
      }
    | {
        from: string;
        id: string;
        timestamp: string;
        type: "video";
        video: WhatsappAttachmentVideo;
      }
    | {
        from: string;
        id: string;
        timestamp: string;
        type: WhatsAppWebhookOtherMessageType;
      }
  )[];
  statuses?: {
    id: string;
    status: WhatsAppWebhookMessageStatusType;
    timestamp: string;
    recipient_id: string;
    conversation: {
      id: string;
      origin: {
        type: string;
      };
    };
    pricing: {
      billable: boolean;
      pricing_model: string;
      category: string;
    };
  }[];
};
