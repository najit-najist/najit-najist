import { z } from 'zod';

export const streetNameSchema = z
  .string({
    required_error: 'Vyplňte název ulice',
  })
  .refine(
    (value) => !/\d/.test(value),
    'Zadejte název ulice bez čísla popisného',
  );
