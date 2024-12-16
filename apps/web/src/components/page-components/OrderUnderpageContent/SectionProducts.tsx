import { database } from '@najit-najist/database';
import { products } from '@najit-najist/database/models';
import { getFileUrl } from '@server/utils/getFileUrl';
import { formatPrice } from '@utils';
import Image from 'next/image';
import Link from 'next/link';
import { FC, Fragment } from 'react';

export const SectionProducts: FC<{ orderId: number }> = async ({ orderId }) => {
  const orderedProducts = await database.query.orderedProducts.findMany({
    where: (s, { eq }) => eq(s.orderId, orderId),
    with: {
      product: {
        with: {
          images: true,
        },
      },
    },
  });

  return orderedProducts.map((orderedProduct) => {
    if (typeof orderedProduct.product === 'string') {
      return <Fragment key={orderedProduct.id}></Fragment>;
    }

    let mainImage = orderedProduct.product.images.at(0)?.file;

    if (mainImage) {
      mainImage = getFileUrl(products, orderedProduct.product.id, mainImage);
    }

    return (
      <div
        key={orderedProduct.id}
        className="flex space-x-6 border-b border-gray-200 py-10"
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={'Obrázek produktu'}
            width={80}
            height={80}
            className="h-20 w-20 flex-none rounded-project bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
          />
        ) : null}
        <div className="flex flex-auto flex-col">
          <div>
            <h4 className="font-medium text-gray-900 font-title text-2xl">
              <Link
                href={`/produkty/${encodeURIComponent(
                  orderedProduct.product.slug,
                )}`}
              >
                {orderedProduct.product.name}
              </Link>
            </h4>
            {orderedProduct.product.description ? (
              <div
                className="mt-2 text-sm text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: orderedProduct.product.description,
                }}
              ></div>
            ) : null}
          </div>
          <div className="mt-6 flex flex-1 items-end">
            <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
              <div className="flex">
                <dt className="font-medium text-gray-900">Počet: </dt>
                <dd className="ml-2 text-gray-700">{orderedProduct.count}x</dd>
              </div>
              <div className="flex pl-4 sm:pl-6">
                <dt className="font-medium text-gray-900">
                  Cena za produkt celkem:
                </dt>
                <dd className="ml-2 text-gray-700">
                  {formatPrice(orderedProduct.totalPrice)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  });
};
