// General type
export type ProductCategory = "COHORT" | "PLAYLIST" | "AI" | "EVENT";
export type TransactionStatus = "PAID" | "PENDING" | "FAILED";
export const StatusType = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type StatusType = (typeof StatusType)[keyof typeof StatusType];
export type NumberConfig = "numeric" | "decimal" | "phone_number";
export type PlatformType = "SVP" | "CMS" | "LMS" | "AILENE";
export type SocialMediaVariant =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "x"
  | "whatsapp";

// LMS related
export const SessionMethod = {
  ONLINE: "ONLINE",
  ONSITE: "ONSITE",
  HYBRID: "HYBRID",
} as const;
export type SessionMethod = (typeof SessionMethod)[keyof typeof SessionMethod];
export type ScheduleStatus = "UPCOMING" | "ON GOING" | "FINISHED";
export type SubmissionStatus = "SUBMITTED" | "NOT_SUBMITTED";
export type ConferenceVariant = "GMEET" | "ZOOM" | "TEAMS" | "UNKNOWN";
export type FileVariant =
  | "DOCX"
  | "XLSX"
  | "PPTX"
  | "PDF"
  | "FILE"
  | "FIGMADESIGN"
  | "FIGJAM"
  | "PDF"
  | "UNKNOWN";
export type ReactionVariant = "favorite" | "scout";

// User related
export type RolesUser =
  | "administrator"
  | "educator"
  | "classManager"
  | "generalUser"
  | "marketer";
export type OccupationUser =
  | "EMPLOYEE"
  | "ENTREPRENEUR"
  | "STUDENT"
  | "FREELANCE"
  | "MILITARY"
  | "UNEMPLOYED";
export type BusinessRevenue =
  | "BELOW_50M"
  | "BETWEEN_50M_100M"
  | "BETWEEN_100M_500M"
  | "BETWEEN_500M_1B"
  | "BETWEEN_1B_10B"
  | "BETWEEN_10B_25B"
  | "ABOVE_25B";
export type BusinessEmployeeNumber =
  | "SMALL"
  | "MEDIUM"
  | "LARGE"
  | "XLARGE"
  | "XXLARGE";
export type BusinessLegalEntity =
  | "CV"
  | "PT"
  | "PT_TBK"
  | "PERSERO"
  | "FIRMA"
  | "KOPERASI"
  | "YAYASAN"
  | "UD"
  | "NON_LEGAL_ENTITY";
export type BusinessYearlyRevenue =
  | "BELOW_50M"
  | "BETWEEN_50M_100M"
  | "BETWEEN_100M_500M"
  | "BETWEEN_500M_1B"
  | "BETWEEN_1B_10B"
  | "BETWEEN_10B_25B"
  | "ABOVE_25B";

// AI related
export type AIMarketSize_CustomerType = "b2b" | "b2c" | "hybrid";
export type AIMarketSize_ProductType = "fisik" | "digital" | "hybrid";
export type AIChatRole = "USER" | "ASSISTANT";
export type AIPriceType = "value" | "cost" | "competition";
export type AIChatEventType =
  | "conv_id"
  | "title"
  | "created"
  | "delta"
  | "completed"
  | "failed"
  | "error";

// Whatsapp related
export type LeadStatus = "COLD" | "WARM" | "HOT";
export type WhatsappChatStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";
export type WhatsappChatDirection = "INBOUND" | "OUTBOUND";
export type WhatsappChatType =
  | "AUDIO"
  | "BUTTON"
  | "CONTACTS"
  | "DOCUMENT"
  | "EDIT"
  | "IMAGE"
  | "INTERACTIVE"
  | "LOCATION"
  | "ORDER"
  | "REACTION"
  | "REVOKE"
  | "STICKER"
  | "SYSTEM"
  | "TEXT"
  | "UNSUPPORTED"
  | "VIDEO";

// Article related
export type ArticleStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

// AI learn related
export const AiLearnLessonStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type AiLearnLessonStatus =
  (typeof AiLearnLessonStatus)[keyof typeof AiLearnLessonStatus];

export const AiLearnRoleEnum = {
  MARKETING: "MARKETING",
  OPERATIONAL: "OPERATIONAL",
  CEO: "CEO",
  FINANCE: "FINANCE",
  HR: "HR",
} as const;
export type AiLearnRoleEnum =
  (typeof AiLearnRoleEnum)[keyof typeof AiLearnRoleEnum];
