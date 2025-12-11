import { STATUS_FORBIDDEN, STATUS_OK } from "@/lib/status_code";
import {
  loggedInProcedure,
  publicProcedure,
  roleBasedProcedure,
} from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsID,
  numberIsPositive,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { isEnrolledCohort, isEnrolledLearning } from "./util.lms";

type AttendanceCount = {
  learning_id: number;
  check_in_count: number;
  check_out_count: number;
  has_no_attendance: number;
};

export const listLMS = {
  cohorts: publicProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        deleted_at: null,
        status: undefined as StatusEnum | undefined,
        name: undefined as
          | { contains: string; mode: "insensitive" }
          | undefined,
      };

      if (!opts.ctx.user || opts.ctx.user.role.name !== "Administrator") {
        whereClause.status = StatusEnum.ACTIVE;
      }

      if (opts.input.keyword !== undefined) {
        whereClause.name = {
          contains: opts.input.keyword,
          mode: "insensitive",
        };
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.cohort.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const cohortList = await opts.ctx.prisma.cohort.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
          slug_url: true,
          start_date: true,
          end_date: true,
          cohort_prices: {
            select: {
              id: true,
              name: true,
              amount: true,
              status: true,
            },
          },
        },
        orderBy: [
          { end_date: "desc" },
          { start_date: "desc" },
          { published_at: "desc" },
        ],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = cohortList.map((entry) => {
        const returnedCohortPrices = entry.cohort_prices
          .filter((entry) =>
            !opts.ctx.user || opts.ctx.user.role.name !== "Administrator"
              ? entry.status === StatusEnum.ACTIVE
              : true
          )
          .map((entry) => {
            return {
              id: entry.id,
              name: entry.name,
              amount: entry.amount,
            };
          });
        return {
          id: entry.id,
          name: entry.name,
          image: entry.image,
          status: entry.status,
          slug_url: entry.slug_url,
          start_date: entry.start_date,
          end_date: entry.end_date,
          prices: returnedCohortPrices,
        };
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        keyword: opts.input.keyword,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  cohortPrices: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const cohortPricesList = await opts.ctx.prisma.cohortPrice.findMany({
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ amount: "asc" }, { created_at: "asc" }],
      });
      const returnedList = cohortPricesList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          amount: entry.amount,
          status: entry.status,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  cohortMembers: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.cohort_id,
          "You're not allowed to read members of a cohort which you aren't enrolled."
        );
      }
      const cohortMemberList = await opts.ctx.prisma.userCohort.findMany({
        include: { user: { include: { phone_country: true } } },
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ user: { role_id: "asc" } }, { user: { full_name: "asc" } }],
      });
      const returnedList = cohortMemberList.map((entry) => {
        return {
          id: entry.user_id,
          full_name: entry.user.full_name,
          email: entry.user.email,
          phone_country: entry.user.phone_country,
          phone_number: entry.user.phone_number,
          avatar: entry.user.avatar,
          role_id: entry.user.role_id,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  enrolledCohorts: loggedInProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        user_id: opts.ctx.user.id,
        cohort: {
          deleted_at: null,
        },
        name: undefined as
          | { contains: string; mode: "insensitive" }
          | undefined,
      };

      if (opts.input.keyword !== undefined) {
        whereClause.name = {
          contains: opts.input.keyword,
          mode: "insensitive",
        };
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.userCohort.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const cohortList = await opts.ctx.prisma.userCohort.findMany({
        select: {
          cohort: {
            select: {
              id: true,
              name: true,
              image: true,
              status: true,
              slug_url: true,
              start_date: true,
              end_date: true,
            },
          },
        },
        orderBy: [
          { cohort: { end_date: "desc" } },
          { cohort: { start_date: "desc" } },
          { cohort: { published_at: "desc" } },
        ],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = cohortList.map((entry) => {
        return {
          id: entry.cohort.id,
          name: entry.cohort.name,
          image: entry.cohort.image,
          status: entry.cohort.status,
          slug_url: entry.cohort.slug_url,
          start_date: entry.cohort.start_date,
          end_date: entry.cohort.end_date,
        };
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        keyword: opts.input.keyword,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  modules: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.cohort_id,
          "You're not allowed to read modules of a cohort which you aren't enrolled."
        );
      }
      const modulesList = await opts.ctx.prisma.module.findMany({
        where: { cohort_id: opts.input.cohort_id },
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
      });
      const returnedList = modulesList.map((entry) => {
        return {
          id: entry.id,
          cohort_id: entry.cohort_id,
          name: entry.name,
          document_url: entry.document_url,
          status: entry.status,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  learnings: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      let whereOr: { price_id: number | null }[] | undefined = undefined;
      if (opts.ctx.user.role.name === "General User") {
        const theEnrolledCohort = await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.cohort_id,
          "You're not allowed to read learnings of a cohort which you aren't enrolled."
        );
        whereOr = [
          { price_id: null },
          { price_id: theEnrolledCohort.cohort_price_id },
        ];
      }
      const learningsList = await opts.ctx.prisma.learning.findMany({
        include: {
          speaker: true,
          attendances: {
            select: { check_in_at: true, check_out_at: true },
            where: { user_id: opts.ctx.user.id },
          },
        },
        where: {
          cohort_id: opts.input.cohort_id,
          OR: whereOr,
        },
        orderBy: [{ meeting_date: "desc" }, { created_at: "desc" }],
      });
      const returnedList = learningsList.map((entry) => {
        const attended =
          entry.attendances.length == 1 && // only one attendance row for each (learning_id, user_id)
          !!entry.attendances[0].check_in_at &&
          !!entry.attendances[0].check_out_at;
        return {
          id: entry.id,
          cohort_id: entry.cohort_id,
          name: entry.name,
          method: entry.method,
          meeting_date: entry.meeting_date,
          meeting_url: entry.meeting_url,
          location_name: entry.location_name,
          location_url: entry.location_url,
          speaker: entry.speaker,
          status: entry.status,
          attended: attended,
        };
      });
      const attendanceCount = await opts.ctx.prisma.attendance.aggregate({
        _count: { _all: true },
        where: {
          user_id: opts.ctx.user.id,
          OR: [{ check_in_at: { not: null } }, { check_out_at: { not: null } }],
        },
      });
      return {
        code: STATUS_OK,
        message: "Success",
        attendance_count: attendanceCount._count._all,
        list: returnedList,
      };
    }),

  learnings_public: publicProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const learningsList = await opts.ctx.prisma.learning.findMany({
        include: { speaker: true },
        where: {
          cohort_id: opts.input.cohort_id,
          status: StatusEnum.ACTIVE,
        },
        orderBy: [{ meeting_date: "desc" }, { created_at: "desc" }],
      });
      const returnedList = learningsList.map((entry) => {
        return {
          name: entry.name,
          method: entry.method,
          speaker_name: entry.speaker?.full_name || null,
          speaker_avatar: entry.speaker?.avatar || null,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  materials: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledLearning(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.learning_id,
          "You're not allowed to read materials of a cohort/learning which you aren't enrolled."
        );
      }
      const materialsList = await opts.ctx.prisma.material.findMany({
        where: { learning_id: opts.input.learning_id },
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
      });
      const returnedList = materialsList.map((entry) => {
        return {
          id: entry.id,
          learning_id: entry.learning_id,
          name: entry.name,
          document_url: entry.document_url,
          status: entry.status,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  discussionStarters: loggedInProcedure
    .input(
      z.object({
        learning_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledLearning(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.learning_id,
          "You're not allowed to read learning discussions of a cohort/learning which you aren't enrolled."
        );
      }
      const discussionStartersList =
        await opts.ctx.prisma.discussionStarter.findMany({
          include: {
            user: {
              select: {
                full_name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
          where: { learning_id: opts.input.learning_id },
          orderBy: [{ created_at: "desc" }],
        });
      const returnedList = discussionStartersList.map((entry) => {
        const isOwner = entry.user_id === opts.ctx.user.id;
        return {
          id: entry.id,
          learning_id: entry.learning_id,
          is_owner: isOwner,
          full_name: entry.user.full_name,
          avatar: entry.user.avatar,
          message: entry.message,
          reply_count: entry._count.replies,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  discussionReplies: loggedInProcedure
    .input(
      z.object({
        starter_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        const theDiscussionStarter =
          await opts.ctx.prisma.discussionStarter.findFirst({
            select: { learning_id: true },
            where: {
              id: opts.input.starter_id,
            },
          });
        if (!theDiscussionStarter) {
          throw readFailedNotFound("discussion starter");
        }
        await isEnrolledLearning(
          opts.ctx.prisma,
          opts.ctx.user.id,
          theDiscussionStarter.learning_id,
          "You're not allowed to read learning discussions of a cohort/learning which you aren't enrolled."
        );
      }
      const discussionRepliesList =
        await opts.ctx.prisma.discussionReply.findMany({
          include: {
            user: {
              select: {
                full_name: true,
                avatar: true,
              },
            },
          },
          where: { starter_id: opts.input.starter_id },
          orderBy: [{ created_at: "desc" }],
        });
      const returnedList = discussionRepliesList.map((entry) => {
        const isOwner = entry.user_id === opts.ctx.user.id;
        return {
          id: entry.id,
          starter_id: entry.starter_id,
          is_owner: isOwner,
          full_name: entry.user.full_name,
          avatar: entry.user.avatar,
          message: entry.message,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  projects: loggedInProcedure
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      if (opts.ctx.user.role.name === "General User") {
        await isEnrolledCohort(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.cohort_id,
          "You're not allowed to read projects of a cohort which you aren't enrolled."
        );
        const projectsList = await opts.ctx.prisma.project.findMany({
          where: { cohort_id: opts.input.cohort_id },
          orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
        });
        const returnedList = projectsList.map((entry) => {
          return {
            id: entry.id,
            cohort_id: entry.cohort_id,
            name: entry.name,
            deadline_at: entry.deadline_at,
            status: entry.status,
            submission_percentage: 0,
          };
        });
        return {
          code: STATUS_OK,
          message: "Success",
          list: returnedList,
        };
      } else {
        const projectsList = await opts.ctx.prisma.project.findMany({
          include: { _count: { select: { submissions: true } } },
          where: { cohort_id: opts.input.cohort_id },
          orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
        });
        const memberCount = await opts.ctx.prisma.userCohort.aggregate({
          _count: true,
          where: { cohort_id: opts.input.cohort_id, user: { role_id: 3 } },
        });
        const returnedList = projectsList.map((entry) => {
          const submissionPercentage =
            (100 * entry._count.submissions) / memberCount._count;
          const submissionPercentageRounded =
            submissionPercentage > 50
              ? Math.floor(submissionPercentage) // Avoid 100% if there is still a missing submission
              : Math.ceil(submissionPercentage); // Avoid 0% if there is still a submission
          return {
            id: entry.id,
            cohort_id: entry.cohort_id,
            name: entry.name,
            deadline_at: entry.deadline_at,
            status: entry.status,
            submission_percentage: submissionPercentageRounded,
          };
        });
        return {
          code: STATUS_OK,
          message: "Success",
          list: returnedList,
        };
      }
    }),

  submissions: loggedInProcedure
    .input(
      z.object({
        project_id: numberIsID(),
        submitter_id: stringIsUUID().optional(),
      })
    )
    .query(async (opts) => {
      let selectedUserId = opts.input.submitter_id;
      if (opts.ctx.user.role.name === "General User") {
        if (!selectedUserId) {
          selectedUserId = opts.ctx.user.id;
        }
        if (opts.ctx.user.id !== selectedUserId) {
          throw new TRPCError({
            code: STATUS_FORBIDDEN,
            message:
              "You're not allowed to read another user's submissions list.",
          });
        }
      }
      const submissionsList = await opts.ctx.prisma.submission.findMany({
        include: { submitter: true },
        where: {
          project_id: opts.input.project_id,
          submitter_id: selectedUserId,
        },
        orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
      });
      const returnedList = submissionsList.map((entry) => {
        return {
          id: entry.id,
          project_id: entry.project_id,
          submitter_id: entry.submitter_id,
          full_name: entry.submitter.full_name,
          avatar: entry.submitter.avatar,
          created_at: entry.created_at,
          comment: entry.comment,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  attendance_counts: roleBasedProcedure([
    "Administrator",
    "Educator",
    "Class Manager",
  ])
    .input(
      z.object({
        cohort_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      type MemberCount = {
        member_count: number;
      };
      const cohortMemberCount = await opts.ctx.prisma.$queryRaw<MemberCount[]>`
SELECT COUNT(*)::INTEGER AS member_count
FROM users_cohorts
  LEFT JOIN users ON users_cohorts.user_id = users.id
WHERE cohort_id = ${opts.input.cohort_id}
  AND users.role_id = 3 /* General User */;`;
      const memberCount = cohortMemberCount[0].member_count;

      const returnedList = await opts.ctx.prisma.$queryRaw<AttendanceCount[]>`
SELECT
  learnings.id AS learning_id,
  COUNT(check_in_at)::INTEGER AS check_in_count,
  COUNT(check_out_at)::INTEGER AS check_out_count,
  (${memberCount} - COUNT(users.id))::INTEGER AS has_no_attendance
FROM learnings
  LEFT JOIN attendances ON learnings.id = attendances.learning_id
  LEFT JOIN users ON attendances.user_id = users.id
WHERE cohort_id = ${opts.input.cohort_id}
  AND (users.role_id IS NULL OR users.role_id = 3 /* General User */)
GROUP BY learnings.id
ORDER BY meeting_date ASC, learnings.created_at ASC;`;

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),
};
