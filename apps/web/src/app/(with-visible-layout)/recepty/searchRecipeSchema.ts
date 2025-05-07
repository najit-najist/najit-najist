import { z } from "zod";

export const searchRecipeSchema = z.object({
  query: z.string().optional(),
  'difficulty[slug]': z.string().optional(),
  'type[slug]': z.string().optional()
})
