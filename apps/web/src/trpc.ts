import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@najit-najist/api';

export const trpc = createTRPCReact<AppRouter>();
