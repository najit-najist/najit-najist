'use client';

import { trpc } from '@client/trpc';
import { ProductWithRelationsLocal } from '@custom-types';
import { PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { products } from '@najit-najist/database/models';
import { Button, Tooltip, buttonStyles, toast } from '@najit-najist/ui';
import { getFileUrl } from '@server/utils/getFileUrl';
import { useQueryClient } from '@tanstack/react-query';
import { handlePromiseForToast } from '@utils/handleActionForToast';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, ReactElement, ReactNode, useCallback } from 'react';

import { CustomImage } from './CustomImage';

export type AddToCartButtonProps = {
  productId: ProductWithRelationsLocal['id'];
  disabled?: boolean;
  withoutText?: boolean;
  withIcon?: boolean;
  productMetadata?: Pick<ProductWithRelationsLocal, 'name' | 'images' | 'slug'>;
};

const SuccessMessage: FC<
  Pick<AddToCartButtonProps, 'productId' | 'productMetadata'>
> = ({ productId, productMetadata }) => {
  return (
    <div className="flex items-start">
      {productMetadata?.images.length ? (
        <div className="relative w-12 h-12 rounded-full mr-3 flex-none">
          <CustomImage
            onlyImage
            src={getFileUrl(
              products,
              productId,
              productMetadata.images.at(0)!.file,
              { height: 50, quality: 60 },
            )}
          />
        </div>
      ) : null}
      <div className="w-full">
        <p className="block">
          <b>
            Přidali jste si{' '}
            {productMetadata?.name ? (
              <Link
                href={`/produkty/${encodeURIComponent(productMetadata.slug)}`}
                className="text-project-secondary hover:underline"
              >
                {productMetadata.name}
              </Link>
            ) : (
              'produkt'
            )}{' '}
            do Vašeho košíku!
          </b>
        </p>
        <Link
          href="/muj-ucet/kosik/pokladna"
          className={buttonStyles({
            className: 'mt-3 inline-block',
            appearance: 'extraSmall',
          })}
        >
          Přejít do košíku
        </Link>
      </div>
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
  const queryClient = useQueryClient();
  const { mutateAsync: addToCart, isPending: isLoading } =
    trpc.profile.cart.products.add.useMutation();
  const router = useRouter();
  let buttonText: ReactNode = null;
  let contentBeforeText: ReactElement | null = null;

  const handleAddToCartClick = useCallback(async () => {
    // add to cart and refetch newest cart for client
    const addToCartPromise = addToCart({ product: { id: productId } }).then(
      async () => {
        await queryClient.invalidateQueries({
          queryKey: useUserCartQueryKey,
        });
        router.prefetch('/muj-ucet/kosik/pokladna');
      },
    );

    toast.promise(handlePromiseForToast(addToCartPromise), {
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
  }, [addToCart, productId, productMetadata, queryClient, router]);

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
