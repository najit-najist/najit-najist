import { IMAGE_FILE_REGEX } from '@constants';
import { isFileBase64 } from '@utils/isFileBase64';
import { z } from 'zod';

export const createPostInputSchema = z.object({
  title: z.string().min(2, 'Minimálně dva znaky'),
  publishedAt: z.date().nullable().optional(),
  content: z.record(z.any()).optional(),
  description: z.string().min(2, 'Minimálně dva znaky'),
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

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
