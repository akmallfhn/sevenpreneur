import { createTRPCRouter } from "@/trpc/init";
import { listAITool } from "./ai_tool/list.ai_tool";
import { listArticle } from "./article/list.article";
import { listEvent } from "./event/list.event";
import { listLMS } from "./lms/list.lms";
import { listLookup } from "./lookup/list.lookup";
import { listPlaylist } from "./playlist/list.playlist";
import { listTemplate } from "./templates/templates";
import { listTransaction } from "./transaction/list.transaction";
import { listUserData } from "./userdata/list.userdata";

export const listRouter = createTRPCRouter({
  // Lookup Tables //

  roles: listLookup.roles,
  industries: listLookup.industries,
  phoneCountryCodes: listLookup.phoneCountryCodes,
  paymentChannels: listLookup.paymentChannels,

  // User Data //

  users: listUserData.users,

  // LMS-related //

  cohorts: listLMS.cohorts,
  cohortPrices: listLMS.cohortPrices,
  cohortMembers: listLMS.cohortMembers,
  enrolledCohorts: listLMS.enrolledCohorts,
  modules: listLMS.modules,
  learnings: listLMS.learnings,
  learnings_public: listLMS.learnings_public,
  materials: listLMS.materials,
  discussionStarters: listLMS.discussionStarters,
  discussionReplies: listLMS.discussionReplies,
  projects: listLMS.projects,
  submissions: listLMS.submissions,
  attendance_counts: listLMS.attendance_counts,

  // Playlist-related //

  playlists: listPlaylist.playlists,
  educatorsPlaylist: listPlaylist.educatorsPlaylist,
  enrolledPlaylists: listPlaylist.enrolledPlaylists,

  // Event-related //

  events: listEvent.events,
  eventPrices: listEvent.eventPrices,

  // Template-related //

  templates: listTemplate.templates,

  // AI-tool-related //

  aiTools: listAITool.aiTools,
  aiResults: listAITool.aiResults,
  aiConversations: listAITool.aiConversations,
  aiChats: listAITool.aiChats,

  // Transaction-related //

  discounts: listTransaction.discounts,
  transactions: listTransaction.transactions,

  // Article-related //

  articleCategories: listArticle.articleCategories,
  articles: listArticle.articles,
});
