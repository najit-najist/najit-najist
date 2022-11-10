import { FastifyBaseLogger, FastifyInstance } from 'fastify';
import Email from 'email-templates';
import { config } from '@config';

export class MailService {
  private logger: FastifyBaseLogger;
  private mailer: Email;

  constructor(server: FastifyInstance) {
    this.logger = server.log;
    this.mailer = server.mail;
  }

  async send({
    payload,
    subject,
    template,
    to,
  }: {
    payload: Record<string, any>;
    subject: string;
    to: string | string[];
    template: string;
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
      console.log({ ...config.mail, password: undefined });
      this.logger.info(
        `MailService: Mail has been sent to email: ${to} -- ${JSON.stringify({
          rejected: result?.rejected,
          response: result?.response,
        })}`
      );
    } catch (e) {
      this.logger.error('Mail sending has error', e);

      throw Error('Posílání emailu nebylo úspěšné.');
    }

    return result;
  }
}
