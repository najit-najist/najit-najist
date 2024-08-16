import { z } from 'zod';

export const createProductRawMaterialSchema = z.object({
  name: z.string(),
});
