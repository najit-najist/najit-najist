import type { appRouter } from '@server/trpc';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type AppRouter = typeof appRouter;

export type AppRouterInput = inferRouterInputs<AppRouter>;
export type AppRouterOutput = inferRouterOutputs<AppRouter>;
