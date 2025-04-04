import { ADMIN_EMAIL } from '@constants';
import { logger } from '@logger/server';
import * as postmark from 'postmark';

const POSTMARK_TOKEN = String(process.env.POSTMARK_TOKEN);

export class MailService {
  private static transport = new postmark.ServerClient(POSTMARK_TOKEN);

  static async send({
    subject,
    to,
    body,
  }: {
    body: string;
    subject: string;
    to: string | string[];
  }) {
    let result;
    try {
      const toAsArray = Array.isArray(to) ? to : [to];

      const response = await this.transport.sendEmailBatch(
        toAsArray.map(
          (toItem): postmark.Message => ({
            From: `"Najít&Najist pošťák" <${ADMIN_EMAIL}>`,
            To: toItem,
            Subject: subject,
            HtmlBody: body,
            ReplyTo: ADMIN_EMAIL,
            MessageStream: 'outbound',
          }),
        ),
      );

      logger.info(`[EMAIL] Success`, {
        response,
        payload: { bodyLength: body.length, subject, to },
      });
    } catch (error) {
      logger.error(`[EMAIL] Error`, {
        error,
        payload: { body, subject, to },
      });

      throw Error('Posílání emailu nebylo úspěšné.');
    }

    return result;
  }
}
