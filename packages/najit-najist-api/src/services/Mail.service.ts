import Email from 'email-templates';
import nodemailer from 'nodemailer';
import { config } from '@config';
import path from 'path';
import { logger } from '@logger';

export type AvailableTemplates = 'contact-us/admin' | 'contact-us/user';

export class MailService {
  private static transport = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: {
      user: config.mail.user,
      pass: config.mail.password,
    },
  });

  public static mailer = new Email({
    send: !config.env.isDev,
    preview: config.env.isDev,
    message: {
      from: '"Najít&Najist pošťák" <info@najitnajist.cz>',
    },
    views: {
      root: path.resolve(path.join(config.app.root, 'email-templates')),
      options: {
        extension: 'ejs',
      },
    },
    juiceResources: {
      webResources: {
        relativeTo: config.app.root,
      },
    },
    transport: this.transport,
  });

  static async send({
    payload,
    subject,
    template,
    to,
  }: {
    payload: Record<string, any>;
    subject?: string;
    to: string | string[];
    template: AvailableTemplates;
  }) {
    let result;
    try {
      result = await this.mailer.send({
        template,
        message: {
          to,
          subject,
        },
        locals: payload,
      });
      logger.info(
        {
          rejected: result?.rejected,
          response: result?.response,
        },
        `MailService: Mail has been sent to email: ${to}`
      );
    } catch (e) {
      logger.error(e, 'Mail sending has error');

      throw Error('Posílání emailu nebylo úspěšné.');
    }

    return result;
  }
}
