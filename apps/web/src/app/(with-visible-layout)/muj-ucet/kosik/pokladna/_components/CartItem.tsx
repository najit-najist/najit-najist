'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  AppRouterOutput,
  AvailableModels,
  getFileUrl,
} from '@najit-najist/api';
import { Badge, NumberInput } from '@najit-najist/ui';
import { trpc } from '@trpc';
import clsx from 'clsx';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDebounce } from 'usehooks-ts';

export const CartItem: FC<
  AppRouterOutput['profile']['cart']['products']['get']['many'][number]
> = ({ product, count, id }) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { startTransition, isActive: isDoingTransition } =
    useReactTransitionContext();

  const { mutateAsync: updateItem } =
    trpc.profile.cart.products.update.useMutation();
  const { mutateAsync: removeItem, isLoading: isRemoving } =
    trpc.profile.cart.products.remove.useMutation();

  const [cartItemQuantity, setCartItemQuantity] = useState(count);
  const debouncedItemQuantity = useDebounce(cartItemQuantity, 300);
  let mainImage = product.images.at(0);

  if (mainImage) {
    mainImage = getFileUrl(AvailableModels.PRODUCTS, product.id, mainImage);
  }

  useEffect(() => {
    if (debouncedItemQuantity !== count) {
      startTransition(async () => {
        await updateItem({
          product: { id: product.id },
          count: debouncedItemQuantity,
        });
        await utils.profile.cart.products.get.many.invalidate();

        router.refresh();
      });
    }
  }, [
    debouncedItemQuantity,
    updateItem,
    product,
    count,
    router,
    utils,
    startTransition,
  ]);

  const handleCountChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextValue = Number(event.target.value);

      setCartItemQuantity(nextValue);
    },
    []
  );
  // todo revalidate items after morph
  const handleItemDelete = useCallback(async () => {
    if (!confirm('Opravdu vymazat z košíku?')) {
      return;
    }

    startTransition(async () => {
      await removeItem({
        product: {
          id: product.id,
        },
      });

      await utils.profile.cart.products.get.many.invalidate();

      router.refresh();
    });
  }, [product.id, removeItem, router, startTransition, utils]);

  return (
    <li key={id} className="flex px-4 py-6 sm:px-6">
      {mainImage ? (
        <div className="flex-shrink-0">
          <NextImage
            width={80}
            height={120}
            src={mainImage}
            alt=""
            className="w-20 rounded-md"
          />
        </div>
      ) : null}

      <div className="ml-6 flex flex-1 flex-col">
        <div className="flex">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm">
              <Link
                href={`/produkty/${product.slug}`}
                className="font-medium text-gray-700 hover:text-gray-800"
              >
                {product.name}
              </Link>
            </h4>
            <Badge color="blue">{product.category?.name ?? 'Ostatní'}</Badge>
          </div>

          <div className="ml-4 flow-root flex-shrink-0">
            <button
              type="button"
              className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-red-300 hover:text-red-500"
              disabled={isRemoving}
              onClick={handleItemDelete}
            >
              <span className="sr-only">Odstranit</span>
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-end justify-between pt-2">
          <p
            className={clsx(
              'text-2xl font-semibold flex-none',
              isDoingTransition ? 'blur-sm' : ''
            )}
          >
            <span className="tracking-wider text-project-primary">
              {product.price.value * count}
            </span>
            <span className="text-sm tracking-[-0.1rem] text-gray-700 underline">
              Kč
            </span>
          </p>

          <div className="ml-4">
            <NumberInput
              label="Počet"
              className="max-w-[4rem]"
              step={1}
              min={1}
              max={99}
              disabled={isRemoving}
              value={cartItemQuantity}
              onChange={handleCountChange}
            />
          </div>
        </div>
      </div>
    </li>
  );
};
