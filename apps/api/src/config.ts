import { APP_NAME, SESSION_NAME } from '@constants';

// Server
const domain = 'najit-najist.cz';
const port = Number(process.env.PORT ?? 3000);

// Environment
const isDev = process.env.NODE_ENV !== 'production';

// Session
const sessionSecret =
  process.env.SESSION_SECRET_VALUE ?? 'supersecretconstantthatyoucannotbreak';
const jwtSecret =
  process.env.JWT_SECRET_VALUE ?? 'supersecretconstantthatyoucannotbreak';
const sessionLength = 84000;

// Email
const mailUser = '';
const mailPass = '';
const mailHost = '';
const mailPort = Number('');

export const config = {
  app: {
    name: APP_NAME,
  },
  server: {
    port,
    domain,
    session: {
      maxAge: sessionLength,
      name: SESSION_NAME,
    },
    secrets: {
      session: sessionSecret,
      jwt: jwtSecret,
      saltRounds: 10,
    },
    cors: {
      allowed: [domain],
    },
  },
  mail: {
    user: mailUser,
    password: mailPass,
    host: mailHost,
    port: mailPort,
  },
  env: {
    isDev,
  },
};
