import { AuthService } from '@services/Auth.service';
import { MailService } from '@services/Mail.service';
import { TokenService } from '@services/Token.service';
import { UserService } from '@services/User.service';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    services: {
      token: TokenService;
      mail: MailService;
      user: UserService;
      auth: AuthService;
    };
  }
}

export const servicesPlugin = fp(async (server) => {
  server.log.info('[Services plugin] Initialize');

  const services: Record<any, any> = {};
  if (!server.services) {
    await server.decorate('services', services);
  }

  // The order should be maintained
  const entries = [
    { key: 'token', service: TokenService },
    { key: 'mail', service: MailService },
    { key: 'user', service: UserService },
    { key: 'auth', service: AuthService },
  ];

  for (const { key, service } of entries) {
    if (!services[key]) {
      services[key] = new service(server);
    }
  }
});
