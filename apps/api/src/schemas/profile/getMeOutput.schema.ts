import { User, UserRoles } from '@prisma/client';
import { z } from 'zod';

export const getMeOutputSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string().or(z.date()),
  telephoneNumber: z.string().nullish(),
  role: z.nativeEnum(UserRoles),
  newsletter: z.boolean(),
});
