import { STATUS_OK } from "@/lib/status_code";
import { labProcedure, administratorProcedure } from "@/trpc/init";
import { LabStakeholderEnum, LabUseCaseStatus } from "@prisma/client";
import z from "zod";

export const updateLab = {
  // Student: update their own use case (draft/submitted only)
  useCase: labProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        tools_used: z.string().optional(),
        time_saved_hours: z.number().int().min(0).max(500).optional(),
        impact_rating: z.number().int().min(1).max(5).optional(),
        status: z.enum([LabUseCaseStatus.DRAFT, LabUseCaseStatus.SUBMITTED]).optional(),
      })
    )
    .mutation(async (opts) => {
      const member = opts.ctx.labMember;
      const existing = await opts.ctx.prisma.labUseCase.findUnique({
        where: { id: opts.input.id },
      });
      if (!existing || existing.member_id !== member.id) {
        throw new Error("Use case not found or not yours");
      }
      const { id, ...data } = opts.input;
      const updated = await opts.ctx.prisma.labUseCase.update({
        where: { id },
        data,
      });
      return { code: STATUS_OK, message: "Use case updated", useCase: updated };
    }),

  // Champion: review a use case (set status + note)
  reviewUseCase: labProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum([LabUseCaseStatus.REVIEWED, LabUseCaseStatus.APPROVED]),
        champion_note: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const champion = opts.ctx.labMember;
      if (champion.stakeholder_type !== LabStakeholderEnum.CHAMPION) {
        throw new Error("Only champions can review use cases");
      }
      const updated = await opts.ctx.prisma.labUseCase.update({
        where: { id: opts.input.id },
        data: {
          status: opts.input.status,
          champion_note: opts.input.champion_note,
          reviewed_by: champion.id,
          reviewed_at: new Date(),
        },
      });
      return { code: STATUS_OK, message: "Use case reviewed", useCase: updated };
    }),

  // Champion: resolve an obstacle
  resolveObstacle: labProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async (opts) => {
      const champion = opts.ctx.labMember;
      if (champion.stakeholder_type !== LabStakeholderEnum.CHAMPION) {
        throw new Error("Only champions can resolve obstacles");
      }
      const updated = await opts.ctx.prisma.labObstacle.update({
        where: { id: opts.input.id },
        data: { resolved: true, resolved_by: champion.id, resolved_at: new Date() },
      });
      return { code: STATUS_OK, message: "Obstacle resolved", obstacle: updated };
    }),

  // Student: mark coaching note as read
  markNoteRead: labProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async (opts) => {
      const member = opts.ctx.labMember;
      const note = await opts.ctx.prisma.labCoachingNote.findUnique({ where: { id: opts.input.id } });
      if (!note || note.student_id !== member.id) throw new Error("Note not found");
      await opts.ctx.prisma.labCoachingNote.update({
        where: { id: opts.input.id },
        data: { is_read: true },
      });
      return { code: STATUS_OK, message: "Marked as read" };
    }),

  // Admin: update company info
  company: administratorProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().optional(),
        industry: z.string().optional(),
        logo_url: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { id, ...data } = opts.input;
      const company = await opts.ctx.prisma.labCompany.update({ where: { id }, data });
      return { code: STATUS_OK, message: "Company updated", company };
    }),
};
