import { createTRPCRouter } from "@/trpc/init";
import { createArticle } from "./article/create.article";
import { createWA } from "./wa/create.wa";
import { createBA } from "./ba/create.ba";
import { createBD } from "./bd/create.bd";
import { createEvent } from "./event/create.event";
import { createLMS } from "./lms/create.lms";
import { createPlaylist } from "./playlist/create.playlist";
import { createTemplate } from "./templates/templates";
import { createTransaction } from "./transaction/create.transaction";
import { createUserData } from "./userdata/create.userdata";

export const createRouter = createTRPCRouter({
  // User Data //

  user: createUserData.user,

  // LMS-related //

  cohort: createLMS.cohort,
  cohortPrice: createLMS.cohortPrice,
  cohortMember: createLMS.cohortMember,
  module: createLMS.module,
  learning: createLMS.learning,
  material: createLMS.material,
  discussionStarter: createLMS.discussionStarter,
  discussionReply: createLMS.discussionReply,
  project: createLMS.project,
  submission: createLMS.submission,
  checkIn: createLMS.checkIn,
  checkOut: createLMS.checkOut,

  // Business-assessment-related //

  ba: {
    category: createBA.category,
    subcategory: createBA.subcategory,
    question: createBA.question,
    answerSheet: createBA.answerSheet,
  },

  // Business-metric-related //

  // Business data (bd)
  bd: {
    revenue_mtd: createBD.revenue_mtd,
    revenue_mtd_csv: createBD.revenue_mtd_csv,
    cost_mtd: createBD.cost_mtd,
    north_star_indicator: createBD.north_star_indicator,
    north_star_mtd: createBD.north_star_mtd,
  },

  // Playlist-related //

  playlist: createPlaylist.playlist,
  educatorPlaylist: createPlaylist.educatorPlaylist,
  video: createPlaylist.video,

  // Event-related //

  event: createEvent.event,
  eventPrice: createEvent.eventPrice,

  // Template-related //

  template: createTemplate.template,

  // Transaction-related //

  discount: createTransaction.discount,

  // Article-related //

  articleCategory: createArticle.articleCategory,
  article: createArticle.article,

  // WhatsApp-chat-related //

  wa: {
    asset: createWA.asset,
    alert: createWA.alert,
  },
});
