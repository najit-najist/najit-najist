'use client';

import { PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Product } from '@najit-najist/api';
import { Button, Tooltip, toast } from '@najit-najist/ui';
import { trpc } from '@trpc';
import clsx from 'clsx';
import { FC, ReactElement, ReactNode } from 'react';

export const AddToCartButton: FC<{
  productId: Product['id'];
  disabled?: boolean;
  withoutText?: boolean;
  withIcon?: boolean;
}> = ({ productId, disabled, withoutText, withIcon }) => {
  const utils = trpc.useUtils();
  const { mutateAsync: addToCart, isLoading } =
    trpc.profile.cart.products.add.useMutation();
  let buttonText: ReactNode = null;
  let contentBeforeText: ReactElement | null = null;

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

  if (!withoutText) {
    buttonText = disabled ? 'Dočasně nedostupné' : 'Přidat do košíku';
  }

  if (withIcon) {
    contentBeforeText = (
      <>
        <ShoppingBagIcon className="w-5 h-5" />
        <PlusIcon
          className="w-3.5 h-3.5 absolute top-0 right-0 m-1"
          strokeWidth={2}
        />
      </>
    );
  }

  return (
    <Tooltip
      disabled={disabled || !withoutText}
      trigger={
        <Button
          notAnimated={disabled}
          isLoading={isLoading}
          disabled={disabled}
          appearance="spaceless"
          className={clsx('p-3 relative', withoutText ? 'w-11 h-11' : 'px-6')}
          onClick={handleAddToCartClick}
          icon={contentBeforeText ?? undefined}
        >
          {buttonText}
        </Button>
      }
    >
      <span className="text-sm">Přidat do košíku</span>
    </Tooltip>
  );
};
