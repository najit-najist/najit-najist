import { z } from 'zod';

export const zodSlug = z.string().trim().min(1).transform(decodeURIComponent);
