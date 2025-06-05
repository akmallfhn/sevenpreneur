import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  getHello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      const helloString = `Hello, ${opts.input.text}!`
      const result = await opts.ctx.prisma.$queryRaw<{hello: string}[]>`SELECT ${helloString} AS hello`;

      let greeting: string = `${helloString} (cannot get data from database)`;
      if (result.length > 0) {
        greeting = result[0]["hello"];
      }

      return {
        greeting,
      };
    }),
});

export type AppRouter = typeof appRouter;
