import { z } from 'zod';

enum ERROR_MESSAGES {
  MISSING_NAME = 'Zadejte Vaše jméno, prosím',
  MISSING_SURNAME = 'Zadejte Vaše příjmení, prosím',
  MISSING_MAIL = 'Zadejte Váš email, prosím',
  MISSING_MESSAGE = 'Zadejte Vaši zprávu, prosím',
}

export const contactUsInputSchema = z.object({
  firstName: z
    .string({ required_error: ERROR_MESSAGES.MISSING_NAME })
    .min(2, ERROR_MESSAGES.MISSING_NAME),
  lastName: z
    .string({ required_error: ERROR_MESSAGES.MISSING_SURNAME })
    .min(2, ERROR_MESSAGES.MISSING_SURNAME),
  telephone: z.string().optional().nullable(),
  email: z
    .string({ required_error: ERROR_MESSAGES.MISSING_MAIL })
    .email({ message: 'Zadaný email není správný' })
    .toLowerCase(),
  message: z
    .string({ required_error: ERROR_MESSAGES.MISSING_MESSAGE })
    .min(1, ERROR_MESSAGES.MISSING_MESSAGE),
});
