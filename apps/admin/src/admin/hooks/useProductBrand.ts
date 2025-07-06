import { FetchError } from '@medusajs/js-sdk';
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ProductBrandType } from '../../modules/extended_store/models/product-brand';
import { sdk } from '../lib/sdk';

export const useProductBrand = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      { brand: ProductBrandType },
      FetchError,
      { brand: ProductBrandType },
      QueryKey
    >,
    'queryFn' | 'queryKey'
  >,
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      sdk.client.fetch<{ brand: ProductBrandType }>(
        `/product_brands/${id}`,
        {},
      ),
    queryKey: ['product', id],
    ...options,
  });

  return { ...data, ...rest };
};
