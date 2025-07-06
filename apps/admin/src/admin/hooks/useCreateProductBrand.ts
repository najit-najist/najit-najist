import { FetchError } from '@medusajs/js-sdk';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

import {
  type ProductBrandType,
  type CreateProductBrandOptions,
} from '../../modules/extended_store/models/product-brand';
import { sdk } from '../lib/sdk';
import { queryKeysFactory } from '../utils/queryKeysFactory';

const PRODUCT_BRAND_QUERY_KEY = 'customers' as const;
export const customersQueryKeys = queryKeysFactory(PRODUCT_BRAND_QUERY_KEY);

export const useCreateProductBrand = (
  options?: UseMutationOptions<
    { brand: ProductBrandType },
    FetchError,
    CreateProductBrandOptions
  >,
) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      sdk.client.fetch('/product_brands', {
        method: 'POST',
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: customersQueryKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
