import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { z } from 'zod';

export const helloRouter = createTRPCRouter({
  getHello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      const helloString = `Hello, ${opts.input.text}!`
      const result = await opts.ctx.prisma.$queryRaw<{ hello: string }[]>`SELECT ${helloString} AS hello`;

      let greeting: string = `${helloString} (cannot get data from database)`;
      if (result.length > 0) {
        greeting = result[0]['hello'];
      }

      return { greeting };
    }),
});
