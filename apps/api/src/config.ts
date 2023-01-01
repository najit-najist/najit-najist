import { APP_NAME, SESSION_NAME, APP_ROOT } from '@constants';

// Server
const baseDomain = process.env.DOMAIN ?? 'najitnajist.cz';
const domains = (process.env.CORS_ALLOW ?? baseDomain).split(',');
const port = Number(process.env.PORT ?? 3001);

// Environment
const isDev = process.env.NODE_ENV !== 'production';

// Session
const sessionSecret =
  process.env.SESSION_SECRET_VALUE ?? 'supersecretconstantthatyoucannotbreak';
const jwtSecret =
  process.env.JWT_SECRET_VALUE ?? 'supersecretconstantthatyoucannotbreak';
const sessionLength = 84000;

// Email
const mailUser = String(process.env.MAIL_USERNAME);
const mailBaseEmail = String(process.env.MAIL_BASE_EMAIL ?? mailUser);
const mailPass = String(process.env.MAIL_PASSWORD);
const mailHost = process.env.MAIL_HOST;
const mailPort = Number(process.env.MAIL_PORT);

export const config = {
  app: {
    name: APP_NAME,
    root: APP_ROOT,
    version: 'dev123',
  },
  server: {
    port,
    domain: baseDomain,
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
      allowed: isDev ? '*' : domains,
    },
    /**
     * Pocketbase config
     */
    pb: {
      origin: String(process.env.POCKETBASE_ORIGIN),
      users: {
        contactForm: {
          user: String(process.env.POCKETBASE_CONTACT_FORM_USER),
          password: String(process.env.POCKETBASE_CONTACT_FORM_PASS),
        },
      },
    },
  },
  mail: {
    user: mailUser,
    baseEmail: mailBaseEmail,
    password: mailPass,
    host: mailHost,
    port: mailPort,
  },
  env: {
    isDev,
  },
};
