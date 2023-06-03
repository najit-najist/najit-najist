import { IMAGE_FILE_REGEX } from '@constants';
import { isFileBase64 } from '@utils/isFileBase64';
import { z } from 'zod';

export const updateOnePostInputSchema = z.object({
  title: z.string().optional(),
  publishedAt: z.date().nullable().optional(),
  content: z.record(z.any()).optional(),
  description: z.string().optional(),
  image: z
    .string()
    .refine((input) => {
      if (input.startsWith('data:')) {
        return isFileBase64(input, IMAGE_FILE_REGEX);
      }

      return true;
    })
    .optional(),
});

export type UpdateOnePostInput = z.infer<typeof updateOnePostInputSchema>;
