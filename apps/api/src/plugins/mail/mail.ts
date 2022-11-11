import { config } from '@config';
import fp from 'fastify-plugin';
import path from 'path';
import Email from 'email-templates';
import nodemailer from 'nodemailer';
import { APP_ROOT } from '@constants';

declare module 'fastify' {
  interface FastifyInstance {
    mail: Email;
  }
}

export const mailPlugin = fp(async (server) => {
  server.log.info(`[Mail plugin]: Initialize (${config.env.isDev})`);

  let transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: {
      user: config.mail.user,
      pass: config.mail.password,
    },
  });

  const email = new Email({
    send: !config.env.isDev,
    preview: config.env.isDev,
    message: {
      from: '"Najít&Najist pošťák" <info@najitnajist.cz>',
    },
    views: {
      root: path.join(APP_ROOT, 'email-templates'),
      options: {
        extension: 'ejs',
      },
    },
    juiceResources: {
      webResources: {
        relativeTo: APP_ROOT,
      },
    },
    transport: transporter,
  });

  await server.decorate('mail', email);
});
