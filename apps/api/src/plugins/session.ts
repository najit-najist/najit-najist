import fp from 'fastify-plugin';
import fastifySession from '@fastify/session';
import { config } from '@config';
import { SESSION_NAME } from '@constants';

declare module 'fastify' {
  interface Session {
    userToken?: string;
  }
}

export const sessionPlugin = fp(async (server) => {
  server.log.info('[Session plugin] Initialize');
  const sessionInfo = config.server.session;

  await server.register(fastifySession as any, {
    secret: config.server.secrets.session,
    cookieName: SESSION_NAME,
    saveUninitialized: false,
    // TODO
    // store: SomeSessionStore,
    cookie: {
      domain: config.env.isDev ? null : sessionInfo.name,
      httpOnly: true,
      maxAge: sessionInfo.maxAge,
      secure: !config.env.isDev,
      sameSite: !config.env.isDev ? 'strict' : 'lax',
    },
  });
});
