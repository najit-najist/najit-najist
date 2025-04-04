'use server';

import { ADMIN_EMAIL, APP_ORIGIN } from '@constants';
import ContactUsAdminReply from '@email/ContactUsAdminReply';
import ContactUsUserReply from '@email/ContactUsUserReply';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { contactFormReplies } from '@najit-najist/database/models';
import { render } from '@react-email/render';
import { MailService } from '@server/services/Mail.service';
import { createActionWithValidation } from '@server/utils/createActionWithValidation';
import { getLoggedInUser } from '@server/utils/server';
import { z } from 'zod';

export const contactUsAction = createActionWithValidation(
  z.object({
    email: z.string().email({ message: 'Zadejte validní email' }),
    firstName: z
      .string({ required_error: 'Zadejte Vaše jméno' })
      .min(1, 'Zadejte Vaše jméno'),
    lastName: z
      .string({ required_error: 'Zadejte Vaše příjmení' })
      .min(1, 'Zadejte Vaše příjmení'),
    message: z
      .string({ required_error: 'Zadejte Vaši zprávu' })
      .min(1, 'Zadejte Vaši zprávu'),
    telephone: z
      .string()
      .transform(async (value) => value || undefined)
      .nullish(),
  }),
  async (input) => {
    const loggedInUser = await getLoggedInUser().catch(() => undefined);

    const createdResponse = await database
      .insert(contactFormReplies)
      .values({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        message: input.message,
        telephone: input.telephone,
        userId: loggedInUser?.id,
      })
      .returning()
      .catch((error) => {
        logger.error(`[CONTACT_US] failed to create entry in database`, {
          error,
        });

        throw new Error('Error happened');
      });

    MailService.send({
      to: ADMIN_EMAIL,
      subject: 'Odpověď v kontaktním formuláři najitnajist.cz',
      body: await render(
        ContactUsAdminReply({
          email: input.email,
          fullName: `${input.firstName} ${input.lastName}`,
          message: input.message,
          telephone: input.telephone ?? undefined,
          siteOrigin: APP_ORIGIN,
        }),
      ),
      db: database,
    }).catch((error) => {
      logger.error(
        `[CONTACT_US] Failed to send email with contact form, but should be created in database`,
        { error, createdResponse },
      );
    });

    MailService.send({
      to: input.email,
      subject: 'Děkujeme za Váš zájem',
      body: await render(
        ContactUsUserReply({
          email: input.email,
          fullName: `${input.firstName} ${input.lastName}`,
          message: input.message,
          telephone: input.telephone ?? undefined,
          siteOrigin: APP_ORIGIN,
        }),
      ),
      db: database,
    }).catch((error) => {
      logger.error(`[CONTACT_US] email sending to user failed`, {
        error,
        input,
      });
    });

    logger.info('[CONTACT_US] finished', { input });

    return { didSubmit: true };
  },
);
