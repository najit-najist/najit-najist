import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import { config } from '@config';

export const cookiePlugin = fp(async (server) => {
  server.log.info('[Cookie plugin]: Initialize');
  const serverConfig = config.server;

  await server.register(fastifyCookie as any, {
    secret: serverConfig.secrets.session,
    parseOptions: {
      domain: config.env.isDev ? null : config.server.domain,
      httpOnly: true,
      maxAge: serverConfig.session.maxAge,
      secure: !config.env.isDev,
      sameSite: !config.env.isDev ? 'strict' : 'lax',
    },
  });
});
