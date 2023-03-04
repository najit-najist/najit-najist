import { config } from '@config';
import { t } from '@lib';
import {
  PocketbaseCollections,
  User,
  UserRoles,
  UserStates,
} from '@custom-types';
import { contactUsSchema } from '@schemas';
import { z } from 'zod';

export const contactUsRoutes = t.router({
  contactSend: t.procedure
    .input(contactUsSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      let user: User | undefined = undefined;
      const contactFormAccount = config.pb.accounts.get('contactForm');

      if (!contactFormAccount) {
        throw new Error('Missing account for contactForm');
      }

      await ctx.pb
        .collection(PocketbaseCollections.API_CONTROLLERS)
        .authWithPassword(
          contactFormAccount.email,
          contactFormAccount.password
        );

      // If user want to subscribe to our newsletter we will create basic account for them
      if (input.subscribeToNewsletter) {
        try {
          user = await ctx.services.user.getBy('email', input.email);

          if (!user.newsletter) {
            user = await ctx.pb
              .collection(PocketbaseCollections.USERS)
              .update(String(user.id), { newsletter: true });
          }
        } catch (e) {
          ctx.log.info(
            e,
            `User under ${input.email} does not exist, creating new...`
          );

          try {
            user = await ctx.services.user.create({
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
              telephoneNumber: input.telephone ?? null,
              status: UserStates.SUBSCRIBED,
              role: UserRoles.NORMAL,
              newsletter: true,
            });
          } catch (error) {
            ctx.log.error(
              error,
              'An error happened during contact form create unique user'
            );

            throw error;
          }
        }
      }

      const createdResponse = await ctx.pb
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
          ctx.log.error(
            error,
            `Failed to save a reponse from form to database`
          );

          throw new Error('Error happened');
        });

      ctx.services.mail
        .send({
          to: config.mail.baseEmail,
          subject: 'Odpověď v kontaktním formuláři najitnajist.cz',
          payload: input,
          template: 'contact-us/admin',
        })
        .catch((error) => {
          ctx.log.error(
            error,
            `Failed to send email with contact form, but should be created under id '${createdResponse.id}'`
          );
        });

      ctx.services.mail
        .send({
          to: input.email,
          payload: input,
          template: 'contact-us/user',
        })
        .catch((error) => {
          ctx.log.error(error, `Failed to send email to user`);
        });

      ctx.pb.authStore.clear();

      return true;
    }),
});
