import { PocketbaseCollections } from '@custom-types';
import { logger } from '@logger';
import {
  renderAsync,
  ContactUsAdminReply,
  ContactUsUserReply,
} from '@najit-najist/email-templates';
import { pocketbase } from '@najit-najist/pb';
import { contactUsInputSchema } from '@schemas';
import { MailService } from '@services';
import { t } from '@trpc';
import { loginWithAccount } from '@utils/pocketbase';
import { z } from 'zod';

import { config } from '../../config';
import { AUTHORIZATION_HEADER } from '../../constants';

export const contactUsRoutes = t.router({
  contactSend: t.procedure
    .input(contactUsInputSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const pbAccount = await loginWithAccount('contactForm');

      const createdResponse = await pocketbase
        .collection(PocketbaseCollections.CONTACT_FORM_REPLIES)
        .create(
          {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            message: input.message,
            telephone: input.telephone,
            subscribeToNewsletter: false,
          },
          {
            headers: {
              [AUTHORIZATION_HEADER]: pbAccount.token,
            },
          }
        )
        .catch((error) => {
          logger.error(
            { error },
            `Contact Us Flow - Failed to create entry in database`
          );

          throw new Error('Error happened');
        });

      MailService.send({
        to: config.mail.baseEmail,
        subject: 'Odpověď v kontaktním formuláři najitnajist.cz',
        body: await renderAsync(
          ContactUsAdminReply({
            email: input.email,
            fullName: `${input.firstName} ${input.lastName}`,
            message: input.message,
            telephone: input.telephone ?? undefined,
            siteOrigin: config.app.origin,
          })
        ),
      }).catch((error) => {
        logger.error(
          { error, createdResponse },
          `Contact Us Flow - Failed to send email with contact form, but should be created in database`
        );
      });

      MailService.send({
        to: input.email,
        subject: 'Děkujeme za Váš zájem',
        body: await renderAsync(
          ContactUsUserReply({
            email: input.email,
            fullName: `${input.firstName} ${input.lastName}`,
            message: input.message,
            telephone: input.telephone ?? undefined,
            siteOrigin: config.app.origin,
          })
        ),
      }).catch((error) => {
        logger.error(
          { error, input },
          `Contact Us Flow - email sending to user failed`
        );
      });

      logger.info({ input }, 'Contact Us Flow - finished');

      return true;
    }),
});
