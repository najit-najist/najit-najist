import { UserTokenData } from '@custom-types';
import { IronSessionData } from 'iron-session';
import { TokenService } from '@services';

export const deserializePocketToken = (
  token: NonNullable<NonNullable<IronSessionData['authContent']>['token']>
) => new TokenService().decode<UserTokenData>(token);
