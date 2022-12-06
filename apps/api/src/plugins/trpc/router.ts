import { createTrpcRouter } from '@utils';
import { contactUsRoutes } from 'routes/trpc/contacts-us';

export const appRouter = createTrpcRouter().merge(
  'contact-us.',
  contactUsRoutes()
);

export type AppRouter = typeof appRouter;
