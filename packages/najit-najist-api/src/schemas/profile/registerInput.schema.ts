import { zodPassword } from '../zodPassword';
import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string(),
  password: zodPassword,
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
