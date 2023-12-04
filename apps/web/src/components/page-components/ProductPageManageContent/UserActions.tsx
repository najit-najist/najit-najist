'use client';

import { Product, ProductStock } from '@najit-najist/api';
import { FC } from 'react';

import { AddToCartButton } from './AddToCartButton';

export const UserActions: FC<{
  productId: Product['id'];
  stock: ProductStock;
}> = ({ productId, stock }) => {
  return (
    <>
      <AddToCartButton productId={productId} disabled={!stock.count} />
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
