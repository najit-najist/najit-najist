import {
  defineMiddlewares,
  validateAndTransformQuery,
} from '@medusajs/framework/http';
import { createFindParams } from '@medusajs/medusa/api/utils/validators';

export const GetProductBrandsSchema = createFindParams();
export const GetRecipesSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      matcher: '/product_brands',
      method: 'GET',
      middlewares: [
        validateAndTransformQuery(GetProductBrandsSchema, {
          defaults: ['id', 'name', 'products.*'],
          isList: true,
        }),
      ],
    },
    {
      matcher: '/recipes',
      method: 'GET',
      middlewares: [
        validateAndTransformQuery(GetRecipesSchema, {
          defaults: ['id', 'name'],
          isList: true,
        }),
      ],
    },
  ],
});
