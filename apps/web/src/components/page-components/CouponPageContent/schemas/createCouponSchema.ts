import { entityLinkSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export const createCouponSchema = z.object({
  name: z.string().min(1).max(12, 'Maximální délka je 12 znaků'),
  enabled: z.boolean().nullish(),
  reductionPercentage: z.coerce.number().min(0),
  reductionPrice: z.coerce.number().min(0),
  validFrom: z.coerce.date().nullish(),
  validTo: z.coerce.date().nullish(),
  onlyForCategories: z.array(entityLinkSchema).nullish(),
  onlyForProducts: z.array(entityLinkSchema).nullish(),
});
