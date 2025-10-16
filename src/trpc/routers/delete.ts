import { createTRPCRouter } from "@/trpc/init";
import { deleteEvent } from "./event/delete.event";
import { deleteLMS } from "./lms/delete.lms";
import { deletePlaylist } from "./playlist/delete.playlist";
import { deleteTransaction } from "./transaction/delete.transaction";
import { deleteUserData } from "./userdata/delete.userdata";

export const deleteRouter = createTRPCRouter({
  // User Data //

  user: deleteUserData.user,

  // LMS-related //

  cohort: deleteLMS.cohort,
  cohortPrice: deleteLMS.cohortPrice,
  module: deleteLMS.module,
  learning: deleteLMS.learning,
  material: deleteLMS.material,
  discussionStarter: deleteLMS.discussionStarter,
  discussionReply: deleteLMS.discussionReply,
  project: deleteLMS.project,
  submission: deleteLMS.submission,

  // Playlist-related //

  playlist: deletePlaylist.playlist,
  educatorPlaylist: deletePlaylist.educatorPlaylist,
  video: deletePlaylist.video,

  // Event-related //

  event: deleteEvent.event,
  eventPrice: deleteEvent.eventPrice,

  // Transaction-related //

  discount: deleteTransaction.discount,
});
