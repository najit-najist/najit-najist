import {
  getPasswordStrength,
  PasswordStrength,
} from '@utils/getPasswordStrength';
import { z } from 'zod';

export const zodPassword = z
  .string()
  .min(8, { message: 'Heslo musí být alespoň osm znaků' })
  .max(22, { message: 'Heslo musí být maximálně 22 znaků' })
  .refine(
    (value) => getPasswordStrength(value).score !== PasswordStrength.BAD,
    {
      message: 'Heslo je přiliš slabé',
    }
  );
