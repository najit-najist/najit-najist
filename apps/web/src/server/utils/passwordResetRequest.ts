import { logger } from '@logger/server';
import { ProfileService } from '@server/services/Profile.service';
import { UserWithRelations } from '@server/services/UserService';

export const passwordResetRequest = async (user: UserWithRelations) => {
  try {
    await ProfileService.forUser(user).resetPassword();
  } catch (error) {
    logger.error('[FORGOTTEN_PASSWORD] Request user password reset failed', {
      userId: user.id,
      error,
    });

    throw error;
  }

  logger.info('[FORGOTTEN_PASSWORD] Request user password reset done', {
    userId: user.id,
  });

  return null;
};
