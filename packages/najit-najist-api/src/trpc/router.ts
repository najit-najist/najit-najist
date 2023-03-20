import { t } from '@trpc';
import { contactUsRoutes } from '../routes/trpc/contacts-us';
import { profileRouter } from '../routes/trpc/profile';
import { usersRoute } from '../routes/trpc/users';

const normalRouter = t.router({
  profile: profileRouter,
  users: usersRoute,
});

export const appRouter = t.mergeRouters(contactUsRoutes, normalRouter);
