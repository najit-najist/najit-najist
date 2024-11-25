import { ADMIN_EMAIL } from '@constants';
import { logger } from '@logger/server';
import nodemailer from 'nodemailer';

const mailUser = String(process.env.MAIL_USERNAME);
const mailBaseEmail = String(process.env.MAIL_BASE_EMAIL ?? mailUser);
const mailPass = String(process.env.MAIL_PASSWORD);
const mailHost = process.env.MAIL_HOST;
const mailPort = Number(process.env.MAIL_PORT);

export class MailService {
  private static transport = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailPort === 465,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
    from: `"Najít&Najist pošťák" <${ADMIN_EMAIL}>`,
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
        from: ADMIN_EMAIL,
        to,
        subject: subject,
        html: body,
        replyTo: ADMIN_EMAIL,
      });

      logger.info(
        {
          rejected: result?.rejected,
          response: result?.response,
          payload: { bodyLength: body.length, subject, to },
        },
        `MailService - success`,
      );
    } catch (error) {
      logger.error(
        {
          error,
          payload: { body, subject, to },
        },
        'MailService - sending failed',
      );

      throw Error('Posílání emailu nebylo úspěšné.');
    }

    return result;
  }
}
