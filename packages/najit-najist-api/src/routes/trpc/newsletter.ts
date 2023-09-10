import { subscribeToNewsletterSchema } from '@schemas';
import { t } from '@trpc';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { PocketbaseCollections, PocketbaseErrorCodes } from '@custom-types';
import { randomUUID } from 'crypto';
import { logger } from '@logger';
import { loginWithAccount } from '@utils/pocketbase';

export const newsletterRoutes = t.router({
  subscribe: t.procedure
    .input(subscribeToNewsletterSchema)
    .mutation(async ({ input }) => {
      await loginWithAccount('contactForm');

      try {
        await pocketbase
          .collection(PocketbaseCollections.NEWSLETTER_SUBSCRIPTIONS)
          .create({
            email: input.email,
            uuid: randomUUID(),
          });
      } catch (error) {
        if (error instanceof ClientResponseError) {
          const data = error.data.data;

          if (data.email?.code === PocketbaseErrorCodes.NOT_UNIQUE) {
            logger.info(input, `User already is subscribed`);
            return null;
          }
        }

        throw error;
      }

      return null;
    }),
});
