import { STATUS_NOT_FOUND } from "@/lib/status_code";
import { TRPCError } from "@trpc/server";

export function readFailedNotFound(nameSingular: string) {
  return new TRPCError({
    code: STATUS_NOT_FOUND,
    message: `The ${nameSingular} with the given ID is not found.`,
  });
}

export function checkUpdateResult(
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
    console.error(
      `update.${procedureName}: More-than-one ${namePlural} are updated at once.`
    );
  }
}

export function checkDeleteResult(
  count: number,
  namePlural: string,
  procedureName: string
) {
  if (count > 1) {
    console.error(
      `delete.${procedureName}: More-than-one ${namePlural} are deleted at once.`
    );
  }
}
