import { productCreateInputSchema } from '@server/schemas/productCreateInputSchema';
import { z } from 'zod';

export type ViewType = 'create' | 'edit' | 'view';
export type ProductFormData = z.input<typeof productCreateInputSchema>;
