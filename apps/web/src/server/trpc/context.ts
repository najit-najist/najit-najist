import { EntityLink } from '@najit-najist/schemas';
import { UserWithRelations } from '@server/services/UserService';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { setSessionToCookies } from '@server/utils/setSessionToCookies';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { IronSessionData } from 'iron-session';
// Import type overrides
import 'iron-session';
import {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/compiled/@edge-runtime/cookies';

type SessionData = IronSessionData & {
  user?: UserWithRelations;
  cartId?: EntityLink['id'];
};

export const createContext = ({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) => {
  const context = {
    resHeaders,
    sessionData: undefined as undefined | SessionData,
    async updateSessionDataValue<K extends keyof Omit<SessionData, 'user'>>(
      key: K,
      value: SessionData[K],
    ) {
      const cookies = new ResponseCookies(resHeaders);
      const session = await getSessionFromCookies({
        cookies: cookies as unknown as RequestCookies,
      });

      if (this.sessionData) {
        this.sessionData[key] = value;
      }

      return setSessionToCookies({ ...session, [key]: value }, cookies);
    },
  };

  return context;
};

export type Context = Awaited<ReturnType<typeof createContext>>;
