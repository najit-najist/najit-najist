import { config } from '@config';
import { logger } from '@logger';
import { pocketbase } from '@najit-najist/pb';

export const loginWithAccount = async (pocketbaseAccountName: string) => {
  const account = config.pb.accounts.get(pocketbaseAccountName);

  if (!account) {
    throw new Error('Missing account for contactForm');
  }

  try {
    const res = await pocketbase.admins.authWithPassword(
      account.email,
      account.password
    );

    // We just want token and other requests should not live from this authorized store
    pocketbase.authStore.clear();

    return res;
  } catch (error) {
    logger.error(
      { error, pocketbaseAccountName },
      'Failed to login with account in api controllers'
    );

    throw new Error('Error happened');
  }
};
