'use server';

import { database } from '@najit-najist/database';
import { userNewsletters } from '@najit-najist/database/models';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

const schema = z.object({
  email: z
    .string()
    .email('Zadejte prosím správnou emailovou adresu')
    .optional()
    .transform(async (value) => {
      const loggedInUser = await getLoggedInUser().catch(() => undefined);

      // Automatically fallback to logged in user email when not provided
      if (loggedInUser) {
        return value || loggedInUser.email;
      }

      return value?.toLowerCase();
    })
    .refine(
      (value): value is string => !!value,
      'Zadejte prosím vaši emailovou adresu',
    ),

  nextValue: z.preprocess(
    (value) =>
      value !== undefined && value !== '' ? value === 'true' : undefined,
    z.boolean().optional(),
  ),
});

export const toggleNewsletterSubscriptionAction = async (
  prevState: any,
  input: z.input<typeof schema> | FormData,
) =>
  createActionWithValidation(schema, async ({ email, nextValue }) => {
    const existing = await database.query.userNewsletters.findFirst({
      where: (schema, { eq }) =>
        eq(sql`lower(${schema.email})`, email.toLowerCase()),
    });

    let subscribed = true;

    if (!existing) {
      await database.insert(userNewsletters).values({
        email,
        enabled: true,
      });
    } else {
      const [updated] = await database
        .update(userNewsletters)
        .set({
          enabled: nextValue ?? !existing.enabled,
        })
        .where(eq(userNewsletters.email, email))
        .returning();

      subscribed = updated.enabled ?? false;
    }

    return { subscribed, email: email ?? existing?.email };
  })(input);
