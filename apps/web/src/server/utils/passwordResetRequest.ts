import { logger } from '@server/logger';
import { ProfileService } from '@server/services/Profile.service';
import { UserWithRelations } from '@server/services/UserService';

export const passwordResetRequest = async (user: UserWithRelations) => {
  try {
    await ProfileService.forUser(user).resetPassword();
  } catch (error) {
    logger.error(
      { userId: user.id, error },
      'Request user password reset failed'
    );

    throw error;
  }

  logger.info({ userId: user.id }, 'Request user password reset done');

  return null;
};
