import { createTrpcRouter } from '@utils';

export const appRouter = createTrpcRouter();

export type AppRouter = typeof appRouter;
