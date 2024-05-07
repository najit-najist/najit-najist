import dayjs from 'dayjs';
import { z } from 'zod';

export const pickupTimeSchema = z
  .date({ required_error: 'Vyplňte čas vyzvednutí' })
  .or(z.string().transform((val) => dayjs(val).toDate()))
  .superRefine((value, ctx) => {
    const now = dayjs();
    const valueAsDay = dayjs(value);
    const diffInMinutes = valueAsDay.diff(now, 'minutes');

    if (diffInMinutes < 2 * 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Datum a čas musí být alespoň dvě hodiny od aktuálního času',
        fatal: true,
      });
    }
  });
