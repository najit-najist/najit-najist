import { z } from 'zod';
import { baseCollectionSchema } from './base.collection.schema';

export const newsletterSubscription = baseCollectionSchema.extend({
  email: z.string().email(),
  uuid: z.string(),
});

export const subscribeToNewsletterSchema = newsletterSubscription.pick({
  email: true,
});
