import { Badge } from '@components/common/Badge';
import { buttonStyles } from '@components/common/Button/buttonStyles';
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
          category: true,
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
        className="flex flex-col md:flex-row border-b border-gray-200 py-5 gap-2 md:gap-5"
      >
        <div className="flex flex-auto gap-5 max-w-md w-full">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={'Obrázek produktu'}
              width={40}
              height={40}
              className="h-24 w-24 flex-none rounded-project bg-gray-100 object-cover object-center md:h-20 md:w-20"
            />
          ) : null}
          <div>
            <div>
              <Badge size="small" color="green">
                {orderedProduct.product.category?.name ?? 'Ostatní'}
              </Badge>
            </div>
            <h4 className="font-medium text-gray-900 font-title text-2xl">
              <Link
                href={`/produkty/${encodeURIComponent(
                  orderedProduct.product.slug,
                )}`}
              >
                {orderedProduct.product.name}
              </Link>
            </h4>
          </div>
        </div>
        <div className="flex flex-row-reverse md:flex-wrap gap-5 justify-between w-full pt-0 md:pt-7">
          <dl className="flex gap-5 justify-between">
            <div className="flex w-40">
              <dd className="ml-2 text-gray-700">{orderedProduct.count} </dd>
              <dt className="font-medium text-gray-900 ml-1">kusy</dt>
            </div>
            <div className="flex">
              <dt className="font-medium text-gray-900 sr-only">Cena</dt>
              <dd className="ml-2 text-gray-700 font-semibold">
                {formatPrice(orderedProduct.totalPrice)}
              </dd>
            </div>
          </dl>
          <div className="mr-auto md:mr-0 md:ml-auto -mt-1">
            <Link
              href={`/produkty/${encodeURIComponent(
                orderedProduct.product.slug,
              )}`}
              className={buttonStyles({
                size: 'xsm',
                className: 'inline-block w-24 md:w-28 text-center',
              })}
            >
              Zobrazit
            </Link>
          </div>
        </div>
      </div>
    );
  });
};
