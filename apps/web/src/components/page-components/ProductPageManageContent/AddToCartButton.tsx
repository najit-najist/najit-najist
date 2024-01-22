'use client';

import { PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { Product } from '@najit-najist/api';
import { Collections, getFileUrl } from '@najit-najist/pb';
import { Button, Tooltip, toast } from '@najit-najist/ui';
import { trpc } from '@trpc';
import clsx from 'clsx';
import { FC, ReactElement, ReactNode } from 'react';

import { CustomImage } from './CustomImage';

export type AddToCartButtonProps = {
  productId: Product['id'];
  disabled?: boolean;
  withoutText?: boolean;
  withIcon?: boolean;
  productMetadata?: Pick<Product, 'name' | 'images'>;
};

const SuccessMessage: FC<
  Pick<AddToCartButtonProps, 'productId' | 'productMetadata'>
> = ({ productId, productMetadata }) => {
  return (
    <div className="flex items-center">
      {productMetadata?.images.length ? (
        <div className="relative w-12 h-12 rounded-full mr-3 flex-none">
          <CustomImage
            onlyImage
            src={getFileUrl(
              Collections.PRODUCTS,
              productId,
              productMetadata.images.at(0)!,
              { height: 50, quality: 60 }
            )}
          />
        </div>
      ) : null}
      <p>
        <b>
          Přidali jste si{' '}
          {productMetadata?.name ? (
            <span className="text-project-secondary">
              {productMetadata.name}
            </span>
          ) : (
            'produkt'
          )}{' '}
          do Vašeho košíku!
        </b>
      </p>
    </div>
  );
};

export const AddToCartButton: FC<AddToCartButtonProps> = ({
  productId,
  disabled,
  withoutText,
  withIcon,
  productMetadata,
}) => {
  const utils = trpc.useUtils();
  const { mutateAsync: addToCart, isLoading } =
    trpc.profile.cart.products.add.useMutation();
  let buttonText: ReactNode = null;
  let contentBeforeText: ReactElement | null = null;

  const handleAddToCartClick = async () => {
    // add to cart and refetch newest cart for client
    const addToCartPromise = addToCart({ product: { id: productId } }).then(
      () => utils.profile.cart.products.get.many.invalidate()
    );

    toast.promise(addToCartPromise, {
      loading: 'Přídávám do košíku',
      success: (
        <SuccessMessage
          productId={productId}
          productMetadata={productMetadata}
        />
      ),
      error: (error) => (
        <b>Nemohli jsme přidat produkt do Vašeho košíku. {error.message}</b>
      ),
    });

    await addToCartPromise;
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
