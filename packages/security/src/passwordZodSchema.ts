import { z } from 'zod';

import { PasswordStrength, getPasswordStrength } from './getPasswordStrength';

export const passwordZodSchema = z
  .string()
  .min(8, { message: 'Heslo musí být alespoň osm znaků' })
  .max(22, { message: 'Heslo musí být maximálně 22 znaků' })
  .refine(
    (value) => getPasswordStrength(value).score !== PasswordStrength.BAD,
    {
      message: 'Heslo je přiliš slabé',
    },
  );
