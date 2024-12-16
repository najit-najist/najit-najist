import { Badge } from '@components/common/Badge';
import { Price } from '@components/common/Price';
import { Tooltip } from '@components/common/Tooltip';
import { FormBreak } from '@components/common/form/FormBreak';
import {
  ExclamationTriangleIcon,
  TagIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { products } from '@najit-najist/database/models';
import { getFileUrl } from '@server/utils/getFileUrl';
import { ProductFromCart } from '@utils/getUserCart';
import NextImage from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { CountInput } from './CountInput';
import { DeleteButton } from './DeleteButton';

export const CartItem: FC<{
  data: ProductFromCart;
}> = async ({ data: { product, count: countInCart, id, price, discount } }) => {
  const mainImageAsString = product.images.at(0)?.file;
  const mainImage = mainImageAsString
    ? getFileUrl(products, product.id, mainImageAsString)
    : undefined;

  return (
    <li key={id} className="flex px-4 py-6 sm:px-6">
      {mainImage ? (
        <div className="flex-shrink-0 relative">
          <NextImage
            width={80}
            height={120}
            src={mainImage}
            alt=""
            className="w-20 rounded-project"
          />
          <div className="absolute top-1 left-1">
            {product.stock?.value !== undefined &&
            product.stock.value < countInCart ? (
              <Tooltip
                trigger={
                  <div className="text-orange-700 bg-orange-200 rounded-project w-7 h-7 p-1">
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
                href={`/produkty/${encodeURIComponent(product.slug)}`}
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
              {product.onlyForDeliveryMethod ? (
                <Badge color="yellow">
                  <TruckIcon className="w-3 h-3" /> Pouze{' '}
                  {product.onlyForDeliveryMethod!.name.toLowerCase()}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="ml-4 flow-root flex-shrink-0">
            <DeleteButton productId={product.id} />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-end items-end gap-5">
            {discount ? (
              <Price className="line-through" size="sm" value={price} />
            ) : null}
            <Price value={price - discount} />
          </div>
          <FormBreak className="w-full mt-1 mb-3" />
          <div className="flex justify-end">
            <CountInput productId={product.id} countInCart={countInCart} />
          </div>
        </div>
      </div>
    </li>
  );
};
