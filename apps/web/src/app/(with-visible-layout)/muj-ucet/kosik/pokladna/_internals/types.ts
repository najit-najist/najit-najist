import { userCartCheckoutInputSchema } from '@najit-najist/schemas';
import { z } from 'zod';

export type FormValues = z.input<typeof userCartCheckoutInputSchema>;
