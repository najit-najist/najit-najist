import { IMAGE_FILE_REGEX } from '@constants';
import { isFileBase64 } from '@utils/isFileBase64';
import { z } from 'zod';

export const updateUserInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z
    .string()
    .min(1)
    .refine((input) => {
      if (input.startsWith('data:')) {
        return isFileBase64(input, IMAGE_FILE_REGEX);
      }

      return true;
    })
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
