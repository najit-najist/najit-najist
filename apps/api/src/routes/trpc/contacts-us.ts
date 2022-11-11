import { config } from '@config';
import { UserRoles, UserStates } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { contactUsSchema } from '@schemas';
import { createTrpcRouter } from '@utils';
import { z } from 'zod';

export const contactUsRoutes = () =>
  createTrpcRouter().mutation('send', {
    input: contactUsSchema,
    output: z.boolean(),
    async resolve({ ctx, input }) {
      let user;
      // If user want to subscribe to our newsletter we will create basic account for them
      if (input.subscribeToNewsletter) {
        try {
          user = await ctx.services.user.getBy('email', input.email);
        } catch (e) {
          if (e instanceof NotFoundError) {
            user = await ctx.services.user.create({
              email: input.email,
              firstName: input.firstName,
              lastName: input.lastName,
              telephoneNumber: input.telephone ?? null,
              status: UserStates.SUBSCRIBED,
              role: UserRoles.NORMAL,
              newsletter: true,
              lastLoggedIn: null,
              notes: null,
            });
          }
        }
      }

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

      return true;
    },
  });
