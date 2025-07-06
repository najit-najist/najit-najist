import { z } from 'zod';

export const postCreateProductBrandSchema = z.object({
  name: z.string().min(1),
  url: z.string().nullish(),
});

export type PostCreateProductBrand = z.infer<
  typeof postCreateProductBrandSchema
>;
