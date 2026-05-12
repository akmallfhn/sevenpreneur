import GetPrismaClient from "./prisma";

const prisma = GetPrismaClient();

export default async function LogError(
  context: string,
  ...messages: unknown[]
) {
  console.error(context + ":", ...messages);

  if (process.env.DOMAIN_MODE !== "local") {
    await prisma.errorLog.create({
      data: {
        context: context,
        message: messages.map(valueToJson),
      },
    });
  }
}

function valueToJson(v: unknown) {
  if (v instanceof Error) {
    const { name, message, stack } = v as Error;
    return { name, message, stack };
  }
  return JSON.parse(JSON.stringify(v));
}
