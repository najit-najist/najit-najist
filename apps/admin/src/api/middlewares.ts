import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from '@medusajs/framework/http';
import {
  createFindParams,
  createSelectParams,
} from '@medusajs/medusa/api/utils/validators';

import { postCreateProductBrandSchema } from './product_brands/validators';

export const getProductBrandsSchema = createFindParams();
export const getProductBrandSchema = createSelectParams();
export const getRecipesSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      matcher: '/product_brands',
      method: 'GET',
      middlewares: [
        validateAndTransformQuery(getProductBrandsSchema, {
          defaults: ['id', 'name', 'products.*'],
          isList: true,
        }),
      ],
    },
    {
      matcher: '/product_brands/[id]',
      method: 'GET',
      middlewares: [
        validateAndTransformQuery(getProductBrandSchema, {
          defaults: ['id', 'name', 'products.*'],
          isList: false,
        }),
      ],
    },
    {
      matcher: '/product_brands',
      method: 'POST',
      middlewares: [validateAndTransformBody(postCreateProductBrandSchema)],
    },
    {
      matcher: '/recipes',
      method: 'GET',
      middlewares: [
        validateAndTransformQuery(getRecipesSchema, {
          defaults: ['id', 'name'],
          isList: true,
        }),
      ],
    },
  ],
});
