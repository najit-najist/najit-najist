import dayjs from 'dayjs';
import { z } from 'zod';

export const zodPublishedAt = z
  .date()
  .or(z.string())
  .nullish()
  .transform((value) =>
    value instanceof Date || typeof value === 'string'
      ? dayjs(value).toDate()
      : null
  )
  .optional();
