import { t } from '@lib';
import { profileRouter } from '../../routes/trpc/profile';
import { contactUsRoutes } from '../../routes/trpc/contacts-us';
import { usersRoute } from '../../routes/trpc/users';

const normalRouter = t.router({
  profile: profileRouter,
  users: usersRoute,
});

export const appRouter = t.mergeRouters(contactUsRoutes, normalRouter);
