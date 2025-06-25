import { createTRPCRouter, loggedInProcedure } from "@/trpc/init";

export const helloRouter = createTRPCRouter({
  getHello: loggedInProcedure.query(async (opts) => {
    const helloString = `Hello, ${opts.ctx.user.full_name}!`;
    const result = await opts.ctx.prisma.$queryRaw<
      { hello: string }[]
    >`SELECT ${helloString} AS hello`;

    let greeting: string = `${helloString} (cannot get data from the database)`;
    if (result.length > 0) {
      greeting = result[0]["hello"];
    }

    return { greeting };
  }),
});
