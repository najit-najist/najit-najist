import { config } from '@config';
import { PocketBase } from '@najit-najist/pb';
import { AuthService } from '@services/Auth.service';
import { MailService } from '@services/Mail.service';
import { TokenService } from '@services/Token.service';
import { UserService } from '@services/User.service';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';

// Import type overrides
import 'iron-session/next';

export const createContext = ({ req }: CreateNextContextOptions) => {
  const context = {
    pb: new PocketBase(config.pb.origin),
    session: req.session,
    sessionData: undefined as
      | undefined
      | { userId: string; authModel: string; token: string },
  };

  const userService = new UserService({ pb: context.pb });

  return {
    services: {
      token: new TokenService(),
      mail: new MailService(),
      user: userService,
      auth: new AuthService({ userService }),
    },
    ...context,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
