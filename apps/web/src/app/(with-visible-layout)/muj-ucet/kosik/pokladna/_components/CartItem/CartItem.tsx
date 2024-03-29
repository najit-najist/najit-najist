import {
  ExclamationTriangleIcon,
  TagIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { AppRouterOutput, DeliveryMethod, Product } from '@najit-najist/api';
import { Collections, getFileUrl } from '@najit-najist/pb';
import { Badge, Tooltip } from '@najit-najist/ui';
import NextImage from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { DeleteButton } from './DeleteButton';
import { PriceInfo } from './PriceInfo';

export const CartItem: FC<
  AppRouterOutput['profile']['cart']['products']['get']['many'][number] & {
    deliveryMethods: Map<DeliveryMethod['id'], DeliveryMethod>;
  }
> = ({ product, count: countInCart, id, deliveryMethods }) => {
  let mainImage = product.images.at(0);

  if (mainImage) {
    mainImage = getFileUrl(Collections.PRODUCTS, product.id, mainImage);
  }

  return (
    <li key={id} className="flex px-4 py-6 sm:px-6">
      {mainImage ? (
        <div className="flex-shrink-0 relative">
          <NextImage
            width={80}
            height={120}
            src={mainImage}
            alt=""
            className="w-20 rounded-md"
          />
          <div className="absolute top-1 left-1">
            {product.stock?.count !== undefined &&
            product.stock.count < countInCart ? (
              <Tooltip
                trigger={
                  <div className="text-orange-700 bg-orange-200 rounded-md w-7 h-7 p-1">
                    <ExclamationTriangleIcon />
                  </div>
                }
              >
                <p className="max-w-sm">
                  Možství ve Vašem košíku přesahuje naše skladové možnosti a tak
                  nemůžeme zajistit úplné dodání.
                </p>
              </Tooltip>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="ml-6 flex flex-1 flex-col">
        <div className="flex">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm">
              <Link
                href={`/produkty/${product.slug}`}
                className="font-medium text-gray-700 hover:text-gray-800 hover:underline"
              >
                {product.name}
              </Link>
            </h4>
            <div className="flex-wrap gap-1 flex mt-2">
              <Badge color="green">
                <TagIcon className="w-3 h-3" />{' '}
                {product.category?.name ?? 'Ostatní'}
              </Badge>
              {product.onlyDeliveryMethods.length ? (
                <Badge color="yellow">
                  <TruckIcon className="w-3 h-3" /> Pouze{' '}
                  {product.onlyDeliveryMethods
                    .filter((dId) => deliveryMethods.has(dId))
                    .map((deliveryMethodId) =>
                      deliveryMethods.get(deliveryMethodId)!.name.toLowerCase()
                    )
                    .join(' nebo ')}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="ml-4 flow-root flex-shrink-0">
            <DeleteButton productId={product.id} />
          </div>
        </div>

        <div className="flex flex-wrap-reverse sm:flex-row flex-1 items-end justify-between mt-4">
          <PriceInfo
            productId={product.id}
            countInCart={countInCart}
            productPrice={product.price.value}
          />
        </div>
      </div>
    </li>
  );
};
