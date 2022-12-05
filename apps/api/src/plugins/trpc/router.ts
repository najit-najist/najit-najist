import { t } from '@lib';
import { contactUsRoutes } from '../../routes/trpc/contacts-us';

export const appRouter = t.mergeRouters(contactUsRoutes);
