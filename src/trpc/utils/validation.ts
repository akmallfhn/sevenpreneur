import { z } from "zod";

export function stringNotBlank(): z.ZodString {
  // https://github.com/colinhacks/zod/issues/63#issuecomment-1429974422
  return z.string().trim().min(1);
}

export function stringIsTimestampTz(): z.ZodISODateTime {
  return z.iso.datetime({ offset: true, local: false });
}

export function stringIsUUID(): z.ZodString {
  // UUID simple format (hexadecimal)
  return z.string().trim().min(32);
}

export function stringIsNanoid(): z.ZodString {
  // Nanoid format (21 character)
  return z.string().trim().min(21);
}

export function numberIsID(): z.ZodInt {
  // Number should be an integer, 1 or bigger
  return z.int().min(1);
}

export function numberIsRoleID(): z.ZodInt {
  // Number should be an integer, 0 or bigger
  // Administrator role has ID 0
  return z.int().min(0);
}

export function numberIsPosInt(): z.ZodInt {
  // Number should be an integer, 1 or bigger
  return z.int().min(1);
}

export function numberIsPositive(): z.ZodNumber {
  // Number should be greater than 0
  return z.number().gt(0);
}

export function objectHasOnlyID() {
  // Object only has one property which is ID
  return z.object({ id: numberIsID() });
}

export function objectHasOnlyNanoid() {
  // Object only has one property which is nano ID
  return z.object({ id: stringIsNanoid() });
}

export function objectHasOnlyUUID() {
  // Object only has one property which is UUID
  return z.object({ id: z.uuid() });
}

export function arrayArticleBodyContent() {
  return z.array(
    z.object({
      index_order: numberIsPosInt(),
      sub_heading: stringNotBlank().nullable(),
      image_path: stringNotBlank().nullable(),
      image_desc: stringNotBlank().nullable(),
      content: stringNotBlank().nullable(),
    })
  );
}
