import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '@najit-najist/api';

export const trpc = createReactQueryHooks<AppRouter>();
