import { z } from "zod";

export const searchPostSchema = z.object({
  query: z.string().optional()
})
