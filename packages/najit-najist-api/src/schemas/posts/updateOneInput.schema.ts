import { IMAGE_FILE_REGEX } from '@constants';
import { isFileBase64 } from '@utils/isFileBase64';
import { entrySchema } from '../entry.schema';
import { zodPublishedAt } from '../zodPublishedAt';
import { z } from 'zod';

export const updateOnePostInputSchema = z.object({
  title: z.string().optional(),
  publishedAt: zodPublishedAt,
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

export const likePostInputSchema = entrySchema.pick({ id: true });
export const dislikePostInputSchema = z.object({
  itemId: z.string(),
});

export type UpdateOnePostInput = z.input<typeof updateOnePostInputSchema>;
export type LikedPostInput = z.infer<typeof likePostInputSchema>;
export type DislikedPostInput = z.infer<typeof dislikePostInputSchema>;
