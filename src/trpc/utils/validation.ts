import { z } from "zod";

/**
 * See https://github.com/colinhacks/zod/issues/63#issuecomment-1429974422
 */
export function stringNotBlank(): z.ZodString {
  return z.string().trim().min(1);
}

export function stringIsTimestampTz(): z.ZodISODateTime {
  return z.iso.datetime({ offset: true, local: false });
}

/**
 * UUID simple format (hexadecimal)
 */
export function stringIsUUID(): z.ZodString {
  return z.string().trim().min(32);
}

/**
 * Nanoid format (21 characters)
 */
export function stringIsNanoid(): z.ZodString {
  return z.string().trim().min(21);
}

/**
 * Number should be an integer, 1 or bigger
 */
export function numberIsID(): z.ZodInt {
  return z.int().min(1);
}

/**
 * Number should be an integer, 0 or bigger
 *
 * Administrator role has ID 0.
 */
export function numberIsRoleID(): z.ZodInt {
  return z.int().min(0);
}

/**
 * Number should be an integer, 1 or bigger
 */
export function numberIsPosInt(): z.ZodInt {
  return z.int().min(1);
}

/**
 * Number should be greater than 0
 */
export function numberIsPositive(): z.ZodNumber {
  return z.number().gt(0);
}

/**
 * Object only has one property `id` which is an ID (number)
 */
export function objectHasOnlyID() {
  return z.object({ id: numberIsID() });
}

/**
 * Object only has one property `id` which is a nano ID
 */
export function objectHasOnlyNanoid() {
  return z.object({ id: stringIsNanoid() });
}

/**
 * Object only has one property `id` which is a UUID
 */
export function objectHasOnlyUUID() {
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
