import { z } from 'zod';
import { baseCollectionSchema } from './base.collection.schema';

export const authCollectionSchema = baseCollectionSchema.extend({
  username: z.string(),
  email: z.string().email('Musí být validní email'),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
});
