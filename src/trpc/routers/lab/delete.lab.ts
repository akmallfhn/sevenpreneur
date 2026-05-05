import { STATUS_OK } from "@/lib/status_code";
import { labProcedure, administratorProcedure } from "@/trpc/init";
import { LabUseCaseStatus } from "@prisma/client";
import z from "zod";

export const deleteLab = {
  // Student: delete their own draft use case
  useCase: labProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async (opts) => {
      const member = opts.ctx.labMember;
      const existing = await opts.ctx.prisma.labUseCase.findUnique({
        where: { id: opts.input.id },
      });
      if (!existing || existing.member_id !== member.id) {
        throw new Error("Use case not found or not yours");
      }
      if (existing.status !== LabUseCaseStatus.DRAFT) {
        throw new Error("Only draft use cases can be deleted");
      }
      await opts.ctx.prisma.labUseCase.delete({ where: { id: opts.input.id } });
      return { code: STATUS_OK, message: "Use case deleted" };
    }),

  // Student: delete their own obstacle
  obstacle: labProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async (opts) => {
      const member = opts.ctx.labMember;
      const existing = await opts.ctx.prisma.labObstacle.findUnique({
        where: { id: opts.input.id },
      });
      if (!existing || existing.member_id !== member.id) {
        throw new Error("Obstacle not found or not yours");
      }
      await opts.ctx.prisma.labObstacle.delete({ where: { id: opts.input.id } });
      return { code: STATUS_OK, message: "Obstacle deleted" };
    }),

  // Admin: remove a member from the lab
  member: administratorProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async (opts) => {
      await opts.ctx.prisma.labMember.delete({ where: { id: opts.input.id } });
      return { code: STATUS_OK, message: "Member removed" };
    }),

  // Admin: delete a team
  team: administratorProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async (opts) => {
      await opts.ctx.prisma.labTeam.delete({ where: { id: opts.input.id } });
      return { code: STATUS_OK, message: "Team deleted" };
    }),
};
