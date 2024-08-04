import { logoImage } from '@components/common/Logo';
import { ProductPageManageContent } from '@components/page-components/ProductPageManageContent';
import { ADMIN_EMAIL, APP_BASE_URL } from '@constants';
import { database } from '@najit-najist/database';
import { products } from '@najit-najist/database/models';
import { logger } from '@server/logger';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getFileUrl } from '@server/utils/getFileUrl';
import { isLocalPickup } from '@utils';
import { notFound } from 'next/navigation';
import { WithContext, Product as SchemaProduct } from 'schema-dts';

export const dynamic = 'force-dynamic';

type Params = {
  params: { productSlug: string };
};

export async function generateMetadata({ params }: Params) {
  const { productSlug } = params;

  const product = await database.query.products.findFirst({
    where: (schema, { eq }) => eq(schema.slug, productSlug),
    columns: { slug: true, name: true },
  });

  if (!product) {
    return {
      title: 'Nenalezeno',
    };
  }

  return {
    title: product.name,
  };
}

export default async function Page({ params }: Params) {
  const { productSlug } = params;
  const loggedInUser = await getCachedLoggedInUser();
  const canUserSeeUnpublished =
    loggedInUser &&
    canUser(loggedInUser, {
      action: UserActions.UPDATE,
      onModel: products,
    });

  const product = await database.query.products.findFirst({
    where: (schema, { eq, and, isNotNull }) =>
      and(
        eq(schema.slug, productSlug),
        canUserSeeUnpublished ? undefined : isNotNull(schema.publishedAt),
      ),
    with: {
      images: true,
      category: true,
      onlyForDeliveryMethod: true,
      price: true,
      stock: true,
    },
  });

  if (!product) {
    logger.error(
      { productSlug, canUserSeeUnpublished },
      'Failed to get product, because user is not eligible or it does not exist',
    );

    return notFound();
  }

  const jsonLd: WithContext<SchemaProduct> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((productImage) =>
      new URL(
        getFileUrl(products, product.id, productImage.file),
        APP_BASE_URL,
      ).toString(),
    ),
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      price: product.price?.value ?? 0,
      priceCurrency: 'CZK',
      availability:
        product.stock?.value === 0
          ? 'https://schema.org/OutOfStock'
          : isLocalPickup(product.onlyForDeliveryMethod)
            ? 'https://schema.org/InStoreOnly'
            : 'https://schema.org/InStock',
      seller: {
        '@type': 'GroceryStore',
        currenciesAccepted: 'CZK',
        priceRange: '$$',
        email: ADMIN_EMAIL,
        name: 'Najít & Najíst',
        logo: new URL(logoImage.src, APP_BASE_URL).toString(),
      },
    },
    description: product.description ?? '',
    // aggregateRating: {
    //   '@type': 'AggregateRating',
    //   ratingValue: '4.5',
    //   reviewCount: 20,
    // },
    // reviews: [
    //   {
    //     '@type': 'Review',
    //     author: 'Customer1',
    //     reviewBody: "Absolutely delicious! The best baguette I've ever had.",
    //     reviewRating: {
    //       '@type': 'Rating',
    //       ratingValue: '5',
    //     },
    //   },
    //   {
    //     '@type': 'Review',
    //     author: 'Customer2',
    //     reviewBody: 'Great texture and flavor. Will buy again.',
    //     reviewRating: {
    //       '@type': 'Rating',
    //       ratingValue: '4.5',
    //     },
    //   },
    // ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageManageContent
        isEditorHeaderShown={
          loggedInUser &&
          canUser(loggedInUser, {
            action: UserActions.UPDATE,
            onModel: products,
          })
        }
        viewType={'view'}
        product={product}
      />
    </>
  );
}
