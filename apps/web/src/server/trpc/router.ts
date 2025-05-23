import { t } from '@server/trpc';

import { addressRoutes } from './routes/address';
import { orderRoutes } from './routes/orders/orders';
import { postsRoute } from './routes/posts';
import { productsRoutes } from './routes/products';
import { profileRouter } from './routes/profile';
import { recipesRouter } from './routes/recipes';
import { usersRoute } from './routes/users';

const normalRouter = t.router({
  profile: profileRouter,
  users: usersRoute,
  posts: postsRoute,
  recipes: recipesRouter,
  address: addressRoutes,
  products: productsRoutes,
  orders: orderRoutes,
});

export const appRouter = t.mergeRouters(normalRouter);
export const getTrpcCaller = t.createCallerFactory(appRouter);
