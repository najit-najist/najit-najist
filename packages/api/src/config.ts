import { APP_NAME, SESSION_NAME } from '@constants';

// Server
const baseDomain = process.env.DOMAIN ?? 'najitnajist.cz';
const domains = (process.env.CORS_ALLOW ?? baseDomain).split(',');

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
    root: '../../packages/najit-najist-api',
    version: 'dev123',
    origin: process.env.APP_ORIGIN ?? 'https://najitnajist.cz',
  },
  server: {
    domain: baseDomain,
    get session() {
      return {
        cookieName: SESSION_NAME,
        password: this.secrets.session,
        cookieOptions: {
          domain: isDev ? undefined : baseDomain,
          httpOnly: true,
          maxAge: sessionLength,
          secure: !isDev,
          sameSite: !isDev ? 'strict' : 'lax',
        },
      } as const;
    },
    secrets: {
      session: sessionSecret,
      jwt: jwtSecret,
      saltRounds: 10,
    },
    cors: {
      allowed: isDev ? '*' : domains,
    },
  },
  /**
   * Pocketbase config
   */
  pb: {
    origin: String(process.env.POCKETBASE_ORIGIN),
    /**
     * Pocketbase accounts for different purposes. We use this to minify attack by creating different users for each action to make access more granular
     */
    accounts: new Map(
      String(process.env.POCKETBASE_ACCOUNTS ?? '')
        .split('|')
        .filter((item) => !!item)
        .map((item) => {
          const [key, email, password] = item.split(';');

          if (!key || !email || !password) {
            throw new Error('Invalid POCKETBASE_ACCOUNTS env variable');
          }

          return [key, { password, email }];
        })
    ),
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
