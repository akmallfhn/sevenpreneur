import { STATUS_OK } from "@/lib/status_code";
import { labProcedure, administratorProcedure } from "@/trpc/init";
import { LabStakeholderEnum, LabUseCaseStatus } from "@prisma/client";
import z from "zod";

export const listLab = {
  // Returns the current lab member's profile + stakeholder type
  myProfile: labProcedure.query(async (opts) => {
    const member = opts.ctx.labMember;
    return { code: STATUS_OK, message: "Success", member };
  }),

  // Returns all use cases for the current member (student) or team (champion/sponsor)
  useCases: labProcedure
    .input(z.object({ status: z.nativeEnum(LabUseCaseStatus).optional() }).optional())
    .query(async (opts) => {
      const member = opts.ctx.labMember;
      const status = opts.input?.status;

      let where = {};

      if (member.stakeholder_type === LabStakeholderEnum.STUDENT) {
        where = { member_id: member.id, ...(status ? { status } : {}) };
      } else if (member.stakeholder_type === LabStakeholderEnum.CHAMPION) {
        // Get IDs of students in champion's team
        const team = await opts.ctx.prisma.labTeam.findUnique({
          where: { champion_id: member.id },
          include: { members: { select: { member_id: true } } },
        });
        const memberIds = team?.members.map((m) => m.member_id) ?? [];
        where = { member_id: { in: memberIds }, ...(status ? { status } : {}) };
      } else {
        // Sponsor: all use cases in their company
        const companyMembers = await opts.ctx.prisma.labMember.findMany({
          where: { company_id: member.company_id },
          select: { id: true },
        });
        const memberIds = companyMembers.map((m) => m.id);
        where = { member_id: { in: memberIds }, ...(status ? { status } : {}) };
      }

      const useCases = await opts.ctx.prisma.labUseCase.findMany({
        where,
        include: {
          member: {
            select: {
              id: true,
              department: true,
              job_title: true,
              user: { select: { id: true, full_name: true, avatar: true } },
            },
          },
          reviewer: {
            select: {
              user: { select: { id: true, full_name: true } },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      return { code: STATUS_OK, message: "Success", list: useCases };
    }),

  // Returns competency scores for the current member or their team
  competencyScores: labProcedure
    .input(z.object({ member_id: z.number().int().positive().optional() }).optional())
    .query(async (opts) => {
      const member = opts.ctx.labMember;
      const targetId = opts.input?.member_id ?? member.id;

      const scores = await opts.ctx.prisma.labCompetencyScore.findMany({
        where: { member_id: targetId },
        include: {
          assessor: {
            select: { user: { select: { id: true, full_name: true } } },
          },
        },
        orderBy: { competency_area: "asc" },
      });

      return { code: STATUS_OK, message: "Success", list: scores };
    }),

  // Returns coaching notes for the current member
  coachingNotes: labProcedure.query(async (opts) => {
    const member = opts.ctx.labMember;

    const isChampion = member.stakeholder_type === LabStakeholderEnum.CHAMPION;
    const where = isChampion
      ? { champion_id: member.id }
      : { student_id: member.id };

    const notes = await opts.ctx.prisma.labCoachingNote.findMany({
      where,
      include: {
        champion: { select: { user: { select: { id: true, full_name: true, avatar: true } } } },
        student: { select: { user: { select: { id: true, full_name: true, avatar: true } } } },
      },
      orderBy: { created_at: "desc" },
    });

    return { code: STATUS_OK, message: "Success", list: notes };
  }),

  // Returns obstacles for the current member or team
  obstacles: labProcedure.query(async (opts) => {
    const member = opts.ctx.labMember;

    let where = {};
    if (member.stakeholder_type === LabStakeholderEnum.STUDENT) {
      where = { member_id: member.id };
    } else if (member.stakeholder_type === LabStakeholderEnum.CHAMPION) {
      const team = await opts.ctx.prisma.labTeam.findUnique({
        where: { champion_id: member.id },
        include: { members: { select: { member_id: true } } },
      });
      const memberIds = team?.members.map((m) => m.member_id) ?? [];
      where = { member_id: { in: memberIds } };
    } else {
      const companyMembers = await opts.ctx.prisma.labMember.findMany({
        where: { company_id: member.company_id },
        select: { id: true },
      });
      where = { member_id: { in: companyMembers.map((m) => m.id) } };
    }

    const obstacles = await opts.ctx.prisma.labObstacle.findMany({
      where,
      include: {
        reporter: { select: { user: { select: { id: true, full_name: true, avatar: true } } } },
        resolver: { select: { user: { select: { id: true, full_name: true } } } },
      },
      orderBy: [{ resolved: "asc" }, { created_at: "desc" }],
    });

    return { code: STATUS_OK, message: "Success", list: obstacles };
  }),

  // Returns team members for a champion
  teamMembers: labProcedure.query(async (opts) => {
    const member = opts.ctx.labMember;

    const team = await opts.ctx.prisma.labTeam.findUnique({
      where: { champion_id: member.id },
      include: {
        members: {
          include: {
            member: {
              include: {
                user: { select: { id: true, full_name: true, avatar: true, email: true } },
                use_cases: { select: { id: true, status: true } },
                competency_scores: { select: { competency_area: true, score: true } },
                obstacles: { where: { resolved: false }, select: { id: true } },
              },
            },
          },
        },
      },
    });

    return { code: STATUS_OK, message: "Success", team };
  }),

  // Sponsor: executive overview — company-wide stats
  executiveOverview: labProcedure.query(async (opts) => {
    const member = opts.ctx.labMember;
    const companyId = member.company_id;

    const [allMembers, allTeams, allUseCases, allObstacles] = await Promise.all([
      opts.ctx.prisma.labMember.findMany({
        where: { company_id: companyId },
        include: {
          use_cases: { select: { status: true, time_saved_hours: true, competency_area: true } },
          competency_scores: { select: { competency_area: true, score: true } },
          obstacles: { select: { resolved: true } },
        },
      }),
      opts.ctx.prisma.labTeam.findMany({
        where: { company_id: companyId },
        include: {
          champion: { select: { user: { select: { full_name: true, avatar: true } }, department: true } },
          _count: { select: { members: true } },
        },
      }),
      opts.ctx.prisma.labUseCase.findMany({
        where: { member: { company_id: companyId } },
        select: { status: true, competency_area: true, time_saved_hours: true },
      }),
      opts.ctx.prisma.labObstacle.findMany({
        where: { reporter: { company_id: companyId } },
        select: { resolved: true },
      }),
    ]);

    const totalMembers = allMembers.length;
    const approvedUseCases = allUseCases.filter((u) => u.status === LabUseCaseStatus.APPROVED).length;
    const totalHoursSaved = allUseCases.reduce((sum, u) => sum + (u.time_saved_hours ?? 0), 0);
    const openObstacles = allObstacles.filter((o) => !o.resolved).length;

    // Avg competency score across all members
    const allScores = allMembers.flatMap((m) => m.competency_scores.map((s) => s.score));
    const avgCompetencyScore =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

    // Use cases by competency area
    const byArea: Record<string, number> = {};
    for (const uc of allUseCases) {
      byArea[uc.competency_area] = (byArea[uc.competency_area] ?? 0) + 1;
    }

    return {
      code: STATUS_OK,
      message: "Success",
      stats: {
        totalMembers,
        totalTeams: allTeams.length,
        approvedUseCases,
        totalHoursSaved,
        openObstacles,
        avgCompetencyScore,
        byArea,
      },
      teams: allTeams,
    };
  }),

  // Admin: list all lab members across all companies
  allMembers: administratorProcedure.query(async (opts) => {
    const members = await opts.ctx.prisma.labMember.findMany({
      include: {
        user: { select: { id: true, full_name: true, email: true, avatar: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: { created_at: "desc" },
    });
    return { code: STATUS_OK, message: "Success", list: members };
  }),

  // Admin: list all lab companies
  allCompanies: administratorProcedure.query(async (opts) => {
    const companies = await opts.ctx.prisma.labCompany.findMany({
      include: { _count: { select: { members: true, teams: true } } },
      orderBy: { created_at: "desc" },
    });
    return { code: STATUS_OK, message: "Success", list: companies };
  }),
};
