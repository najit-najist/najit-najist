import { z } from 'zod';

import { dayjs } from './internals/dates';

export const stringOrDateToDateSchema = z
  .date()
  .or(z.string())
  .nullish()
  .transform((value) =>
    value instanceof Date || typeof value === 'string'
      ? dayjs(value).toDate()
      : null,
  )
  .optional();
