import { createTRPCRouter } from "@/trpc/init";
import { updateAdv } from "./ads/update.ads";
import { updateArticle } from "./article/update.article";
import { updateB2B } from "./b2b/update.b2b";
import { updateBA } from "./ba/update.ba";
import { updateBD } from "./bd/update.bd";
import { updateEvent } from "./event/update.event";
import { updateLMS } from "./lms/update.lms";
import { updatePlaylist } from "./playlist/update.playlist";
import { updateTemplate } from "./templates/templates";
import { updateTransaction } from "./transaction/update.transaction";
import { updateUserData } from "./userdata/update.userdata";
import { updateWA } from "./wa/update.wa";

export const updateRouter = createTRPCRouter({
  // User Data //

  user: updateUserData.user,
  user_business: updateUserData.user_business,

  // LMS-related //

  cohort: updateLMS.cohort,
  cohortPrice: updateLMS.cohortPrice,
  cohortMember: updateLMS.cohortMember,
  module: updateLMS.module,
  learning: updateLMS.learning,
  material: updateLMS.material,
  discussionStarter: updateLMS.discussionStarter,
  discussionReply: updateLMS.discussionReply,
  project: updateLMS.project,
  submission: updateLMS.submission,

  // Business-assessment-related //

  ba: {
    category: updateBA.category,
    subcategory: updateBA.subcategory,
    question: updateBA.question,
    answerSheet: updateBA.answerSheet,
  },

  // Business-metric-related //

  // Business data (bd)
  bd: {
    revenue_mtd: updateBD.revenue_mtd,
    revenue_mtd_csv: updateBD.revenue_mtd_csv,
    cost_mtd: updateBD.cost_mtd,
    north_star_indicator: updateBD.north_star_indicator,
    north_star_mtd: updateBD.north_star_mtd,
  },

  // Playlist-related //

  playlist: updatePlaylist.playlist,
  video: updatePlaylist.video,

  // Event-related //

  event: updateEvent.event,
  eventPrice: updateEvent.eventPrice,

  // Template-related //

  template: updateTemplate.template,

  // Transaction-related //

  discount: updateTransaction.discount,

  // Article-related //

  articleCategory: updateArticle.articleCategory,
  article: updateArticle.article,

  // Ads //

  ad: {
    interstitial: updateAdv.interstitial,
    ticker: updateAdv.ticker,
  },

  // WhatsApp-chat-related //

  wa: {
    conversation: updateWA.conversation,
    conversation_as_read: updateWA.conversation_as_read,
    asset: updateWA.asset,
    alert: updateWA.alert,
  },

  // B2B Sales Pipeline //

  b2b: {
    pipeline: updateB2B.pipeline,
    action: updateB2B.action,
  },
});
