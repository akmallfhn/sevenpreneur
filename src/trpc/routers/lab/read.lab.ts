import { STATUS_OK } from "@/lib/status_code";
import { labProcedure } from "@/trpc/init";
import z from "zod";

export const readLab = {
  // Read a single use case by ID
  useCase: labProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async (opts) => {
      const useCase = await opts.ctx.prisma.labUseCase.findUnique({
        where: { id: opts.input.id },
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
            select: { user: { select: { id: true, full_name: true } } },
          },
        },
      });
      if (!useCase) throw new Error("Use case not found");
      return { code: STATUS_OK, message: "Success", useCase };
    }),

  // Read a single obstacle by ID
  obstacle: labProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async (opts) => {
      const obstacle = await opts.ctx.prisma.labObstacle.findUnique({
        where: { id: opts.input.id },
        include: {
          reporter: { select: { user: { select: { id: true, full_name: true, avatar: true } } } },
          resolver: { select: { user: { select: { id: true, full_name: true } } } },
        },
      });
      if (!obstacle) throw new Error("Obstacle not found");
      return { code: STATUS_OK, message: "Success", obstacle };
    }),
};
