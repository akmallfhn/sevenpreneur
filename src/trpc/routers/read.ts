import { createTRPCRouter } from "@/trpc/init";
import { readEvent } from "./event/read.event";
import { readLMS } from "./lms/read.lms";
import { readLookup } from "./lookup/read.lookup";
import { readPlaylist } from "./playlist/read.playlist";
import { readTicker } from "./ticker/read.ticker";
import { readTransaction } from "./transaction/read.transaction";
import { readUserData } from "./userdata/read.userdata";

export const readRouter = createTRPCRouter({
  // Lookup Tables //

  role: readLookup.role,
  entrepreneurStage: readLookup.entrepreneurStage,
  industry: readLookup.industry,

  // User Data //

  user: readUserData.user,

  // LMS-related //

  cohort: readLMS.cohort,
  cohortPrice: readLMS.cohortPrice,
  enrolledCohort: readLMS.enrolledCohort,
  module: readLMS.module,
  learning: readLMS.learning,
  material: readLMS.material,
  project: readLMS.project,
  submission: readLMS.submission,

  // Playlist-related //

  playlist: readPlaylist.playlist,
  enrolledPlaylist: readPlaylist.enrolledPlaylist,
  video: readPlaylist.video,

  // Event-related //

  event: readEvent.event,
  eventPrice: readEvent.eventPrice,

  // Transaction-related //

  discount: readTransaction.discount,
  transaction: readTransaction.transaction,

  // Tickers //

  ticker: readTicker.ticker,
});
