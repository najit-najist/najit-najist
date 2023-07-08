import { z } from 'zod';

/**
 * Contains usual fields for entry type
 */
export const entrySchema = z.object({
  id: z.string(),
  updated: z.string(),
  created: z.string(),
});

export type EntryType = z.infer<typeof entrySchema>;
