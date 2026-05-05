import { STATUS_CREATED } from "@/lib/status_code";
import { labProcedure, administratorProcedure } from "@/trpc/init";
import { LabCompetencyArea, LabStakeholderEnum, LabUseCaseStatus } from "@prisma/client";
import z from "zod";

export const createLab = {
  // Student: log a new AI use case
  useCase: labProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        competency_area: z.nativeEnum(LabCompetencyArea),
        tools_used: z.string().optional(),
        time_saved_hours: z.number().int().min(0).max(500).optional(),
        impact_rating: z.number().int().min(1).max(5).optional(),
        status: z.enum([LabUseCaseStatus.DRAFT, LabUseCaseStatus.SUBMITTED]).default(LabUseCaseStatus.DRAFT),
      })
    )
    .mutation(async (opts) => {
      const member = opts.ctx.labMember;
      const useCase = await opts.ctx.prisma.labUseCase.create({
        data: {
          member_id: member.id,
          title: opts.input.title,
          description: opts.input.description,
          competency_area: opts.input.competency_area,
          tools_used: opts.input.tools_used,
          time_saved_hours: opts.input.time_saved_hours,
          impact_rating: opts.input.impact_rating,
          status: opts.input.status,
        },
      });
      return { code: STATUS_CREATED, message: "Use case created", useCase };
    }),

  // Student: report an obstacle
  obstacle: labProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const member = opts.ctx.labMember;
      const obstacle = await opts.ctx.prisma.labObstacle.create({
        data: {
          member_id: member.id,
          title: opts.input.title,
          description: opts.input.description,
        },
      });
      return { code: STATUS_CREATED, message: "Obstacle reported", obstacle };
    }),

  // Champion: send a coaching note to a student
  coachingNote: labProcedure
    .input(
      z.object({
        student_id: z.number().int().positive(),
        note: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const champion = opts.ctx.labMember;
      if (champion.stakeholder_type !== LabStakeholderEnum.CHAMPION) {
        throw new Error("Only champions can send coaching notes");
      }
      const note = await opts.ctx.prisma.labCoachingNote.create({
        data: {
          champion_id: champion.id,
          student_id: opts.input.student_id,
          note: opts.input.note,
        },
      });
      return { code: STATUS_CREATED, message: "Note sent", note };
    }),

  // Champion: upsert a competency score for a student
  competencyScore: labProcedure
    .input(
      z.object({
        member_id: z.number().int().positive(),
        competency_area: z.nativeEnum(LabCompetencyArea),
        score: z.number().int().min(0).max(100),
        note: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const assessor = opts.ctx.labMember;
      if (assessor.stakeholder_type !== LabStakeholderEnum.CHAMPION) {
        throw new Error("Only champions can assess competency scores");
      }
      const score = await opts.ctx.prisma.labCompetencyScore.upsert({
        where: {
          member_id_competency_area: {
            member_id: opts.input.member_id,
            competency_area: opts.input.competency_area,
          },
        },
        update: {
          score: opts.input.score,
          note: opts.input.note,
          assessed_by: assessor.id,
          assessed_at: new Date(),
        },
        create: {
          member_id: opts.input.member_id,
          assessed_by: assessor.id,
          competency_area: opts.input.competency_area,
          score: opts.input.score,
          note: opts.input.note,
        },
      });
      return { code: STATUS_CREATED, message: "Score saved", score };
    }),

  // Any member: send an appreciation to another member
  appreciation: labProcedure
    .input(
      z.object({
        to_id: z.number().int().positive(),
        message: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const from = opts.ctx.labMember;
      const appreciation = await opts.ctx.prisma.labAppreciation.create({
        data: { from_id: from.id, to_id: opts.input.to_id, message: opts.input.message },
      });
      return { code: STATUS_CREATED, message: "Appreciation sent", appreciation };
    }),

  // Admin: enroll a company
  company: administratorProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        industry: z.string().optional(),
        logo_url: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const company = await opts.ctx.prisma.labCompany.create({ data: opts.input });
      return { code: STATUS_CREATED, message: "Company created", company };
    }),

  // Admin: add a member to a company
  member: administratorProcedure
    .input(
      z.object({
        user_id: z.string().uuid(),
        company_id: z.number().int().positive(),
        stakeholder_type: z.nativeEnum(LabStakeholderEnum).default(LabStakeholderEnum.STUDENT),
        department: z.string().optional(),
        job_title: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const member = await opts.ctx.prisma.labMember.create({ data: opts.input });
      return { code: STATUS_CREATED, message: "Member added", member };
    }),

  // Admin: create a team and assign a champion
  team: administratorProcedure
    .input(
      z.object({
        company_id: z.number().int().positive(),
        name: z.string().min(1),
        department: z.string().optional(),
        champion_id: z.number().int().positive(),
      })
    )
    .mutation(async (opts) => {
      const team = await opts.ctx.prisma.labTeam.create({ data: opts.input });
      return { code: STATUS_CREATED, message: "Team created", team };
    }),

  // Admin: assign a student to a team
  teamMember: administratorProcedure
    .input(
      z.object({
        team_id: z.number().int().positive(),
        member_id: z.number().int().positive(),
      })
    )
    .mutation(async (opts) => {
      const tm = await opts.ctx.prisma.labTeamMember.create({
        data: { team_id: opts.input.team_id, member_id: opts.input.member_id },
      });
      return { code: STATUS_CREATED, message: "Member assigned to team", tm };
    }),
};
