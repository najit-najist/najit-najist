import {
  getPasswordStrength,
  PasswordStrength,
} from '@utils/getPasswordStrength';
import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(8, { message: 'Heslo musí být alespoň osm znaků' })
    .max(22, { message: 'Heslo musí být maximálně 22 znaků' })
    .refine(
      (value) => getPasswordStrength(value).score !== PasswordStrength.BAD,
      {
        message: 'Heslo je přiliš slabé',
      }
    ),
  firstName: z.string(),
  lastName: z.string(),
  telephoneNumber: z
    .string()
    .or(z.number())
    .transform(String)
    .refine(
      (value) => {
        return (
          value === undefined || value === '' || String(value).length === 9
        );
      },
      {
        message: 'Musí být devět čísel bez mezer',
      }
    ),
  newsletter: z.boolean().default(true),
});
