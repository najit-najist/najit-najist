import { t } from '@server/trpc';

import { addressRoutes } from './routes/address';
import { contactUsRoutes } from './routes/contacts-us';
import { newsletterRoutes } from './routes/newsletter';
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
  newsletter: newsletterRoutes,
  products: productsRoutes,
  orders: orderRoutes,
});

export const appRouter = t.mergeRouters(contactUsRoutes, normalRouter);
