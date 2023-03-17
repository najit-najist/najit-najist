import { t } from '@lib';
import { profileRouter } from '../../routes/trpc/profile';
import { contactUsRoutes } from '../../routes/trpc/contacts-us';

const normalRouter = t.router({
  profile: profileRouter,
});

export const appRouter = t.mergeRouters(contactUsRoutes, normalRouter);
