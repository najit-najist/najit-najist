import { t } from '@lib';
import { UserRoles } from '@prisma/client';
import { getMeOutputSchema } from '@schemas';

export const profileRouter = t.router({
  me: t.procedure.output(getMeOutputSchema).query(async ({ ctx }) => {
    return {
      createdAt: '',
      email: 'hi@ondrejlangr.cz',
      firstName: 'Ondřej',
      lastName: 'Langr',
      id: 1,
      newsletter: false,
      role: UserRoles.ADMIN,
      telephoneNumber: '+420607445251',
    };
  }),
});
