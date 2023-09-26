import { zodSlug } from '../zodSlug';
import { z } from 'zod';

export const getOnePostInputSchema = z.object({
  slug: zodSlug,
});
