import { z } from 'zod';

export function stringNotBlank(): z.ZodString {
  // https://github.com/colinhacks/zod/issues/63#issuecomment-1429974422
  return z.string().trim().min(1);
}
