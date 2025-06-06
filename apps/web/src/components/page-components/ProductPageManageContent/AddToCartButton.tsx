'use client';

import { Button } from '@components/common/Button';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Tooltip } from '@components/common/Tooltip';
import { ProductWithRelationsLocal } from '@custom-types';
import { PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { usePlausible } from '@hooks/usePlausible';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { products } from '@najit-najist/database/models';
import { getFileUrl } from '@server/utils/getFileUrl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@trpc/web';
import { handlePromiseForToast } from '@utils/handleActionForToast';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FC,
  ReactElement,
  ReactNode,
  useActionState,
  useCallback,
} from 'react';
import { toast } from 'sonner';

import { CustomImage } from './CustomImage';
import { addProductToCartAction } from './actions/addProductToCartAction';

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
          href="/muj-ucet/kosik"
          className={buttonStyles({
            className: 'mt-3 inline-block !text-xs',
            size: 'xsm',
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
  const plausible = usePlausible();
  const queryClient = useQueryClient();
  const { mutateAsync: addToCart, isPending: isLoading } = useMutation({
    mutationKey: ['cart'],
    mutationFn: addProductToCartAction,
  });

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
        router.prefetch('/muj-ucet/kosik');
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

    await addToCartPromise.then(() => {
      plausible.trackEvent('AddToCart', {
        props: {
          produktId: String(productId),
        },
      });
    });
  }, [addToCart, productId, productMetadata, queryClient, router, plausible]);

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
          animations={!disabled}
          isLoading={isLoading}
          disabled={disabled}
          className={clsx('!p-3 relative', withoutText ? 'w-11 h-11' : 'px-3')}
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
