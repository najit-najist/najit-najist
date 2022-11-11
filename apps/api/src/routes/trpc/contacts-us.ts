import { config } from '@config';
import { contactUsSchema } from '@schemas';
import { createTrpcRouter } from '@utils';
import { z } from 'zod';

export const contactUsRoutes = () =>
  createTrpcRouter().mutation('send', {
    input: contactUsSchema,
    output: z.boolean(),
    resolve({ ctx, input }) {
      ctx.services.mail.send({
        to: config.mail.baseEmail,
        subject: 'Odpověď v kontaktním formuláři najitnajist.cz',
        payload: input,
        template: 'contact-us/admin',
      });

      ctx.services.mail.send({
        to: input.email,
        payload: input,
        template: 'contact-us/user',
      });

      return true;
    },
  });
