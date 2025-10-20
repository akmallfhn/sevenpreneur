import { STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure, publicProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { numberIsID, objectHasOnlyID } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { isEnrolledCohort } from "./util.lms";

export const readLMS = {
  cohort: publicProcedure.input(objectHasOnlyID()).query(async (opts) => {
    let whereClause = {
      id: opts.input.id,
      deleted_at: null,
    };
    if (!opts.ctx.user) {
      Object.assign(whereClause, {
        status: StatusEnum.ACTIVE,
      });
    }
    const theCohort = await opts.ctx.prisma.cohort.findFirst({
      include: {
        cohort_prices: true,
      },
      where: whereClause,
    });
    if (!theCohort) {
      throw readFailedNotFound("cohort");
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
      code: STATUS_OK,
      message: "Success",
      cohort: theCohortWithCounts,
    };
  }),

  cohortPrice: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theCohortPrice) {
        throw readFailedNotFound("cohort price");
      }
      return {
        code: STATUS_OK,
        message: "Success",
        cohortPrice: theCohortPrice,
      };
    }),

  enrolledCohort: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theCohort = await opts.ctx.prisma.userCohort.findFirst({
        include: {
          cohort: true,
        },
        where: {
          user_id: opts.ctx.user.id,
          cohort_id: opts.input.id,
        },
      });
      if (!theCohort) {
        throw readFailedNotFound("cohort");
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
        code: STATUS_OK,
        message: "Success",
        cohort: theCohortWithCounts,
      };
    }),

  module: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    if (opts.ctx.user.role.name == "General User") {
      const checkModule = await opts.ctx.prisma.module.findFirst({
        select: { cohort_id: true },
        where: { id: opts.input.id },
      });
      if (!checkModule) {
        throw readFailedNotFound("module");
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
      throw readFailedNotFound("module");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      module: theModule,
    };
  }),

  learning: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
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
      throw readFailedNotFound("learning");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      learning: theLearning,
    };
  }),

  material: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    if (opts.ctx.user.role.name == "General User") {
      const checkMaterial = await opts.ctx.prisma.material.findFirst({
        select: { learning: { select: { cohort_id: true } } },
        where: { id: opts.input.id },
      });
      if (!checkMaterial) {
        throw readFailedNotFound("material");
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
      throw readFailedNotFound("material");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      material: theMaterial,
    };
  }),

  project: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    if (opts.ctx.user.role.name == "General User") {
      const checkProject = await opts.ctx.prisma.project.findFirst({
        select: { cohort_id: true },
        where: { id: opts.input.id },
      });
      if (!checkProject) {
        throw readFailedNotFound("project");
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
      throw readFailedNotFound("project");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      project: theProject,
    };
  }),

  submission: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
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
      throw readFailedNotFound("submission");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      submission: theSubmission,
    };
  }),

  submissionByProject: loggedInProcedure
    .input(
      z.object({
        project_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const theSubmission = await opts.ctx.prisma.submission.findFirst({
        include: { submitter: true },
        where: {
          project_id: opts.input.project_id,
          submitter_id: opts.ctx.user.id,
          // deleted_at: null,
        },
      });
      if (!theSubmission) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: `The submission with the given project ID and user is not found.`,
        });
      }
      return {
        code: STATUS_OK,
        message: "Success",
        submission: theSubmission,
      };
    }),
};
