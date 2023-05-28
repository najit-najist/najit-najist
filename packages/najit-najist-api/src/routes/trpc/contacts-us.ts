import { config } from '@config';
import { t } from '@trpc';
import {
  PocketbaseCollections,
  User,
  UserRoles,
  UserStates,
} from '@custom-types';
import { contactUsSchema } from '@schemas';
import { z } from 'zod';
import { logger } from '@logger';
import { pocketbase } from '@najit-najist/pb';
import { AuthService, MailService, UserService } from '@services';

export const contactUsRoutes = t.router({
  contactSend: t.procedure
    .input(contactUsSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      let user: User | undefined = undefined;
      await config.pb.loginWithAccount('contactForm');

      // If user want to subscribe to our newsletter we will create basic account for them
      if (input.subscribeToNewsletter) {
        try {
          user = await UserService.getBy('email', input.email);

          if (!user.newsletter) {
            user = await pocketbase
              .collection(PocketbaseCollections.USERS)
              .update(String(user.id), { newsletter: true });
          }
        } catch (e) {
          logger.info(
            e,
            `User under ${input.email} does not exist, creating new...`
          );

          try {
            user = await UserService.create({
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
              username: input.email.split('@')[0],
              telephoneNumber: input.telephone ?? null,
              status: UserStates.SUBSCRIBED,
              role: UserRoles.NORMAL,
              newsletter: true,
            });
          } catch (error) {
            logger.error(
              error,
              'An error happened during contact form create unique user'
            );

            throw error;
          }
        }
      }

      const createdResponse = await pocketbase
        .collection(PocketbaseCollections.CONTACT_FORM_REPLIES)
        .create({
          email: user!.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
          message: input.message,
          telephone: input.telephone,
          subscribeToNewsletter: input.subscribeToNewsletter,
        })
        .catch((error) => {
          logger.error(error, `Failed to save a reponse from form to database`);

          throw new Error('Error happened');
        });

      MailService.send({
        to: config.mail.baseEmail,
        subject: 'Odpověď v kontaktním formuláři najitnajist.cz',
        payload: input,
        template: 'contact-us/admin',
      }).catch((error) => {
        logger.error(
          error,
          `Failed to send email with contact form, but should be created under id '${createdResponse.id}'`
        );
      });

      MailService.send({
        to: input.email,
        payload: input,
        template: 'contact-us/user',
      }).catch((error) => {
        logger.error(error, `Failed to send email to user`);
      });

      AuthService.clearAuthPocketBase();

      return true;
    }),
});
