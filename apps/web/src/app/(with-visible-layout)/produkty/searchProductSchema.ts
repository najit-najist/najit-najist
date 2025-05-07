import { z } from 'zod';

import { ProductsPageSortBy } from './_types';

export const searchProductSchema = z.object({
  query: z.string().optional(),
  sort: z.nativeEnum(ProductsPageSortBy).optional(),
});
