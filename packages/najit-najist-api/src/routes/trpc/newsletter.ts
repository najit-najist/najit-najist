import { PocketbaseCollections, PocketbaseErrorCodes } from '@custom-types';
import { logger } from '@logger';
import { ClientResponseError, pocketbase } from '@najit-najist/pb';
import { t } from '@trpc';
import { loginWithAccount } from '@utils/pocketbase';
import { randomUUID } from 'crypto';
import { z } from 'zod';

import { createRequestPocketbaseRequestOptions } from '../../server';

export const newsletterRoutes = t.router({
  subscribe: t.procedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const pbAccount = await loginWithAccount('contactForm');

      try {
        await pocketbase
          .collection(PocketbaseCollections.NEWSLETTER_SUBSCRIPTIONS)
          .create(
            {
              email: input.email,
              uuid: randomUUID(),
            },
            createRequestPocketbaseRequestOptions({ sessionData: pbAccount })
          );
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
