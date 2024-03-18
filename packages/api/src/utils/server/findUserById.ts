import { database } from '@najit-najist/database';
import { User, users } from '@najit-najist/database/models';
import { getTableName } from 'drizzle-orm';

import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

export const findUserById = async (userId: User['id']) => {
  const item = await database.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    with: {
      address: true,
      telephone: true,
    },
  });

  if (!item) {
    throw new EntityNotFoundError({ entityName: getTableName(users) });
  }

  return item;
};
