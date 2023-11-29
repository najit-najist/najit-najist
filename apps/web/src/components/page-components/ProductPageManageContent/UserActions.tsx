'use client';

import { Product, ProductStock } from '@najit-najist/api';
import { Button, toast } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { FC } from 'react';

export const UserActions: FC<{
  productId: Product['id'];
  stock: ProductStock;
}> = ({ productId, stock }) => {
  const utils = trpc.useUtils();
  const { mutateAsync: addToCart, isLoading } =
    trpc.profile.cart.products.add.useMutation();

  const handleAddToCartClick = async () => {
    await toast.promise(
      // add to cart and refetch newest cart for client
      addToCart({ product: { id: productId } }).then(() =>
        utils.profile.cart.products.get.many.invalidate()
      ),
      {
        loading: 'Přídávám do košíku',
        success: <b>Produkt přidán!</b>,
        error: (error) => (
          <b>Nemohli jsme přidat produkt do košíku. {error.message}</b>
        ),
      }
    );
  };

  return (
    <>
      <Button
        isLoading={isLoading}
        disabled={!stock.count}
        appearance="spaceless"
        className="px-6 py-3"
        onClick={handleAddToCartClick}
      >
        {!stock.count ? 'Dočasně nedostupné' : 'Přidat do košíku'}
      </Button>
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
