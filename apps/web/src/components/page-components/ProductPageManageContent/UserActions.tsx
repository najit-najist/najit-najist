import { Product, ProductStock } from '@najit-najist/api';
import { FC } from 'react';

import { AddToCartButton } from './AddToCartButton';

export const UserActions: FC<{
  product: Product;
  stock?: ProductStock | null;
}> = ({ product, stock }) => {
  return (
    <>
      <AddToCartButton
        productId={product.id}
        disabled={typeof stock?.count === 'number' && !stock.count}
        productMetadata={{
          images: product.images,
          name: product.name,
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
