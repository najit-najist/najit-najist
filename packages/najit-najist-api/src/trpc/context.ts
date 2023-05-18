import { pocketbase } from '@najit-najist/pb';
import { AuthService } from '@services/Auth.service';
import { MailService } from '@services/Mail.service';
import { RecipesService } from '@services/Recipes.service';
import { TokenService } from '@services/Token.service';
import { UserService } from '@services/User.service';
import { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

// Import type overrides
import 'iron-session/next';

export const createContext = ({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) => {
  const context = {
    req,
    resHeaders,
    sessionData: undefined as
      | undefined
      | { userId: string; authModel: string; token: string },
  };

  const userService = new UserService();
  const mailService = new MailService();

  return {
    services: {
      token: new TokenService(),
      mail: mailService,
      recipes: new RecipesService(),
      user: userService,
      auth: new AuthService({ userService }),
    },
    ...context,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
