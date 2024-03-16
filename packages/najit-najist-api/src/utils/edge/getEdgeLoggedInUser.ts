import { database } from '@najit-najist/database';
import { type User, users } from '@najit-najist/database/models';
import { getTableName } from 'drizzle-orm';
import { IronSessionData } from 'iron-session/edge';

import { EntityNotFoundError } from '../../errors/EntityNotFoundError';

export type GetEdgeLoggedInUserOptions = {
  session: IronSessionData;
};

export const getEdgeLoggedInUser = async ({
  session,
}: GetEdgeLoggedInUserOptions): Promise<User> => {
  const { userId } = session.authContent ?? {};

  if (!userId) {
    throw new Error('User needs to be logged in first');
  }

  const item = await database.query.users.findFirst({
    where: (schema, { eq }) => eq(schema.id, userId),
  });

  if (!item) {
    throw new EntityNotFoundError({
      entityName: getTableName(users),
    });
  }

  return item;
};
