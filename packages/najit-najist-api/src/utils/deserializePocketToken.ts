import { UserTokenData } from '../types/UserTokenData.js';
import { IronSessionData } from 'iron-session';
import { TokenService } from '../services/Token.service.js';

export const deserializePocketToken = (
  token: NonNullable<NonNullable<IronSessionData['authContent']>['token']>
) => new TokenService().decode<UserTokenData>(token);
