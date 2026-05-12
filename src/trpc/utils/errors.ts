import LogError from "@/lib/prisma-log-error";
import { STATUS_NOT_FOUND } from "@/lib/status_code";
import { TRPCError } from "@trpc/server";

export function readFailedNotFound(nameSingular: string) {
  return new TRPCError({
    code: STATUS_NOT_FOUND,
    message: `The ${nameSingular} with the given ID is not found.`,
  });
}

export async function checkUpdateResult(
  length: number,
  nameSingular: string,
  namePlural: string,
  procedureName?: string
) {
  if (length < 1) {
    throw new TRPCError({
      code: STATUS_NOT_FOUND,
      message: `The selected ${nameSingular} is not found.`,
    });
  } else if (length > 1) {
    if (!procedureName) {
      procedureName = nameSingular;
    }
    await LogError(
      `update.${procedureName}`,
      `More-than-one ${namePlural} are updated at once.`
    );
  }
}

export async function checkDeleteResult(
  count: number,
  namePlural: string,
  procedureName: string
) {
  if (count > 1) {
    await LogError(
      `delete.${procedureName}`,
      `More-than-one ${namePlural} are deleted at once.`
    );
  }
}
