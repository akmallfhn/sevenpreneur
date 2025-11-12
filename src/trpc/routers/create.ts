import { createTRPCRouter } from "@/trpc/init";
import { createEvent } from "./event/create.event";
import { createLMS } from "./lms/create.lms";
import { createPlaylist } from "./playlist/create.playlist";
import { createTemplate } from "./templates/templates";
import { createTransaction } from "./transaction/create.transaction";
import { createUserData } from "./userdata/create.userdata";
import { createAITool } from "./ai_tool/create.ai_tool";

export const createRouter = createTRPCRouter({
  // User Data //

  user: createUserData.user,

  // LMS-related //

  cohort: createLMS.cohort,
  cohortPrice: createLMS.cohortPrice,
  module: createLMS.module,
  learning: createLMS.learning,
  material: createLMS.material,
  discussionStarter: createLMS.discussionStarter,
  discussionReply: createLMS.discussionReply,
  project: createLMS.project,
  submission: createLMS.submission,

  // Playlist-related //

  playlist: createPlaylist.playlist,
  educatorPlaylist: createPlaylist.educatorPlaylist,
  video: createPlaylist.video,

  // Event-related //

  event: createEvent.event,
  eventPrice: createEvent.eventPrice,

  // Template-related //

  template: createTemplate.template,

  // AI-chat-related //
  aiConversation: createAITool.aiConversation,

  // Transaction-related //

  discount: createTransaction.discount,
});
