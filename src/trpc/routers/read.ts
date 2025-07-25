import {
  createTRPCRouter,
  loggedInProcedure,
  publicProcedure,
} from "@/trpc/init";
import {
  numberIsID,
  stringIsNanoid,
  stringIsUUID,
} from "@/trpc/utils/validation";
import { CategoryEnum, StatusEnum, TStatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

  user: loggedInProcedure
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
        whereClause = Object.assign(whereClause, {
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
      const theCohortWithCounts = Object.assign(theCohort, {
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
          user: true,
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

      let invoiceUrl: string | undefined;
      if (theTransaction.status === TStatusEnum.PENDING) {
        invoiceUrl = `https://checkout-staging.xendit.co/v2/${theTransaction.invoice_number}`;
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

      let cohortId: number | undefined;
      let cohortName: string | undefined;
      let cohortImage: string | undefined;
      let cohortSlugUrl: string | undefined;
      let cohortPriceName: string | undefined;
      if (theTransaction.category === CategoryEnum.COHORT) {
        const theCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
          include: { cohort: true },
          where: { id: theTransaction.item_id },
        });
        if (theCohortPrice) {
          cohortId = theCohortPrice.cohort.id;
          cohortName = theCohortPrice.cohort.name;
          cohortImage = theCohortPrice.cohort.image;
          cohortSlugUrl = theCohortPrice.cohort.slug_url;
          cohortPriceName = theCohortPrice.name;
        }
      }

      return {
        status: 200,
        message: "Success",
        transaction: {
          id: theTransaction.id,
          status: theTransaction.status,
          invoice_number: theTransaction.invoice_number,
          invoice_url: invoiceUrl,
          product_price: theTransaction.amount,
          product_admin_fee: theTransaction.admin_fee,
          product_vat: theTransaction.vat,
          product_total_amount: theTransaction.amount
            .plus(theTransaction.admin_fee)
            .plus(theTransaction.vat),
          cohort_id: cohortId,
          cohort_name: cohortName,
          cohort_image: cohortImage,
          cohort_slug: cohortSlugUrl,
          cohort_price_name: cohortPriceName,
          payment_channel_name: paymentChannelName,
          payment_channel_image: paymentChannelImage,
          user_full_name: theTransaction.user.full_name,
          created_at: theTransaction.created_at,
          paid_at: theTransaction.paid_at,
        },
      };
    }),
});
