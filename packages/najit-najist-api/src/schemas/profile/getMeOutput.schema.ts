import { UserRoles } from '@custom-types';
import { z } from 'zod';

export const getMeOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  createdAt: z.string().or(z.date()).optional(),
  telephoneNumber: z.string().nullish(),
  role: z.nativeEnum(UserRoles),
  newsletter: z.boolean(),
  username: z.string().optional(),
});
