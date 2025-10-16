import { createTRPCRouter } from "@/trpc/init";
import { createEvent } from "./event/create.event";
import { createLMS } from "./lms/create.lms";
import { createPlaylist } from "./playlist/create.playlist";
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

  // Playlist-related //

  playlist: createPlaylist.playlist,
  educatorPlaylist: createPlaylist.educatorPlaylist,
  video: createPlaylist.video,

  // Event-related //

  event: createEvent.event,
  eventPrice: createEvent.eventPrice,

  // Transaction-related //

  discount: createTransaction.discount,
});
