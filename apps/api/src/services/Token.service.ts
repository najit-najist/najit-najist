import { FastifyInstance } from 'fastify';
import { JWT } from '@fastify/jwt';

export class TokenService {
  #jwt: JWT;

  constructor(server: FastifyInstance) {
    this.#jwt = server.jwt;
  }

  generate(payload: { id: string }) {
    return this.#jwt.sign(payload, {
      expiresIn: '1d',
    });
  }

  verify(token: string) {
    return this.#jwt.verify(token) as { id: string };
  }
}
