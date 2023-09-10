import nodemailer from 'nodemailer';
import { config } from '@config';
import { logger } from '@logger';

export class MailService {
  private static transport = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: {
      user: config.mail.user,
      pass: config.mail.password,
    },
    from: `"Najít&Najist pošťák" <${config.mail.baseEmail}>`,
  });

  static async send({
    subject,
    to,
    body,
  }: {
    body: string;
    subject?: string;
    to: string | string[];
  }) {
    let result;
    try {
      result = await this.transport.sendMail({
        from: config.mail.baseEmail,
        to,
        subject: subject,
        html: body,
        replyTo: config.mail.baseEmail,
      });

      logger.info(
        {
          rejected: result?.rejected,
          response: result?.response,
          payload: { body, subject, to },
        },
        `MailService - success`
      );
    } catch (error) {
      logger.error(
        {
          error,
          payload: { body, subject, to },
        },
        'MailService - sending failed'
      );

      throw Error('Posílání emailu nebylo úspěšné.');
    }

    return result;
  }
}
