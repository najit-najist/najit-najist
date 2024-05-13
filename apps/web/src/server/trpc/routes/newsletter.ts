import { database } from '@najit-najist/database';
import { eq } from '@najit-najist/database/drizzle';
import { userNewsletters } from '@najit-najist/database/models';
import { subscribeToNewsletterInputSchema } from '@najit-najist/schemas';

import { t } from '../instance';

export const newsletterRoutes = t.router({
  subscribe: t.procedure
    .input(subscribeToNewsletterInputSchema)
    .mutation(async ({ input }) => {
      const existing = await database.query.userNewsletters.findFirst({
        where: (schema, { eq }) => eq(schema.email, input.email),
      });

      if (!existing) {
        await database.insert(userNewsletters).values({
          email: input.email,
          enabled: true,
        });
      } else if (!existing.enabled) {
        await database
          .update(userNewsletters)
          .set({
            enabled: true,
          })
          .where(eq(userNewsletters.email, input.email));
      }

      return null;
    }),
});
