import { AUTHORIZATION_HEADER } from '../../constants';

export const createRequestPocketbaseRequestOptions = (ctx: {
  sessionData: { token: string };
}) => ({
  headers: {
    [AUTHORIZATION_HEADER]: ctx.sessionData.token,
  },
});
