import { config } from '@config';
import { t } from '@trpc';
import { PocketbaseCollections } from '@custom-types';
import { contactUsSchema } from '@schemas';
import { z } from 'zod';
import { logger } from '@logger';
import { pocketbase } from '@najit-najist/pb';
import { AuthService, MailService } from '@services';
import { loginWithAccount } from '@utils/pocketbase';

export const contactUsRoutes = t.router({
  contactSend: t.procedure
    .input(contactUsSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      await loginWithAccount('contactForm');

      const createdResponse = await pocketbase
        .collection(PocketbaseCollections.CONTACT_FORM_REPLIES)
        .create({
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          message: input.message,
          telephone: input.telephone,
          subscribeToNewsletter: false,
        })
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
        payload: input,
        template: 'contact-us/admin',
      }).catch((error) => {
        logger.error(
          { error, createdResponse },
          `Contact Us Flow - Failed to send email with contact form, but should be created in database`
        );
      });

      MailService.send({
        to: input.email,
        payload: input,
        template: 'contact-us/user',
      }).catch((error) => {
        logger.error(
          { error, input },
          `Contact Us Flow - email sending to user failed`
        );
      });

      AuthService.clearAuthPocketBase();

      logger.info({ input }, 'Contact Us Flow - finished');

      return true;
    }),
});
