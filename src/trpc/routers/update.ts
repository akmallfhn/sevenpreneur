import { createTRPCRouter } from "@/trpc/init";
import { updateEvent } from "./event/update.event";
import { updateLMS } from "./lms/update.lms";
import { updatePlaylist } from "./playlist/update.playlist";
import { updateTicker } from "./ticker/update.ticker";
import { updateTransaction } from "./transaction/update.transaction";
import { updateUserData } from "./userdata/update.userdata";

export const updateRouter = createTRPCRouter({
  // User Data //

  user: updateUserData.user,

  // LMS-related //

  cohort: updateLMS.cohort,
  cohortPrice: updateLMS.cohortPrice,
  module: updateLMS.module,
  learning: updateLMS.learning,
  material: updateLMS.material,
  discussionStarter: updateLMS.discussionStarter,
  discussionReply: updateLMS.discussionReply,
  project: updateLMS.project,
  submission: updateLMS.submission,

  // Playlist-related //

  playlist: updatePlaylist.playlist,
  video: updatePlaylist.video,

  // Event-related //

  event: updateEvent.event,
  eventPrice: updateEvent.eventPrice,

  // Transaction-related //

  discount: updateTransaction.discount,

  // Tickers //

  ticker: updateTicker.ticker,
});
