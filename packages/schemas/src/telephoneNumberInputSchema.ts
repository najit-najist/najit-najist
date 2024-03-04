import { z } from 'zod';

export const telephoneNumberInputSchema = z
  .string({
    required_error: 'Zadejte telefonní číslo',
  })
  .or(z.number())
  .transform(String)
  .refine(
    (value) => {
      return (
        value === undefined ||
        value === null ||
        value === '' ||
        String(value).length === 9
      );
    },
    {
      message: 'Musí být devět čísel bez mezer',
    }
  );
