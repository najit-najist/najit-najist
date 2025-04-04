import { ADMIN_EMAIL } from '@constants';
import { logger } from '@logger/server';
import type { database } from '@najit-najist/database';
import {
  OutgoingEmailMessage,
  outgoingEmailMessages,
} from '@najit-najist/database/models';
import { inArray } from 'drizzle-orm';
import * as postmark from 'postmark';

const POSTMARK_TOKEN = String(process.env.POSTMARK_TOKEN);

export class MailService {
  private static transport = new postmark.ServerClient(POSTMARK_TOKEN);

  static async send({
    subject,
    to,
    body,
    db,
  }: {
    body: string;
    subject: string;
    to: string | string[];
    db:
      | typeof database
      | Parameters<Parameters<typeof database.transaction>[0]>[0];
  }) {
    let result;
    let createdDatabaseEntries: OutgoingEmailMessage[] = [];

    try {
      const toAsArray = Array.isArray(to) ? to : [to];

      const message = {
        From: `"Najít&Najist pošťák" <${ADMIN_EMAIL}>`,
        Subject: subject,
        HtmlBody: body,
        ReplyTo: ADMIN_EMAIL,
        MessageStream: 'outbound',
      } satisfies Omit<postmark.Message, 'To'>;

      createdDatabaseEntries = await db
        .insert(outgoingEmailMessages)
        .values(
          toAsArray.map((toItem) => ({
            htmlBody: message.HtmlBody,
            from: message.From,
            subject: message.Subject,
            to: toItem,
          })),
        )
        .returning();

      const response = await this.transport.sendEmailBatch(
        toAsArray.map(
          (toItem): postmark.Message => ({
            ...message,
            To: toItem,
          }),
        ),
      );

      logger.info(`[EMAIL] Success`, {
        postmarkResponse: response,
        inDatabase: createdDatabaseEntries.map((item) => item.id),
      });

      await db
        .update(outgoingEmailMessages)
        .set({ didSend: true })
        .where(
          inArray(
            outgoingEmailMessages.id,
            createdDatabaseEntries.map((item) => item.id),
          ),
        );
    } catch (error) {
      logger.error(`[EMAIL] Error`, {
        error,
        payload: { body, subject, to },
        inDatabase: createdDatabaseEntries.map((item) => item.id),
      });

      throw Error('Posílání emailu nebylo úspěšné.');
    }

    return result;
  }
}
