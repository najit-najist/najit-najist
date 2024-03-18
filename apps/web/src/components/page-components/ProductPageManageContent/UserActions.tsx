import { ProductWithRelationsLocal } from '@custom-types';
import { ProductStock } from '@najit-najist/database/models';
import { FC } from 'react';

import { AddToCartButton } from './AddToCartButton';

export const UserActions: FC<{
  product: ProductWithRelationsLocal;
  stock?: ProductStock | null;
}> = ({ product, stock }) => {
  return (
    <>
      <AddToCartButton
        productId={product.id}
        disabled={typeof stock?.value === 'number' && !stock.value}
        productMetadata={{
          images: product.images,
          name: product.name,
          slug: product.slug,
        }}
      />
      {/* TODO */}
      {/* <Button
        className="border-2 border-red-500"
        appearance="spaceless"
        color="noColor"
      >
        <HeartIcon className="w-5" />
      </Button> */}
    </>
  );
};
