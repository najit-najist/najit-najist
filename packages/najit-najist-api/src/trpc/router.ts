import { t } from '@trpc';
import { postsRoute } from '../routes/trpc/posts';
import { contactUsRoutes } from '../routes/trpc/contacts-us';
import { profileRouter } from '../routes/trpc/profile';
import { usersRoute } from '../routes/trpc/users';
import { recipesRouter } from '../routes/trpc/recipes';
import { addressRoutes } from '../routes/trpc/address';
import { newsletterRoutes } from '../routes/trpc/newsletter';
import { productsRoutes } from '../routes/trpc/products';
import { orderRoutes } from '../routes/trpc/orders/orders';

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
