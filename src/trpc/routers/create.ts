import { createTRPCRouter } from "@/trpc/init";
import { createArticle } from "./article/create.article";
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
  module: createLMS.module,
  learning: createLMS.learning,
  material: createLMS.material,
  discussionStarter: createLMS.discussionStarter,
  discussionReply: createLMS.discussionReply,
  project: createLMS.project,
  submission: createLMS.submission,
  checkIn: createLMS.checkIn,
  checkOut: createLMS.checkOut,

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
});
