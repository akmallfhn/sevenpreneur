import { Optional } from "@/lib/optional-type";
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
        status: undefined as Optional<StatusEnum>,
        name: undefined as Optional<{ contains: string; mode: "insensitive" }>,
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
      type CohortMemberItem = {
        id: string;
        full_name: string;
        email: string;
        phone_country_country_name: string | null;
        phone_country_phone_code: string | null;
        phone_country_emoji: string | null;
        phone_number: string | null;
        avatar: string | null;
        role_id: number;
        has_completed_survey: boolean;
        certificate_url: string | null;
        is_scout: boolean;
        attendance_count: number;
        submission_count: number;
      };
      // OR NULL: https://stackoverflow.com/a/29022738
      const memberList = await opts.ctx.prisma.$queryRaw<CohortMemberItem[]>`
SELECT
  users.id, users.full_name, users.email,
  phone_country_codes.country_name AS phone_country_country_name,
  phone_country_codes.phone_code AS phone_country_phone_code,
  phone_country_codes.emoji AS phone_country_emoji,
  users.phone_number, users.avatar, users.role_id,
  users.occupation IS NOT NULL AS has_completed_survey,
  users_cohorts.certificate_url, users_cohorts.is_scout,
  COALESCE(attendances_count.attendance_count, 0)::INTEGER AS attendance_count,
  COALESCE(submissions_count.submission_count, 0)::INTEGER AS submission_count
FROM users_cohorts
  LEFT JOIN users ON users_cohorts.user_id = users.id
  LEFT JOIN phone_country_codes ON users.phone_country_id = phone_country_codes.id
  LEFT JOIN (
    SELECT user_id,
      COUNT(check_in_at IS NOT NULL AND check_out_at IS NOT NULL OR NULL) AS attendance_count
    FROM attendances
      LEFT JOIN learnings ON attendances.learning_id = learnings.id
    WHERE learnings.cohort_id = ${opts.input.cohort_id}
    GROUP BY attendances.user_id
  ) AS attendances_count ON users.id = attendances_count.user_id
  LEFT JOIN (
    SELECT submitter_id, COUNT(submissions.document_url IS NOT NULL OR NULL) AS submission_count
    FROM submissions
      LEFT JOIN projects ON submissions.project_id = projects.id
    WHERE projects.cohort_id = ${opts.input.cohort_id}
    GROUP BY submissions.submitter_id
  ) AS submissions_count ON users.id = submissions_count.submitter_id
WHERE users_cohorts.cohort_id = ${opts.input.cohort_id}
ORDER BY users.role_id ASC, users.full_name ASC;`;
      const learningCount = await opts.ctx.prisma.learning.count({
        where: { cohort_id: opts.input.cohort_id },
      });
      const projectCount = await opts.ctx.prisma.project.count({
        where: { cohort_id: opts.input.cohort_id },
      });
      const returnedList = memberList.map((entry) => {
        const phoneCountry = !!entry.phone_country_phone_code
          ? {
              country_name: entry.phone_country_country_name,
              phone_code: entry.phone_country_phone_code,
              emoji: entry.phone_country_emoji,
            }
          : null;
        return {
          id: entry.id,
          full_name: entry.full_name,
          email: entry.email,
          phone_country: phoneCountry,
          phone_number: entry.phone_number,
          avatar: entry.avatar,
          role_id: entry.role_id,
          has_completed_survey: entry.has_completed_survey,
          certificate_url: entry.certificate_url,
          is_scout: entry.is_scout,
          learning_count: learningCount,
          attended_learning_count: entry.attendance_count,
          project_count: projectCount,
          submitted_project_count: entry.submission_count,
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
        name: undefined as Optional<{ contains: string; mode: "insensitive" }>,
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
      let whereOr: Optional<{ price_id: number | null }[]> = undefined;
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
          comment: entry.comment,
          is_favorite: entry.is_favorite,
          created_at: entry.created_at,
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
