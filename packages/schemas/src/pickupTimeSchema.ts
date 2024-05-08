import { z } from 'zod';

import { DEFAULT_TIMEZONE, dayjs } from './internals/dates';

export const pickupTimeSchema = z
  .string({ required_error: 'Vyplňte čas vyzvednutí' })
  .min(1, 'Vyplňte čas vyzvednutí')
  .superRefine((valueAsString, ctx) => {
    const value = dayjs(valueAsString).tz(DEFAULT_TIMEZONE, true);
    if (!value.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vybraný datum a čas musí být ve správném formátu',
        fatal: true,
      });

      return;
    }

    const now = dayjs().tz(DEFAULT_TIMEZONE);
    const diffInMinutes = value.diff(now, 'minutes');

    if (diffInMinutes < 2 * 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Datum a čas musí být alespoň dvě hodiny od aktuálního času',
        fatal: true,
      });
    }
  });
