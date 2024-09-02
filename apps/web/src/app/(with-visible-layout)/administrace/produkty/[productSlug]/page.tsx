import { ProductPageManageContent } from '@components/page-components/ProductPageManageContent';
import { products } from '@najit-najist/database/models';
import { logger } from '@server/logger';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getProduct } from '@server/utils/getProduct';
import { getLoggedInUser } from '@server/utils/server';
import { notFound } from 'next/navigation';

export const revalidate = 0;

// TODO
const jsonLd = {
  '@context': 'http://schema.org',
  '@type': 'Product',
  name: 'Delicious Baguette',
  image: [
    'https://example.com/baguette-image1.jpg',
    'https://example.com/baguette-image2.jpg',
  ],
  category: 'Baguettes',
  offers: {
    '@type': 'Offer',
    price: '5.99',
    priceCurrency: 'USD',
  },
  description:
    'A freshly baked baguette with a crispy crust and soft interior. Perfect for any meal or occasion.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: 20,
  },
  reviews: [
    {
      '@type': 'Review',
      author: 'Customer1',
      reviewBody: "Absolutely delicious! The best baguette I've ever had.",
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
    },
    {
      '@type': 'Review',
      author: 'Customer2',
      reviewBody: 'Great texture and flavor. Will buy again.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.5',
      },
    },
  ],
};

type Params = {
  params: { productSlug: string };
};

export async function generateMetadata({ params }: Params) {
  const { productSlug } = params;
  const decodedSlug = decodeURIComponent(productSlug);

  const product = await getProduct({
    slug: decodedSlug,
  });

  if (!product) {
    return {
      title: 'Nenalezeno',
    };
  }

  return {
    title: `Upravení ${product.name}`,
  };
}

export default async function Page({ params }: Params) {
  const { productSlug } = params;
  const loggedInUser = await getLoggedInUser();
  const decodedSlug = decodeURIComponent(productSlug);

  const product = await getProduct(
    {
      slug: decodedSlug,
    },
    { loggedInUser },
  );

  if (!product) {
    logger.error(
      { productSlug, loggedInUser: !!loggedInUser },
      'Could not find product to administrate',
    );
    notFound();
  }

  return (
    <ProductPageManageContent
      isEditorHeaderShown={
        loggedInUser &&
        canUser(loggedInUser, {
          action: UserActions.UPDATE,
          onModel: products,
        })
      }
      viewType={'edit'}
      product={product}
    />
  );
}
