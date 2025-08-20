import {
  administratorProcedure,
  createTRPCRouter,
  loggedInProcedure,
  publicProcedure,
  roleBasedProcedure,
} from "@/trpc/init";
import {
  numberIsID,
  stringIsNanoid,
  stringIsUUID,
} from "@/trpc/utils/validation";
import {
  CategoryEnum,
  PrismaClient,
  StatusEnum,
  TStatusEnum,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

type CohortBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
};

type CohortBadgeWithPrice = CohortBadge & {
  priceName: string | undefined;
};

type PlaylistBadge = {
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  slugUrl: string | undefined;
  totalVideo: number | undefined;
};

async function isEnrolledCohort(
  prisma: PrismaClient,
  user_id: string,
  cohort_id: number,
  error_message: string
) {
  const theEnrolledCohort = await prisma.userCohort.findFirst({
    where: {
      user_id: user_id,
      cohort_id: cohort_id,
    },
  });
  if (!theEnrolledCohort) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: error_message,
    });
  }
}

export const readRouter = createTRPCRouter({
  industry: loggedInProcedure
    .input(
      z.object({
        id: z.number().finite().gt(0),
      })
    )
    .query(async (opts) => {
      const theIndustry = await opts.ctx.prisma.industry.findFirst({
        where: { id: opts.input.id },
      });
      if (!theIndustry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The industry with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        industry: theIndustry,
      };
    }),

  entrepreneurStage: loggedInProcedure
    .input(
      z.object({
        id: z.number().finite().gt(0),
      })
    )
    .query(async (opts) => {
      const theEntrepreneurStage =
        await opts.ctx.prisma.entrepreneurStage.findFirst({
          where: { id: opts.input.id },
        });
      if (!theEntrepreneurStage) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The entrepreneur stage with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        entrepreneur_stage: theEntrepreneurStage,
      };
    }),

  role: loggedInProcedure
    .input(
      z.object({
        id: z.number().finite().gte(0),
      })
    )
    .query(async (opts) => {
      const theRole = await opts.ctx.prisma.role.findFirst({
        where: { id: opts.input.id },
      });
      if (!theRole) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The role with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        role: theRole,
      };
    }),

  user: roleBasedProcedure(["Administrator", "Educator", "Class Manager"])
    .input(
      z.object({
        id: stringIsUUID(),
      })
    )
    .query(async (opts) => {
      const theUser = await opts.ctx.prisma.user.findFirst({
        include: {
          phone_country: true,
          role: true,
          entrepreneur_stage: true,
          industry: true,
        },
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      if (!theUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The user with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        user: theUser,
      };
    }),

  cohort: publicProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      let whereClause = {
        id: opts.input.id,
        deleted_at: null,
      };
      if (!opts.ctx.user) {
        Object.assign(whereClause, {
          status: StatusEnum.ACTIVE,
          published_at: {
            lte: new Date(),
          },
        });
      }
      const theCohort = await opts.ctx.prisma.cohort.findFirst({
        include: {
          cohort_prices: true,
        },
        where: whereClause,
      });
      if (!theCohort) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The cohort with the given ID is not found.",
        });
      }
      const learningsCount = await opts.ctx.prisma.learning.count({
        where: {
          cohort_id: opts.input.id,
        },
      });
      const modulesCount = await opts.ctx.prisma.module.count({
        where: {
          cohort_id: opts.input.id,
        },
      });
      const materialsCount = await opts.ctx.prisma.material.count({
        where: {
          learning: {
            cohort_id: opts.input.id,
          },
        },
      });
      const theCohortWithCounts = Object.assign({}, theCohort, {
        total_learning_session: learningsCount,
        total_materials: modulesCount + materialsCount,
      });
      return {
        status: 200,
        message: "Success",
        cohort: theCohortWithCounts,
      };
    }),

  cohortPrice: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const theCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theCohortPrice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The cohort price with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        cohortPrice: theCohortPrice,
      };
    }),

  learning: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const theLearning = await opts.ctx.prisma.learning.findFirst({
        include: {
          speaker: true,
        },
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theLearning) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The learning with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        learning: theLearning,
      };
    }),

  material: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name == "General User") {
        const checkMaterial = await opts.ctx.prisma.material.findFirst({
          select: { learning: { select: { cohort_id: true } } },
          where: { id: opts.input.id },
        });
        if (!checkMaterial) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "The material with the given ID is not found.",
          });
        }
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          checkMaterial.learning.cohort_id,
          "You're not allowed to read materials of a cohort which you aren't enrolled."
        );
      }
      const theMaterial = await opts.ctx.prisma.material.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theMaterial) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The material with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        material: theMaterial,
      };
    }),

  module: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name == "General User") {
        const checkModule = await opts.ctx.prisma.module.findFirst({
          select: { cohort_id: true },
          where: { id: opts.input.id },
        });
        if (!checkModule) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "The module with the given ID is not found.",
          });
        }
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          checkModule.cohort_id,
          "You're not allowed to read modules of a cohort which you aren't enrolled."
        );
      }
      const theModule = await opts.ctx.prisma.module.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theModule) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The module with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        module: theModule,
      };
    }),

  project: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name == "General User") {
        const checkProject = await opts.ctx.prisma.project.findFirst({
          select: { cohort_id: true },
          where: { id: opts.input.id },
        });
        if (!checkProject) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "The project with the given ID is not found.",
          });
        }
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          checkProject.cohort_id,
          "You're not allowed to read projects of a cohort which you aren't enrolled."
        );
      }
      const theProject = await opts.ctx.prisma.project.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The project with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        project: theProject,
      };
    }),

  submission: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      let selectedUserId: string | undefined = undefined;
      if (opts.ctx.user.role.name === "General User") {
        selectedUserId = opts.ctx.user.id;
      }
      const theSubmission = await opts.ctx.prisma.submission.findFirst({
        include: { submitter: true },
        where: {
          id: opts.input.id,
          submitter_id: selectedUserId,
          // deleted_at: null,
        },
      });
      if (!theSubmission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The submission with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        submission: theSubmission,
      };
    }),

  playlist: publicProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const thePlaylist = await opts.ctx.prisma.playlist.findFirst({
        include: {
          educators: {
            include: { user: { select: { full_name: true, avatar: true } } },
            omit: { user_id: true, playlist_id: true },
          },
          videos: {
            omit: {
              playlist_id: true,
              video_url: true,
              external_video_id: true,
            },
            orderBy: [{ num_order: "asc" }, { id: "asc" }],
          },
        },
        omit: {
          deleted_at: true,
          deleted_by_id: true,
        },
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!thePlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The playlist with the given ID is not found.",
        });
      }
      const videosCount = await opts.ctx.prisma.video.count({
        where: {
          playlist_id: opts.input.id,
        },
      });
      const durationsSumAggregate = await opts.ctx.prisma.video.aggregate({
        _sum: { duration: true },
        where: {
          playlist_id: opts.input.id,
        },
      });
      const durationsTotal = durationsSumAggregate._sum.duration;
      const usersCount = await opts.ctx.prisma.userPlaylist.count({
        where: {
          playlist_id: opts.input.id,
        },
      });
      const thePlaylistWithCounts = Object.assign({}, thePlaylist, {
        total_video: videosCount,
        total_duration: durationsTotal,
        total_user_enrolled: usersCount,
      });
      return {
        status: 200,
        message: "Success",
        playlist: thePlaylistWithCounts,
      };
    }),

  enrolledPlaylist: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const thePlaylist = await opts.ctx.prisma.userPlaylist.findFirst({
        include: {
          playlist: {
            include: {
              educators: {
                include: {
                  user: { select: { full_name: true, avatar: true } },
                },
                omit: { user_id: true, playlist_id: true },
              },
              videos: {
                omit: { playlist_id: true },
                orderBy: [{ num_order: "asc" }, { id: "asc" }],
              },
            },
            omit: {
              deleted_at: true,
              deleted_by_id: true,
            },
          },
        },
        where: {
          user_id: opts.ctx.user.id,
          playlist_id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!thePlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The playlist with the given ID is not found.",
        });
      }
      const videosCount = await opts.ctx.prisma.video.count({
        where: {
          playlist_id: opts.input.id,
        },
      });
      const durationsSumAggregate = await opts.ctx.prisma.video.aggregate({
        _sum: { duration: true },
        where: {
          playlist_id: opts.input.id,
        },
      });
      const durationsTotal = durationsSumAggregate._sum.duration;
      const usersCount = await opts.ctx.prisma.userPlaylist.count({
        where: {
          playlist_id: opts.input.id,
        },
      });
      const thePlaylistWithCounts = Object.assign({}, thePlaylist, {
        total_video: videosCount,
        total_duration: durationsTotal,
        total_user_enrolled: usersCount,
      });
      return {
        status: 200,
        message: "Success",
        playlist: thePlaylistWithCounts,
      };
    }),

  video: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const theVideo = await opts.ctx.prisma.video.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The video with the given ID is not found.",
        });
      }
      return {
        status: 200,
        message: "Success",
        video: theVideo,
      };
    }),

  discount: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const theDiscount = await opts.ctx.prisma.discount.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theDiscount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The discount with the given ID is not found.",
        });
      }

      let cohortBadge: CohortBadge | undefined;
      if (theDiscount.category === CategoryEnum.COHORT) {
        const theCohortPrice = await opts.ctx.prisma.cohort.findFirst({
          where: { id: theDiscount.item_id },
        });
        if (theCohortPrice) {
          cohortBadge = {
            id: theCohortPrice.id,
            name: theCohortPrice.name,
            image: theCohortPrice.image,
            slugUrl: theCohortPrice.slug_url,
          };
        }
      }

      let playlistBadge: PlaylistBadge | undefined;
      if (theDiscount.category === CategoryEnum.PLAYLIST) {
        const thePlaylist = await opts.ctx.prisma.playlist.findFirst({
          where: { id: theDiscount.item_id },
        });
        if (thePlaylist) {
          playlistBadge = {
            id: thePlaylist.id,
            name: thePlaylist.name,
            image: thePlaylist.image_url,
            slugUrl: thePlaylist.slug_url,
            totalVideo: await opts.ctx.prisma.video.count({
              where: {
                playlist_id: thePlaylist.id,
              },
            }),
          };
        }
      }

      return {
        status: 200,
        message: "Success",
        discount: {
          id: theDiscount.id,
          name: theDiscount.name,
          code: theDiscount.code,
          category: theDiscount.category,
          item_id: theDiscount.item_id,
          calc_percent: theDiscount.calc_percent,
          status: theDiscount.status,
          start_date: theDiscount.start_date,
          end_date: theDiscount.end_date,
          cohort_id: cohortBadge?.id,
          cohort_name: cohortBadge?.name,
          cohort_image: cohortBadge?.image,
          cohort_slug: cohortBadge?.slugUrl,
          playlist_id: playlistBadge?.id,
          playlist_name: playlistBadge?.name,
          playlist_image: playlistBadge?.image,
          playlist_slug_url: playlistBadge?.slugUrl,
          playlist_total_video: playlistBadge?.totalVideo,
          created_at: theDiscount.created_at,
          updated_at: theDiscount.updated_at,
        },
      };
    }),

  transaction: loggedInProcedure
    .input(
      z.object({
        id: stringIsNanoid(),
      })
    )
    .query(async (opts) => {
      let selectedUserId: string | undefined = opts.ctx.user.id;
      if (opts.ctx.user.role.name === "Administrator") {
        selectedUserId = undefined;
      }

      const theTransaction = await opts.ctx.prisma.transaction.findFirst({
        include: {
          user: {
            include: { phone_country: true },
          },
        },
        where: {
          id: opts.input.id,
          user_id: selectedUserId,
          // deleted_at: null,
        },
      });
      if (!theTransaction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The transaction with the given ID is not found.",
        });
      }

      let checkoutPrefix = "https://checkout.xendit.co/web/";
      if (process.env.XENDIT_MODE === "test") {
        checkoutPrefix = "https://checkout-staging.xendit.co/v2/";
      }

      let invoiceUrl: string | undefined;
      if (theTransaction.status === TStatusEnum.PENDING) {
        invoiceUrl = `${checkoutPrefix}${theTransaction.invoice_number}`;
      }

      let discountCode: string | undefined;
      let discountPercent: Decimal | undefined;
      if (theTransaction.discount_id) {
        const theDiscount = await opts.ctx.prisma.discount.findFirst({
          where: { id: theTransaction.discount_id },
        });
        if (theDiscount) {
          discountCode = theDiscount.code;
          discountPercent = theDiscount.calc_percent;
        }
      }

      let paymentChannelName: string | undefined;
      let paymentChannelImage: string | undefined;
      const thePaymentChannel = await opts.ctx.prisma.paymentChannel.findFirst({
        where: { code: theTransaction.payment_channel },
      });
      if (thePaymentChannel) {
        paymentChannelName = thePaymentChannel.label;
        paymentChannelImage = thePaymentChannel.image;
      }

      let cohortBadge: CohortBadgeWithPrice | undefined;
      if (theTransaction.category === CategoryEnum.COHORT) {
        const theCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
          include: { cohort: true },
          where: { id: theTransaction.item_id },
        });
        if (theCohortPrice) {
          cohortBadge = {
            id: theCohortPrice.cohort.id,
            name: theCohortPrice.cohort.name,
            image: theCohortPrice.cohort.image,
            slugUrl: theCohortPrice.cohort.slug_url,
            priceName: theCohortPrice.name,
          };
        }
      }

      let playlistBadge: PlaylistBadge | undefined;
      if (theTransaction.category === CategoryEnum.PLAYLIST) {
        const thePlaylist = await opts.ctx.prisma.playlist.findFirst({
          where: { id: theTransaction.item_id },
        });
        if (thePlaylist) {
          playlistBadge = {
            id: thePlaylist.id,
            name: thePlaylist.name,
            image: thePlaylist.image_url,
            slugUrl: thePlaylist.slug_url,
            totalVideo: await opts.ctx.prisma.video.count({
              where: {
                playlist_id: thePlaylist.id,
              },
            }),
          };
        }
      }

      return {
        status: 200,
        message: "Success",
        transaction: {
          id: theTransaction.id,
          category: theTransaction.category,
          status: theTransaction.status,
          invoice_number: theTransaction.invoice_number,
          invoice_url: invoiceUrl,
          product_price: theTransaction.amount,
          product_discount: theTransaction.discount_amount,
          product_admin_fee: theTransaction.admin_fee,
          product_vat: theTransaction.vat,
          product_total_amount: theTransaction.amount
            .sub(theTransaction.discount_amount)
            .plus(theTransaction.admin_fee)
            .plus(theTransaction.vat),
          discount_code: discountCode,
          discount_percent: discountPercent,
          cohort_id: cohortBadge?.id,
          cohort_name: cohortBadge?.name,
          cohort_image: cohortBadge?.image,
          cohort_slug: cohortBadge?.slugUrl,
          cohort_price_name: cohortBadge?.priceName,
          playlist_id: playlistBadge?.id,
          playlist_name: playlistBadge?.name,
          playlist_image: playlistBadge?.image,
          playlist_slug_url: playlistBadge?.slugUrl,
          playlist_total_video: playlistBadge?.totalVideo,
          payment_channel_name: paymentChannelName,
          payment_channel_image: paymentChannelImage,
          user_full_name: theTransaction.user.full_name,
          user_email: theTransaction.user.email,
          user_phone_country: theTransaction.user.phone_country,
          user_phone_number: theTransaction.user.phone_number,
          user_avatar: theTransaction.user.avatar,
          created_at: theTransaction.created_at,
          paid_at: theTransaction.paid_at,
        },
      };
    }),
});
