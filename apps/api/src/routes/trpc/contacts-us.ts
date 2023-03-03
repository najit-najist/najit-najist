import { config } from '@config';
import { User, UserRoles, UserStates } from '@custom-types';
import { faker } from '@faker-js/faker';
import { t } from '@lib';
import { contactUsSchema } from '@schemas';
import crypto from 'crypto';
import { z } from 'zod';

export const contactUsRoutes = t.router({
  contactSend: t.procedure
    .input(contactUsSchema)
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      let user: User | undefined = undefined;

      await ctx.pb
        .collection('api_controllers')
        .authWithPassword(
          config.server.pb.users.contactForm.user,
          config.server.pb.users.contactForm.password
        );

      // If user want to subscribe to our newsletter we will create basic account for them
      if (input.subscribeToNewsletter) {
        try {
          user = await ctx.pb
            .collection('users')
            .getFirstListItem<User>(`email="${input.email}"`);

          if (!user.newsletter) {
            user = await ctx.pb
              .collection('users')
              .update(String(user.id), { newsletter: true });
          }
        } catch (e) {
          ctx.log.info(
            e,
            `User under ${input.email} does not exist, creating new...`
          );

          try {
            const password = faker.internet.password(12);
            user = await ctx.pb.collection('users').create({
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
              username: input.email.split('@')[0],
              telephoneNumber: input.telephone ?? null,
              status: UserStates.SUBSCRIBED,
              role: UserRoles.NORMAL,
              newsletter: true,
              newsletterUuid: crypto.randomUUID(),
              lastLoggedIn: null,
              password,
              passwordConfirm: password,
              notes: null,
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

      await ctx.pb.collection('contact_form_replies').create({
        email: user!.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        message: input.message,
        telephone: input.telephone,
        subscribeToNewsletter: input.subscribeToNewsletter,
      });

      ctx.services.mail
        .send({
          to: config.mail.baseEmail,
          subject: 'Odpověď v kontaktním formuláři najitnajist.cz',
          payload: input,
          template: 'contact-us/admin',
        })
        .catch(() => {});

      ctx.services.mail
        .send({
          to: input.email,
          payload: input,
          template: 'contact-us/user',
        })
        .catch(() => {});

      ctx.pb.authStore.clear();

      return true;
    }),
});
