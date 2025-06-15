import { z } from "zod";

export function stringNotBlank(): z.ZodString {
  // https://github.com/colinhacks/zod/issues/63#issuecomment-1429974422
  return z.string().trim().min(1);
}

export function stringIsUUID(): z.ZodString {
  // UUID simple format (hexadecimal)
  return z.string().trim().min(32);
}

export function numberIsID(): z.ZodNumber {
  // Number should be 1 or bigger
  return z.number().finite().min(1);
}
