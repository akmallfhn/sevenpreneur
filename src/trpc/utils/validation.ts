import { z } from "zod";

export function stringNotBlank(): z.ZodString {
  // https://github.com/colinhacks/zod/issues/63#issuecomment-1429974422
  return z.string().trim().min(1);
}

export function stringIsTimestampTz(): z.ZodString {
  return z.string().datetime({ offset: true, local: false });
}

export function stringIsUUID(): z.ZodString {
  // UUID simple format (hexadecimal)
  return z.string().trim().min(32);
}

export function stringIsNanoid(): z.ZodString {
  // Nanoid format (21 character)
  return z.string().trim().min(21);
}

export function numberIsID(): z.ZodNumber {
  // Number should be 1 or bigger
  return z.number().finite().min(1);
}

export function numberIsRoleID(): z.ZodNumber {
  // Number should be 0 or bigger
  // Administrator role has ID 0
  return z.number().finite().min(0);
}

export function numberIsPositive(): z.ZodNumber {
  // Number should be 1 or bigger
  return z.number().finite().min(1);
}

export function objectHasOnlyID() {
  // Object only has one property which is ID
  return z.object({ id: numberIsID() });
}
