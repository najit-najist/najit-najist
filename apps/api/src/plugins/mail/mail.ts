import { config } from '@config';
import fp from 'fastify-plugin';
import path from 'path';
import Email from 'email-templates';

declare module 'fastify' {
  interface FastifyInstance {
    mail: Email;
  }
}

export const mailPlugin = fp(async (server) => {
  server.log.info('[Mail plugin]: Initialize');

  const email = new Email({
    send: !config.env.isDev,
    preview: config.env.isDev,
    message: {
      from: '"Najít&Najist pošťák" <postmaster@najitnajist.cz>',
    },
    views: {
      root: path.join(__dirname, 'templates'),
      options: {
        extension: 'ejs',
      },
    },
    transport: {
      jsonTransport: true,
      host: config.mail.host,
      port: config.mail.port,
      secure: true,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    },
  });

  await server.decorate('mail', email);
});
