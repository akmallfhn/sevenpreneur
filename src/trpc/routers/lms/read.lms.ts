import { Optional } from "@/lib/optional-type";
import {
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_OK,
} from "@/lib/status_code";
import {
  loggedInProcedure,
  publicProcedure,
  roleBasedProcedure,
} from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import {
  numberIsID,
  objectHasOnlyID,
  stringIsUUID,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { isEnrolledCohort, isEnrolledLearning } from "./util.lms";

export const readLMS = {
  cohort: publicProcedure.input(objectHasOnlyID()).query(async (opts) => {
    let whereClause = {
      id: opts.input.id,
      status: undefined as Optional<StatusEnum>,
      deleted_at: null,
    };
    if (!opts.ctx.user) {
      whereClause = {
        ...whereClause,
        status: StatusEnum.ACTIVE,
      };
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
    const theCohortWithCounts = {
      ...theCohort,
      total_learning_session: learningsCount,
      total_materials: modulesCount + materialsCount,
    };
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

  cohortMember: roleBasedProcedure([
    "Administrator",
    "Educator",
    "Class Manager",
  ])
    .input(
      z.object({
        user_id: stringIsUUID(),
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const theCohortMember = await opts.ctx.prisma.userCohort.findFirst({
        include: {
          user: { include: { phone_country: true } },
          cohort_price: { select: { name: true } },
        },
        where: {
          user_id: opts.input.user_id,
          cohort_id: opts.input.cohort_id,
        },
      });
      if (!theCohortMember) {
        throw readFailedNotFound("cohort member");
      }
      const learningsList = await opts.ctx.prisma.learning.findMany({
        select: {
          name: true,
          attendances: {
            select: { check_in_at: true, check_out_at: true },
            where: { user_id: opts.input.user_id },
          },
        },
        where: {
          cohort_id: opts.input.cohort_id,
          OR: [
            { price_id: null },
            { price_id: theCohortMember.cohort_price_id },
          ],
        },
        orderBy: [{ meeting_date: "asc" }, { created_at: "asc" }],
      });
      const attendancesList = learningsList.map((entry) => {
        if (entry.attendances.length < 1) {
          return {
            learning_name: entry.name,
            check_in_at: null,
            check_out_at: null,
            status: false,
          };
        }
        const attendance = entry.attendances[0];
        return {
          learning_name: entry.name,
          check_in_at: attendance.check_in_at,
          check_out_at: attendance.check_out_at,
          status: !!attendance.check_in_at && !!attendance.check_out_at,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        cohortMember: {
          id: theCohortMember.user_id,
          full_name: theCohortMember.user.full_name,
          email: theCohortMember.user.email,
          phone_country: theCohortMember.user.phone_country,
          phone_number: theCohortMember.user.phone_number,
          avatar: theCohortMember.user.avatar,
          cohort_id: theCohortMember.cohort_id,
          cohort_price_name: theCohortMember.cohort_price.name,
          certificate_url: theCohortMember.certificate_url,
          attendances: attendancesList,
        },
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
      const theCohortWithCounts = {
        ...theCohort,
        total_learning_session: learningsCount,
        total_materials: modulesCount + materialsCount,
      };
      return {
        code: STATUS_OK,
        message: "Success",
        cohort: theCohortWithCounts,
      };
    }),

  module: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    if (opts.ctx.user.role.name === "General User") {
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
    if (opts.ctx.user.role.name === "General User") {
      const theEnrolledCohort = await isEnrolledCohort(
        opts.ctx.prisma,
        opts.ctx.user.id,
        theLearning.cohort_id,
        "You're not allowed to read learnings of a cohort which you aren't enrolled."
      );
      if (
        theLearning.price_id !== null &&
        theLearning.price_id !== theEnrolledCohort.cohort_price_id
      ) {
        throw new TRPCError({
          code: STATUS_FORBIDDEN,
          message:
            "You're not allowed to read this special learning which you aren't paid.",
        });
      }
    }
    return {
      code: STATUS_OK,
      message: "Success",
      learning: theLearning,
    };
  }),

  material: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    if (opts.ctx.user.role.name === "General User") {
      const checkMaterial = await opts.ctx.prisma.material.findFirst({
        select: { learning_id: true },
        where: { id: opts.input.id },
      });
      if (!checkMaterial) {
        throw readFailedNotFound("material");
      }
      await isEnrolledLearning(
        opts.ctx.prisma,
        opts.ctx.user.id,
        checkMaterial.learning_id,
        "You're not allowed to read materials of a cohort/learning which you aren't enrolled."
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
    if (opts.ctx.user.role.name === "General User") {
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
      include: {
        cohort: { select: { name: true } },
      },
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
      project: {
        id: theProject.id,
        cohort_id: theProject.cohort_id,
        cohort_name: theProject.cohort.name,
        name: theProject.name,
        description: theProject.description,
        document_url: theProject.document_url,
        deadline_at: theProject.deadline_at,
        status: theProject.status,
        created_at: theProject.created_at,
        updated_at: theProject.updated_at,
      },
    };
  }),

  submission: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    let selectedUserId: Optional<string> = undefined;
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

  attendance: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const userId = opts.ctx.user.id;

      const attendance = await opts.ctx.prisma.attendance.findFirst({
        where: {
          learning_id: opts.input.learning_id,
          user_id: userId,
        },
      });

      return {
        code: STATUS_OK,
        message: "Success",
        check_in: !!attendance?.check_in_at,
        check_out: !!attendance?.check_out_at,
      };
    }),
};
